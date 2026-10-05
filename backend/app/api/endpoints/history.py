"""
Health Journal and Prediction History Endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database.session import get_db
from backend.app.schemas.prediction import HistoryItem, HistoryDetail, UpdateNotesRequest
from backend.app.services.history_service import (
    get_history_records,
    get_history_record_by_id,
    update_prediction_notes,
    delete_prediction_record
)

router = APIRouter()


@router.get("/history", response_model=List[HistoryItem])
async def list_history_records(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    category: Optional[str] = Query(default=None),
    bookmarked_only: bool = Query(default=False),
    db: Session = Depends(get_db)
):
    """Retrieves paginated historical leaf analysis records."""
    records = get_history_records(
        db=db,
        limit=limit,
        offset=offset,
        category=category,
        bookmarked_only=bookmarked_only
    )
    return records


@router.get("/history/{record_id}", response_model=HistoryDetail)
async def get_history_detail(record_id: int, db: Session = Depends(get_db)):
    """Retrieves complete details for a single saved prediction."""
    record = get_history_record_by_id(db, record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record with ID {record_id} not found."
        )
    return record


@router.patch("/history/{record_id}", response_model=HistoryDetail)
async def update_notes(
    record_id: int,
    payload: UpdateNotesRequest,
    db: Session = Depends(get_db)
):
    """Updates user notes or bookmark status on a prediction record."""
    record = update_prediction_notes(
        db,
        record_id=record_id,
        user_notes=payload.user_notes,
        is_bookmarked=payload.is_bookmarked
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record with ID {record_id} not found."
        )
    return record


@router.delete("/history/{record_id}")
async def delete_history_item(record_id: int, db: Session = Depends(get_db)):
    """Deletes a historical analysis record."""
    success = delete_prediction_record(db, record_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record with ID {record_id} not found."
        )
    return {"status": "success", "message": f"Record {record_id} deleted successfully."}
