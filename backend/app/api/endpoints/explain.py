"""
Explainability Endpoint: Computes on-demand Grad-CAM with custom opacity.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from PIL import Image

from backend.app.schemas.prediction import GradCamResponse
from backend.app.services.model_manager import ModelManager
from backend.ml.data.preprocessor import validate_image_bytes

router = APIRouter()


@router.post("/explain", response_model=GradCamResponse)
async def explain_image(
    file: UploadFile = File(...),
    class_index: Optional[int] = Form(default=None),
    alpha: float = Form(default=0.45)
):
    """
    Generates Grad-CAM visual explanation for an uploaded leaf image.
    Supports targeting a specific class index or defaulting to highest activation class.
    """
    model_mgr = ModelManager.get_instance()
    if not model_mgr.predictor or not model_mgr.predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=model_mgr.status_message or "Model is not loaded for explanation."
        )

    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file: {str(e)}"
        )

    is_valid, err_msg, pil_img = validate_image_bytes(contents)
    if not is_valid or pil_img is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=err_msg or "Invalid image file."
        )

    # Clamp alpha between 0.1 and 0.9
    alpha = max(0.1, min(0.9, alpha))

    try:
        explanation = model_mgr.explain(pil_img, class_index=class_index, alpha=alpha)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grad-CAM generation failed: {str(e)}"
        )

    return GradCamResponse(
        success=True,
        overlay_base64=explanation["overlay_base64"],
        heatmap_base64=explanation["heatmap_base64"],
        target_class_index=explanation.get("target_class_index"),
        heatmap_shape=explanation.get("heatmap_shape", [7, 7])
    )
