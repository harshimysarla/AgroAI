"""
Complete Training Pipeline for TomatoCare AI EfficientNetB0.
Implements callbacks, two-stage transfer learning, history tracking, and artifact persistence.
"""

import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional

import keras
from keras import callbacks
import numpy as np

from backend.ml.data.constants import CLASS_NAMES, NUM_CLASSES
from backend.ml.data.dataset_loader import (
    scan_and_validate_dataset,
    create_stratified_splits,
    create_tf_datasets
)
from backend.ml.training.model_builder import build_efficientnet_model, unfreeze_for_fine_tuning


class TrainingHistoryLogger(callbacks.Callback):
    """Logs epoch metrics and execution time per epoch."""
    def __init__(self):
        super().__init__()
        self.history_dict = {
            "epoch": [],
            "loss": [],
            "accuracy": [],
            "val_loss": [],
            "val_accuracy": [],
            "lr": []
        }
        self.epoch_start_time = 0.0

    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_start_time = time.time()

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        self.history_dict["epoch"].append(epoch + 1)
        self.history_dict["loss"].append(float(logs.get("loss", 0.0)))
        self.history_dict["accuracy"].append(float(logs.get("accuracy", 0.0)))
        self.history_dict["val_loss"].append(float(logs.get("val_loss", 0.0)))
        self.history_dict["val_accuracy"].append(float(logs.get("val_accuracy", 0.0)))
        
        try:
            lr_val = self.model.optimizer.learning_rate
            if hasattr(lr_val, "numpy"):
                lr = float(lr_val.numpy())
            else:
                lr = float(lr_val)
        except Exception:
            lr = 0.0
        self.history_dict["lr"].append(lr)


def train_tomato_model(
    data_dir: str,
    output_dir: str = "backend/artifacts",
    batch_size: int = 32,
    initial_epochs: int = 15,
    fine_tune_epochs: int = 10,
    initial_lr: float = 1e-4,
    fine_tune_lr: float = 1e-5,
    freeze_backbone: bool = True,
    use_pretrained_weights: bool = True
) -> Dict[str, Any]:
    """
    Executes the complete training workflow on the specified dataset directory.
    Saves best model and metadata to output_dir.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"[*] Scanning dataset in: {data_dir}")
    scan_result = scan_and_validate_dataset(data_dir)
    if not scan_result["is_valid"]:
        raise ValueError(f"Dataset validation failed: {scan_result['message']}")

    print(f"[+] Found {scan_result['total_images']} images across {len(CLASS_NAMES)} classes.")
    
    # 1. Stratified Splits
    train_items, val_items, test_items = create_stratified_splits(
        scan_result["file_paths_by_class"],
        train_ratio=0.70,
        val_ratio=0.15,
        test_ratio=0.15,
        seed=42
    )
    print(f"[+] Split dataset -> Train: {len(train_items)}, Val: {len(val_items)}, Test: {len(test_items)}")

    # 2. TF Datasets
    train_ds, val_ds, test_ds = create_tf_datasets(
        train_items, val_items, test_items,
        batch_size=batch_size,
        apply_aug=True
    )

    # 3. Model Construction
    weights = "imagenet" if use_pretrained_weights else None
    model = build_efficientnet_model(
        num_classes=NUM_CLASSES,
        weights=weights,
        freeze_backbone=freeze_backbone,
        learning_rate=initial_lr
    )
    
    model_checkpoint_path = str(output_path / "best_model.keras")
    
    # Callbacks
    history_logger = TrainingHistoryLogger()
    cb_checkpoint = callbacks.ModelCheckpoint(
        filepath=model_checkpoint_path,
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    )
    cb_early_stop = callbacks.EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    cb_reduce_lr = callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=3,
        min_lr=1e-7,
        verbose=1
    )

    start_time = time.time()

    # 4. Phase 1 Training (Classifier Head)
    print(f"[*] Starting Phase 1 Training for {initial_epochs} epochs (Backbone frozen)...")
    history_phase1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=initial_epochs,
        callbacks=[cb_checkpoint, cb_early_stop, cb_reduce_lr, history_logger]
    )

    # 5. Phase 2 Fine-Tuning (if requested and backbone was initially frozen)
    if freeze_backbone and fine_tune_epochs > 0:
        print(f"[*] Starting Phase 2 Fine-Tuning for {fine_tune_epochs} epochs (Top layers unfrozen)...")
        model = unfreeze_for_fine_tuning(model, unfreeze_from_layer_index=-30, fine_tune_learning_rate=fine_tune_lr)
        history_phase2 = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=initial_epochs + fine_tune_epochs,
            initial_epoch=len(history_logger.history_dict["epoch"]),
            callbacks=[cb_checkpoint, cb_early_stop, cb_reduce_lr, history_logger]
        )

    total_training_time = time.time() - start_time
    print(f"[+] Training completed in {total_training_time:.2f} seconds.")

    # 6. Save Class Indices Mapping
    class_indices_path = output_path / "class_indices.json"
    with open(class_indices_path, "w") as f:
        json.dump({str(idx): name for idx, name in enumerate(CLASS_NAMES)}, f, indent=2)

    # 7. Save Training History
    history_path = output_path / "training_history.json"
    with open(history_path, "w") as f:
        json.dump(history_logger.history_dict, f, indent=2)

    # 8. Save Model Metadata
    total_params = int(model.count_params())
    trainable_params = int(sum(np.prod(p.shape) for p in model.trainable_weights))
    
    metadata = {
        "model_name": "TomatoCare_EfficientNetB0",
        "architecture": "EfficientNetB0",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_shape": [224, 224, 3],
        "num_classes": NUM_CLASSES,
        "classes": CLASS_NAMES,
        "dataset_summary": {
            "total_samples": scan_result["total_images"],
            "train_samples": len(train_items),
            "val_samples": len(val_items),
            "test_samples": len(test_items),
            "class_distribution": scan_result["class_counts"]
        },
        "training_params": {
            "batch_size": batch_size,
            "initial_epochs": initial_epochs,
            "fine_tune_epochs": fine_tune_epochs,
            "initial_learning_rate": initial_lr,
            "fine_tune_learning_rate": fine_tune_lr,
            "optimizer": "Adam",
            "loss_function": "sparse_categorical_crossentropy",
            "total_params": total_params,
            "trainable_params": trainable_params,
            "training_duration_seconds": round(total_training_time, 2)
        }
    }
    metadata_path = output_path / "model_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Save final model as well
    model.save(str(output_path / "final_model.keras"))

    return {
        "status": "success",
        "model_path": model_checkpoint_path,
        "metadata": metadata,
        "history": history_logger.history_dict,
        "test_items": test_items
    }
