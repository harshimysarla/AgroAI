"""
EfficientNetB0 Architecture Definition for Tomato Leaf Disease Classification.
Implements transfer learning backbone with custom classification head and fine-tuning support.
"""

from typing import Optional
import keras
from keras import layers, regularizers

from backend.ml.data.constants import INPUT_SHAPE, NUM_CLASSES


def build_efficientnet_model(
    num_classes: int = NUM_CLASSES,
    weights: Optional[str] = "imagenet",
    freeze_backbone: bool = True,
    dropout_rate: float = 0.3,
    l2_reg: float = 1e-4,
    learning_rate: float = 1e-4,
) -> keras.Model:
    """
    Constructs the EfficientNetB0 classification model.
    
    Architecture:
    1. Input layer (224, 224, 3)
    2. EfficientNetB0 base (include_top=False)
    3. GlobalAveragePooling2D
    4. BatchNormalization
    5. Dense(256, activation='relu', kernel_regularizer=L2)
    6. Dropout(dropout_rate)
    7. Dense(num_classes, activation='softmax', name='predictions')
    """
    inputs = keras.Input(shape=INPUT_SHAPE, name="leaf_image_input")

    # EfficientNetB0 Backbone
    base_model = keras.applications.EfficientNetB0(
        include_top=False,
        weights=weights,
        input_tensor=inputs,
        pooling=None
    )
    base_model.trainable = not freeze_backbone

    # Feature extraction & classification head
    x = base_model.output
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.BatchNormalization(name="head_batch_norm")(x)
    x = layers.Dense(
        256,
        activation="relu",
        kernel_regularizer=regularizers.l2(l2_reg),
        name="dense_feature_projection"
    )(x)
    x = layers.Dropout(dropout_rate, name="head_dropout")(x)
    outputs = layers.Dense(
        num_classes,
        activation="softmax",
        name="predictions"
    )(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="TomatoCare_EfficientNetB0")

    optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


def unfreeze_for_fine_tuning(
    model: keras.Model,
    unfreeze_from_layer_index: int = -30,
    fine_tune_learning_rate: float = 1e-5
) -> keras.Model:
    """
    Unfreezes the top layers of the backbone for fine-tuning.
    Recompiles with a smaller learning rate to prevent catastrophic forgetting.
    """
    # Find the backbone model or layers
    for layer in model.layers[unfreeze_from_layer_index:]:
        if not isinstance(layer, layers.BatchNormalization):
            layer.trainable = True

    optimizer = keras.optimizers.Adam(learning_rate=fine_tune_learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model
