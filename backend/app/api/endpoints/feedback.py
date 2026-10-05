"""
User Feedback and Correction Reporting Endpoint.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.schemas.prediction import FeedbackCreate
from backend.app.services.history_service import save_feedback

router = APIRouter()


@router.post("/feedback", status_code=status.HTTP_201_CREATED)
async def submit_prediction_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Submits user review feedback or report on uncertain/incorrect predictions for expert review.
    Does not silently or automatically modify trained model weights.
    """
    fb = save_feedback(db, payload.model_dump())
    return {
        "status": "success",
        "feedback_id": fb.id,
        "message": "Feedback submitted successfully for research audit."
    }
