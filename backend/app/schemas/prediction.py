"""
Pydantic Schemas and DTOs for TomatoCare AI.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class TopKPrediction(BaseModel):
    class_index: int
    raw_class_name: str
    display_name: str
    category: str
    severity: str
    confidence: float
    confidence_percent: float


class AllClassProbability(BaseModel):
    class_index: int
    raw_class_name: str
    display_name: str
    confidence: float
    confidence_percent: float


class PredictResponse(BaseModel):
    success: bool = True
    predicted_class_index: int
    raw_class_name: str
    display_name: str
    category: str
    severity: str
    confidence: float
    confidence_percent: float
    top_k_predictions: List[TopKPrediction]
    all_class_probabilities: List[AllClassProbability]
    inference_time_ms: float
    model_name: str
    model_version: str
    image_size: List[int]
    disease_info: Optional[Dict[str, Any]] = None
    gradcam_overlay_url: Optional[str] = None
    gradcam_heatmap_url: Optional[str] = None
    saved_record_id: Optional[int] = None
    warning_notice: str = (
        "Model output confidence reflects statistical pattern matching on tomato leaf features. "
        "It is not a guaranteed botanical diagnosis. Field factors such as lighting, insect co-infestation, "
        "and unfamiliar cultivars may influence predictions. Always corroborate with local extension guidance."
    )


class GradCamResponse(BaseModel):
    success: bool = True
    overlay_base64: str
    heatmap_base64: str
    target_class_index: Optional[int] = None
    heatmap_shape: List[int]
    notice: str = (
        "Grad-CAM highlights image regions with the highest gradient activation for the predicted class. "
        "It provides explainability into model focus areas."
    )


class HistoryItem(BaseModel):
    id: int
    created_at: datetime
    predicted_class: str
    raw_class_name: str
    category: str
    severity: str
    confidence: float
    inference_time_ms: float
    image_data_url: Optional[str] = None
    has_gradcam: bool = False
    user_notes: Optional[str] = None
    is_bookmarked: bool = False

    class Config:
        from_attributes = True


class HistoryDetail(HistoryItem):
    top_k_json: Optional[List[Dict[str, Any]]] = None
    all_probabilities_json: Optional[List[Dict[str, Any]]] = None
    gradcam_data_url: Optional[str] = None
    model_name: str
    model_version: str


class UpdateNotesRequest(BaseModel):
    user_notes: Optional[str] = None
    is_bookmarked: Optional[bool] = None


class AnalyticsDistributionItem(BaseModel):
    name: str
    count: int
    percentage: float
    category: str


class AnalyticsTimelineItem(BaseModel):
    date: str
    count: int


class AnalyticsResponse(BaseModel):
    total_analyses: int
    category_breakdown: Dict[str, int]
    class_distribution: List[AnalyticsDistributionItem]
    timeline: List[AnalyticsTimelineItem]
    average_confidence: float
    average_inference_time_ms: float
    disclaimer: str = (
        "Analytics reflect user-initiated diagnostic queries stored in the database. "
        "They illustrate usage patterns and do not represent real-world epidemiological disease prevalence."
    )


class ModelStatusResponse(BaseModel):
    status: str
    is_ready: bool
    message: str
    architecture: str
    input_resolution: List[int]
    num_classes: int
    has_evaluation_metrics: bool
    has_training_history: bool
    model_metadata: Optional[Dict[str, Any]] = None


class AssistantRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500)


class AssistantResponse(BaseModel):
    query: str
    category: str
    title: str
    content: str
    suggested_questions: List[str]
    disclaimer: str


class FeedbackCreate(BaseModel):
    prediction_id: Optional[int] = None
    predicted_class: str
    user_suggested_class: Optional[str] = None
    feedback_type: str = "uncertain_prediction"
    comments: Optional[str] = None
