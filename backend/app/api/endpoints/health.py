"""
System and Service Healthcheck Endpoint.
"""

from fastapi import APIRouter
from backend.app.services.model_manager import ModelManager

router = APIRouter()


@router.get("/health")
async def healthcheck():
    """Returns server and ML model health status."""
    model_mgr = ModelManager.get_instance()
    return {
        "status": "healthy",
        "service": "TomatoCare AI Backend API",
        "version": "1.0.0",
        "model_status": model_mgr.status,
        "is_model_ready": model_mgr.predictor is not None and model_mgr.predictor.is_loaded
    }
