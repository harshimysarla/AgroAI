"""
SQLAlchemy ORM Data Models for TomatoCare AI.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON
from backend.app.database.session import Base


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Classification results
    predicted_class = Column(String(100), nullable=False, index=True)
    raw_class_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    severity = Column(String(30), nullable=False)
    confidence = Column(Float, nullable=False)
    inference_time_ms = Column(Float, nullable=False)
    
    # Probabilities breakdown
    top_k_json = Column(JSON, nullable=True)
    all_probabilities_json = Column(JSON, nullable=True)
    
    # Model tracking
    model_name = Column(String(100), default="TomatoCare_EfficientNetB0")
    model_version = Column(String(50), default="1.0.0")
    
    # Image references (relative or data URI flag)
    image_filename = Column(String(255), nullable=True)
    image_data_url = Column(Text, nullable=True)
    has_gradcam = Column(Boolean, default=False)
    gradcam_data_url = Column(Text, nullable=True)
    
    # Metadata and user annotations
    user_notes = Column(Text, nullable=True)
    client_ip = Column(String(50), nullable=True)
    is_bookmarked = Column(Boolean, default=False)


class FeedbackReport(Base):
    __tablename__ = "feedback_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    prediction_id = Column(Integer, nullable=True)
    predicted_class = Column(String(100), nullable=False)
    user_suggested_class = Column(String(100), nullable=True)
    feedback_type = Column(String(50), default="uncertain_prediction")  # "incorrect", "uncertain", "general"
    comments = Column(Text, nullable=True)
