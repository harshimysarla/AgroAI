"""
Data Augmentation Pipeline for EfficientNetB0 Training.
Applied strictly to training data only (never to validation or test data).
"""

import keras
from keras import layers


def get_data_augmentation_layers() -> keras.Sequential:
    """
    Returns a Keras Sequential model with agricultural-specific augmentations:
    - Random horizontal and vertical flips (leaf orientation invariance)
    - Random rotation (+-15 degrees)
    - Random zoom (+-10%)
    - Random translation/shift (+-10%)
    - Random contrast (+-10%)
    """
    return keras.Sequential(
        [
            layers.RandomFlip("horizontal_and_vertical", name="aug_random_flip"),
            layers.RandomRotation(0.08, fill_mode="reflect", name="aug_random_rotation"),
            layers.RandomZoom(height_factor=(-0.1, 0.1), width_factor=(-0.1, 0.1), name="aug_random_zoom"),
            layers.RandomTranslation(height_factor=0.08, width_factor=0.08, fill_mode="reflect", name="aug_random_translation"),
            layers.RandomContrast(0.1, name="aug_random_contrast"),
        ],
        name="data_augmentation",
    )
