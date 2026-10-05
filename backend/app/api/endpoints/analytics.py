"""
Analytics Endpoint: Computes real statistical summaries of stored inferences.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.schemas.prediction import AnalyticsResponse
from backend.app.services.history_service import compute_analytics

router = APIRouter()


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics_summary(db: Session = Depends(get_db)):
    """Computes real historical usage metrics and category distributions."""
    return compute_analytics(db)
