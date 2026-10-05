"""
Grad-CAM (Gradient-weighted Class Activation Mapping) for EfficientNetB0.
Generates genuine visual explanations for tomato leaf disease predictions.
"""

import base64
import io
from typing import Tuple, Optional, Dict, Any
import numpy as np
from PIL import Image
import cv2
import tensorflow as tf
import keras

from backend.ml.data.preprocessor import preprocess_pil_image


def find_last_conv_layer(model: keras.Model) -> Optional[str]:
    """
    Finds the name of the last convolutional layer in the EfficientNetB0 architecture.
    """
    # First, check if the model has a nested base_model (e.g. EfficientNetB0)
    for layer in reversed(model.layers):
        if isinstance(layer, keras.Model):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, (keras.layers.Conv2D, keras.layers.DepthwiseConv2D)) or "conv" in sub_layer.name.lower():
                    return sub_layer.name
        if isinstance(layer, (keras.layers.Conv2D, keras.layers.DepthwiseConv2D)) or "top_conv" in layer.name.lower():
            return layer.name

    # Fallback to known standard layer names in EfficientNetB0
    for candidate in ["top_conv", "block7a_project_conv", "conv2d_last"]:
        for layer in model.layers:
            if candidate in layer.name:
                return layer.name
    return None


def generate_gradcam_heatmap(
    model: keras.Model,
    image_tensor: np.ndarray,
    class_index: Optional[int] = None,
    conv_layer_name: Optional[str] = None
) -> np.ndarray:
    """
    Computes Grad-CAM heatmap for a given input tensor (1, 224, 224, 3) and class index.
    """
    # 1. Identify the target conv layer
    target_layer_name = conv_layer_name or find_last_conv_layer(model)
    if not target_layer_name:
        raise ValueError("Could not automatically locate a convolutional layer in the model for Grad-CAM.")

    # Locate layer (could be in main model or inner backbone model)
    target_layer = None
    backbone_model = None

    for layer in model.layers:
        if layer.name == target_layer_name:
            target_layer = layer
            break
        if isinstance(layer, keras.Model):
            for sub_layer in layer.layers:
                if sub_layer.name == target_layer_name:
                    target_layer = sub_layer
                    backbone_model = layer
                    break

    if target_layer is None:
        raise ValueError(f"Convolutional layer '{target_layer_name}' not found in model.")

    # Create a sub-model or gradient function
    # To support both wrapped backbone and flat architecture:
    try:
        if backbone_model is not None:
            # Build grad model mapping input -> (conv_output, final_prediction)
            grad_model = keras.Model(
                inputs=model.inputs,
                outputs=[backbone_model.get_layer(target_layer_name).output, model.output]
            )
        else:
            grad_model = keras.Model(
                inputs=model.inputs,
                outputs=[model.get_layer(target_layer_name).output, model.output]
            )

        with tf.GradientTape() as tape:
            tf_input = tf.cast(image_tensor, tf.float32)
            tape.watch(tf_input)
            conv_outputs, predictions = grad_model(tf_input)
            
            if class_index is None:
                class_index = int(tf.argmax(predictions[0]))
                
            loss = predictions[:, class_index]

        # Compute gradients of class score with respect to conv outputs
        grads = tape.gradient(loss, conv_outputs)
        
        # Global average pooling of gradients -> alpha weights
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weighted combination of feature maps
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # Apply ReLU to keep only features that positively correlate with the class
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
        return heatmap.numpy()

    except Exception as e:
        # Fallback approximation if graph manipulation fails
        print(f"[!] Grad-CAM gradient calculation encountered error: {e}. Falling back to activation map.")
        if backbone_model is not None:
            feat_model = keras.Model(inputs=model.inputs, outputs=backbone_model.get_layer(target_layer_name).output)
        else:
            feat_model = keras.Model(inputs=model.inputs, outputs=model.get_layer(target_layer_name).output)
        acts = feat_model(tf.cast(image_tensor, tf.float32))[0].numpy()
        heatmap = np.mean(acts, axis=-1)
        heatmap = np.maximum(heatmap, 0)
        max_val = np.max(heatmap)
        if max_val > 0:
            heatmap = heatmap / max_val
        return heatmap


def overlay_gradcam(
    original_pil_img: Image.Image,
    heatmap: np.ndarray,
    alpha: float = 0.45,
    colormap: int = cv2.COLORMAP_JET
) -> Tuple[Image.Image, Image.Image]:
    """
    Overlays a 2D heatmap on the original PIL image.
    Returns:
    - (overlay_image_pil, heatmap_colored_pil)
    """
    orig_np = np.array(original_pil_img.convert("RGB"))
    h, w, _ = orig_np.shape

    # Resize heatmap to match image dimensions
    heatmap_resized = cv2.resize(heatmap, (w, h), interpolation=cv2.INTER_CUBIC)
    
    # Scale heatmap to [0, 255] uint8
    heatmap_uint8 = np.uint8(255 * np.clip(heatmap_resized, 0, 1))

    # Apply colormap (JET or TURBO)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, colormap)
    heatmap_colored_rgb = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    # Superimpose heatmap onto original image
    overlay = np.float32(heatmap_colored_rgb) * alpha + np.float32(orig_np) * (1.0 - alpha)
    overlay = np.clip(overlay, 0, 255).astype(np.uint8)

    return Image.fromarray(overlay), Image.fromarray(heatmap_colored_rgb)


def generate_gradcam_explanation(
    model: keras.Model,
    pil_image: Image.Image,
    class_index: Optional[int] = None,
    alpha: float = 0.45
) -> Dict[str, Any]:
    """
    Full Grad-CAM workflow. Preprocesses image, calculates heatmap, overlays, and returns base64 PNGs.
    """
    processed_arr = preprocess_pil_image(pil_image)
    batch = np.expand_dims(processed_arr, axis=0)

    # Generate heatmap
    heatmap = generate_gradcam_heatmap(model, batch, class_index=class_index)

    # Create overlay
    overlay_img, heatmap_img = overlay_gradcam(pil_image, heatmap, alpha=alpha)

    # Convert to Base64 data URLs
    def pil_to_base64_data_url(img: Image.Image) -> str:
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{b64_str}"

    return {
        "status": "success",
        "overlay_base64": pil_to_base64_data_url(overlay_img),
        "heatmap_base64": pil_to_base64_data_url(heatmap_img),
        "target_class_index": class_index,
        "heatmap_shape": list(heatmap.shape)
    }
