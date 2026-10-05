"""
Prediction Endpoint: Handles leaf image upload, inference, and automated persistence.
"""

import base64
import io
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request, status
from sqlalchemy.orm import Session
from PIL import Image

from backend.app.database.session import get_db
from backend.app.schemas.prediction import PredictResponse
from backend.app.services.model_manager import ModelManager
from backend.app.services.disease_service import get_disease_profile_by_id
from backend.app.services.history_service import save_prediction_record
from backend.ml.data.preprocessor import validate_image_bytes

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
async def predict_leaf_disease(
    request: Request,
    file: UploadFile = File(...),
    generate_gradcam: bool = Form(default=True),
    save_to_history: bool = Form(default=True),
    db: Session = Depends(get_db)
):
    """
    Primary leaf disease prediction endpoint.
    1. Validates and decodes image.
    2. Runs inference through trained EfficientNetB0.
    3. Generates Grad-CAM heatmap if requested.
    4. Attaches curated disease profile.
    5. Saves analysis to database.
    """
    model_mgr = ModelManager.get_instance()
    if not model_mgr.predictor or not model_mgr.predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=model_mgr.status_message or "EfficientNetB0 model is not loaded or ready."
        )

    # Read uploaded bytes
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    # Validate image bytes
    is_valid, err_msg, pil_img = validate_image_bytes(contents, max_size_mb=10.0)
    if not is_valid or pil_img is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=err_msg or "Invalid image file."
        )

    # Run Inference
    try:
        pred_result = model_mgr.predict(pil_img, top_k=3)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )

    # Generate Grad-CAM if requested
    gradcam_overlay_url = None
    gradcam_heatmap_url = None
    if generate_gradcam:
        try:
            cam_result = model_mgr.explain(pil_img, class_index=pred_result["predicted_class_index"])
            gradcam_overlay_url = cam_result.get("overlay_base64")
            gradcam_heatmap_url = cam_result.get("heatmap_base64")
        except Exception as e:
            print(f"[!] Warning: Grad-CAM generation failed: {e}")

    # Attach curated disease profile
    raw_class = pred_result["raw_class_name"]
    disease_info = get_disease_profile_by_id(raw_class)

    # Encode original image to data URL for storage/preview
    buf = io.BytesIO()
    # Save optimized JPEG preview
    preview_img = pil_img.copy()
    if preview_img.width > 800 or preview_img.height > 800:
        preview_img.thumbnail((800, 800), Image.Resampling.LANCZOS)
    preview_img.save(buf, format="JPEG", quality=85)
    image_data_url = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

    # Save to history DB
    saved_record_id = None
    if save_to_history:
        try:
            client_ip = request.client.host if request.client else None
            record = save_prediction_record(
                db=db,
                prediction_data=pred_result,
                image_data_url=image_data_url,
                gradcam_data_url=gradcam_overlay_url,
                client_ip=client_ip
            )
            saved_record_id = record.id
        except Exception as e:
            print(f"[!] Warning: Failed to persist record to database: {e}")

    return PredictResponse(
        success=True,
        predicted_class_index=pred_result["predicted_class_index"],
        raw_class_name=pred_result["raw_class_name"],
        display_name=pred_result["display_name"],
        category=pred_result["category"],
        severity=pred_result["severity"],
        confidence=pred_result["confidence"],
        confidence_percent=pred_result["confidence_percent"],
        top_k_predictions=pred_result["top_k_predictions"],
        all_class_probabilities=pred_result["all_class_probabilities"],
        inference_time_ms=pred_result["inference_time_ms"],
        model_name=pred_result["model_name"],
        model_version=pred_result["model_version"],
        image_size=pred_result["image_size"],
        disease_info=disease_info,
        gradcam_overlay_url=gradcam_overlay_url,
        gradcam_heatmap_url=gradcam_heatmap_url,
        saved_record_id=saved_record_id
    )
