"""
Dataset loader and validator for the PlantVillage Tomato Disease Dataset.
Handles directory verification, stratified train/val/test splitting, and tf.data pipeline creation.
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
from PIL import Image
import tensorflow as tf

from backend.ml.data.constants import CLASS_NAMES, FOLDER_ALIAS_MAP, IMAGE_SIZE
from backend.ml.data.augmentations import get_data_augmentation_layers


def scan_and_validate_dataset(data_dir: str) -> Dict[str, Any]:
    """
    Scans the dataset directory and validates the presence of tomato classes.
    Returns:
    - is_valid: bool
    - message: str
    - class_counts: Dict[str, int]
    - total_images: int
    - file_paths_by_class: Dict[str, List[str]]
    - missing_classes: List[str]
    """
    data_path = Path(data_dir)
    if not data_path.exists() or not data_path.is_dir():
        return {
            "is_valid": False,
            "message": f"Dataset directory '{data_dir}' does not exist or is not a directory.",
            "class_counts": {},
            "total_images": 0,
            "file_paths_by_class": {},
            "missing_classes": list(CLASS_NAMES)
        }

    # Discover subdirectories
    subdirs = [d for d in data_path.iterdir() if d.is_dir()]
    
    # Map discovered folders to canonical class names
    matched_dirs: Dict[str, Path] = {}
    for d in subdirs:
        folder_name = d.name
        if folder_name in FOLDER_ALIAS_MAP:
            canonical = FOLDER_ALIAS_MAP[folder_name]
            matched_dirs[canonical] = d
        elif folder_name in CLASS_NAMES:
            matched_dirs[folder_name] = d

    missing_classes = [c for c in CLASS_NAMES if c not in matched_dirs]
    
    file_paths_by_class: Dict[str, List[str]] = {c: [] for c in CLASS_NAMES}
    class_counts: Dict[str, int] = {c: 0 for c in CLASS_NAMES}
    corrupted_files: List[str] = []

    valid_extensions = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}

    for canonical_class, dir_path in matched_dirs.items():
        for file in dir_path.iterdir():
            if file.is_file() and file.suffix in valid_extensions:
                file_paths_by_class[canonical_class].append(str(file.resolve()))
        class_counts[canonical_class] = len(file_paths_by_class[canonical_class])

    total_images = sum(class_counts.values())

    is_valid = len(missing_classes) == 0 and total_images > 0 and all(c > 0 for c in class_counts.values())

    if not is_valid:
        msg = f"Dataset incomplete. Found {len(matched_dirs)}/{len(CLASS_NAMES)} classes. Missing: {', '.join(missing_classes) if missing_classes else 'None (some classes are empty)'}."
    else:
        msg = f"Dataset valid. Found all 10 classes with {total_images} total verified images."

    return {
        "is_valid": is_valid,
        "message": msg,
        "class_counts": class_counts,
        "total_images": total_images,
        "file_paths_by_class": file_paths_by_class,
        "missing_classes": missing_classes,
        "corrupted_files": corrupted_files
    }


def create_stratified_splits(
    file_paths_by_class: Dict[str, List[str]],
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42
) -> Tuple[List[Tuple[str, int]], List[Tuple[str, int]], List[Tuple[str, int]]]:
    """
    Creates stratified (train, val, test) splits with fixed random seed for strict reproducibility.
    Returns:
    - (train_items, val_items, test_items) where each item is (file_path, class_idx)
    """
    np.random.seed(seed)
    
    train_items: List[Tuple[str, int]] = []
    val_items: List[Tuple[str, int]] = []
    test_items: List[Tuple[str, int]] = []

    for idx, class_name in enumerate(CLASS_NAMES):
        paths = list(file_paths_by_class.get(class_name, []))
        np.random.shuffle(paths)
        
        n_total = len(paths)
        if n_total == 0:
            continue
            
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)
        # Ensure at least 1 in val and test if n_total >= 3
        if n_total >= 3:
            n_train = max(1, n_train)
            n_val = max(1, n_val)
        
        train_paths = paths[:n_train]
        val_paths = paths[n_train:n_train + n_val]
        test_paths = paths[n_train + n_val:]
        
        train_items.extend([(p, idx) for p in train_paths])
        val_items.extend([(p, idx) for p in val_paths])
        test_items.extend([(p, idx) for p in test_paths])

    np.random.shuffle(train_items)
    np.random.shuffle(val_items)
    np.random.shuffle(test_items)

    return train_items, val_items, test_items


def _parse_image_and_label(filename: tf.Tensor, label: tf.Tensor) -> Tuple[tf.Tensor, tf.Tensor]:
    """Reads image file from disk and parses it into float32 [0, 255] RGB tensor of shape (224, 224, 3)."""
    image_raw = tf.io.read_file(filename)
    image = tf.io.decode_image(image_raw, channels=3, expand_animations=False)
    image = tf.image.resize(image, IMAGE_SIZE, method=tf.image.ResizeMethod.BILINEAR)
    image = tf.cast(image, tf.float32)
    return image, label


def create_tf_datasets(
    train_items: List[Tuple[str, int]],
    val_items: List[Tuple[str, int]],
    test_items: List[Tuple[str, int]],
    batch_size: int = 32,
    apply_aug: bool = True
) -> Tuple[tf.data.Dataset, tf.data.Dataset, tf.data.Dataset]:
    """
    Constructs optimized tf.data.Dataset pipelines with prefetching, batching, and training-only augmentation.
    """
    AUTOTUNE = tf.data.AUTOTUNE

    def build_ds(items: List[Tuple[str, int]], is_training: bool) -> tf.data.Dataset:
        if not items:
            return tf.data.Dataset.from_tensors((
                tf.zeros((0, *IMAGE_SIZE, 3), dtype=tf.float32),
                tf.zeros((0,), dtype=tf.int32)
            ))
            
        filenames = [x[0] for x in items]
        labels = [x[1] for x in items]

        ds = tf.data.Dataset.from_tensor_slices((filenames, labels))
        if is_training:
            ds = ds.shuffle(buffer_size=len(items), seed=42, reshuffle_each_iteration=True)
            
        ds = ds.map(_parse_image_and_label, num_parallel_calls=AUTOTUNE)

        if is_training and apply_aug:
            aug_layer = get_data_augmentation_layers()
            ds = ds.map(lambda x, y: (aug_layer(x, training=True), y), num_parallel_calls=AUTOTUNE)

        ds = ds.batch(batch_size)
        ds = ds.prefetch(buffer_size=AUTOTUNE)
        return ds

    train_ds = build_ds(train_items, is_training=True)
    val_ds = build_ds(val_items, is_training=False)
    test_ds = build_ds(test_items, is_training=False)

    return train_ds, val_ds, test_ds
