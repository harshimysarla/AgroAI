"""
Model Information, Status, Metrics, and Training Artifacts Endpoints.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.prediction import ModelStatusResponse
from backend.app.services.model_manager import ModelManager

router = APIRouter()


@router.get("/model/status", response_model=ModelStatusResponse)
async def get_model_status():
    """Returns the live readiness state and metadata of the EfficientNetB0 model."""
    model_mgr = ModelManager.get_instance()
    return model_mgr.get_status_summary()


@router.get("/model/metrics")
async def get_model_evaluation_metrics():
    """Returns the actual held-out test evaluation metrics and confusion matrix."""
    model_mgr = ModelManager.get_instance()
    metrics = model_mgr.get_metrics_summary()
    if not metrics:
        return {
            "is_available": False,
            "message": "Evaluation metrics are not available yet. Please run 'python scripts/evaluate_model.py' to generate test metrics."
        }
    return {
        "is_available": True,
        "metrics": metrics
    }


@router.get("/model/training-info")
async def get_model_training_info():
    """Returns saved training configurations, parameters, and epoch loss/accuracy curves."""
    model_mgr = ModelManager.get_instance()
    info = model_mgr.get_training_info_summary()
    if not info or not info.get("history"):
        return {
            "is_available": False,
            "message": "Training history and metadata are not available yet."
        }
    return {
        "is_available": True,
        "data": info
    }
