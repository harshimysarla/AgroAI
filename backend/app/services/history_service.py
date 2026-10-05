"""
History, Persistence, and Real Analytics Service for TomatoCare AI.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from backend.app.models.prediction import PredictionRecord, FeedbackReport
from backend.app.schemas.prediction import AnalyticsResponse, AnalyticsDistributionItem, AnalyticsTimelineItem
from backend.ml.data.constants import CLASS_DISPLAY_NAMES, CLASS_CATEGORIES


def save_prediction_record(
    db: Session,
    prediction_data: Dict[str, Any],
    image_data_url: Optional[str] = None,
    gradcam_data_url: Optional[str] = None,
    client_ip: Optional[str] = None
) -> PredictionRecord:
    """Saves a real prediction event into SQLite."""
    record = PredictionRecord(
        predicted_class=prediction_data["display_name"],
        raw_class_name=prediction_data["raw_class_name"],
        category=prediction_data["category"],
        severity=prediction_data["severity"],
        confidence=prediction_data["confidence"],
        inference_time_ms=prediction_data["inference_time_ms"],
        top_k_json=prediction_data.get("top_k_predictions"),
        all_probabilities_json=prediction_data.get("all_class_probabilities"),
        model_name=prediction_data.get("model_name", "TomatoCare_EfficientNetB0"),
        model_version=prediction_data.get("model_version", "1.0.0"),
        image_data_url=image_data_url,
        has_gradcam=gradcam_data_url is not None,
        gradcam_data_url=gradcam_data_url,
        client_ip=client_ip
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_history_records(
    db: Session,
    limit: int = 50,
    offset: int = 0,
    category: Optional[str] = None,
    bookmarked_only: bool = False
) -> List[PredictionRecord]:
    """Retrieves paginated prediction records with optional filtering."""
    query = db.query(PredictionRecord)
    if category and category != "All":
        query = query.filter(PredictionRecord.category == category)
    if bookmarked_only:
        query = query.filter(PredictionRecord.is_bookmarked == True)
    
    return query.order_by(desc(PredictionRecord.created_at)).offset(offset).limit(limit).all()


def get_history_record_by_id(db: Session, record_id: int) -> Optional[PredictionRecord]:
    """Retrieves a single record by ID."""
    return db.query(PredictionRecord).filter(PredictionRecord.id == record_id).first()


def update_prediction_notes(
    db: Session,
    record_id: int,
    user_notes: Optional[str] = None,
    is_bookmarked: Optional[bool] = None
) -> Optional[PredictionRecord]:
    """Updates user notes or bookmark flag on a record."""
    record = db.query(PredictionRecord).filter(PredictionRecord.id == record_id).first()
    if not record:
        return None
    if user_notes is not None:
        record.user_notes = user_notes
    if is_bookmarked is not None:
        record.is_bookmarked = is_bookmarked
    db.commit()
    db.refresh(record)
    return record


def delete_prediction_record(db: Session, record_id: int) -> bool:
    """Deletes a prediction record from database."""
    record = db.query(PredictionRecord).filter(PredictionRecord.id == record_id).first()
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True


def compute_analytics(db: Session) -> AnalyticsResponse:
    """Computes real statistics from stored records in database."""
    total_count = db.query(func.count(PredictionRecord.id)).scalar() or 0
    
    if total_count == 0:
        return AnalyticsResponse(
            total_analyses=0,
            category_breakdown={},
            class_distribution=[],
            timeline=[],
            average_confidence=0.0,
            average_inference_time_ms=0.0
        )

    # Average confidence & latency
    avg_conf = db.query(func.avg(PredictionRecord.confidence)).scalar() or 0.0
    avg_time = db.query(func.avg(PredictionRecord.inference_time_ms)).scalar() or 0.0

    # Category counts
    cat_counts = db.query(
        PredictionRecord.category,
        func.count(PredictionRecord.id)
    ).group_by(PredictionRecord.category).all()
    category_breakdown = {cat: count for cat, count in cat_counts}

    # Class distribution
    class_counts = db.query(
        PredictionRecord.predicted_class,
        PredictionRecord.category,
        func.count(PredictionRecord.id)
    ).group_by(PredictionRecord.predicted_class, PredictionRecord.category).all()
    
    class_distribution = []
    for cls_name, cat, count in class_counts:
        class_distribution.append(AnalyticsDistributionItem(
            name=cls_name,
            category=cat,
            count=count,
            percentage=round((count / total_count) * 100, 2)
        ))
    class_distribution.sort(key=lambda x: x.count, reverse=True)

    # Timeline (by day)
    timeline_query = db.query(
        func.date(PredictionRecord.created_at).label("day"),
        func.count(PredictionRecord.id)
    ).group_by(func.date(PredictionRecord.created_at)).order_by("day").limit(30).all()

    timeline = [
        AnalyticsTimelineItem(date=str(day), count=count)
        for day, count in timeline_query
    ]

    return AnalyticsResponse(
        total_analyses=total_count,
        category_breakdown=category_breakdown,
        class_distribution=class_distribution,
        timeline=timeline,
        average_confidence=round(float(avg_conf), 4),
        average_inference_time_ms=round(float(avg_time), 2)
    )


def save_feedback(db: Session, feedback_data: Dict[str, Any]) -> FeedbackReport:
    """Stores user feedback report for review."""
    fb = FeedbackReport(
        prediction_id=feedback_data.get("prediction_id"),
        predicted_class=feedback_data["predicted_class"],
        user_suggested_class=feedback_data.get("user_suggested_class"),
        feedback_type=feedback_data.get("feedback_type", "uncertain_prediction"),
        comments=feedback_data.get("comments")
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb
