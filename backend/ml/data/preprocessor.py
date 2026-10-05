"""
Image Preprocessing Pipeline for EfficientNetB0.
Guarantees identical preprocessing across training, evaluation, and production inference.
"""

import io
from typing import Tuple, Optional, Union
import numpy as np
from PIL import Image

from backend.ml.data.constants import IMAGE_SIZE


def validate_image_bytes(image_bytes: bytes, max_size_mb: float = 10.0) -> Tuple[bool, Optional[str], Optional[Image.Image]]:
    """
    Validate raw uploaded image bytes.
    Checks:
    - Non-empty payload
    - File size <= max_size_mb
    - Valid decodable image format (JPEG, PNG, WEBP)
    - Valid dimensions (minimum 32x32)
    """
    if not image_bytes:
        return False, "Empty image file received.", None

    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        return False, f"File size ({size_mb:.2f} MB) exceeds maximum allowed limit of {max_size_mb:.1f} MB.", None

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()  # Verify image structure
        # Re-open after verify because verify exhausts the stream
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        return False, f"Invalid or corrupt image format: {str(e)}", None

    if img.format not in ["JPEG", "JPG", "PNG", "WEBP"]:
        return False, f"Unsupported image format: {img.format}. Supported formats are JPEG, PNG, WEBP.", None

    width, height = img.size
    if width < 32 or height < 32:
        return False, f"Image dimensions ({width}x{height}) are too small for accurate feature extraction. Minimum size is 32x32.", None

    return True, None, img


def preprocess_pil_image(img: Image.Image, target_size: Tuple[int, int] = IMAGE_SIZE) -> np.ndarray:
    """
    Convert PIL image to standard EfficientNetB0 input array.
    1. Convert to RGB mode (removes Alpha channel or Palette if present).
    2. Resize to 224x224 using high-fidelity Resampling.BILINEAR.
    3. Convert to numpy float32 array in [0, 255] range as expected by Keras EfficientNetB0.
    """
    if img.mode != "RGB":
        img = img.convert("RGB")

    if img.size != target_size:
        img = img.resize(target_size, Image.Resampling.BILINEAR)

    img_array = np.asarray(img, dtype=np.float32)
    return img_array


def preprocess_for_inference(image_input: Union[bytes, Image.Image, str]) -> Tuple[np.ndarray, Image.Image]:
    """
    Prepares any supported input format for inference.
    Returns:
    - (batch_array with shape [1, 224, 224, 3], original_pil_rgb_image)
    """
    if isinstance(image_input, bytes):
        valid, err, pil_img = validate_image_bytes(image_input)
        if not valid or pil_img is None:
            raise ValueError(err or "Failed to validate image bytes")
    elif isinstance(image_input, Image.Image):
        pil_img = image_input
    elif isinstance(image_input, str):
        pil_img = Image.open(image_input)
    else:
        raise TypeError(f"Unsupported image input type: {type(image_input)}")

    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")

    processed = preprocess_pil_image(pil_img)
    batch_array = np.expand_dims(processed, axis=0)  # Shape: (1, 224, 224, 3)
    return batch_array, pil_img
