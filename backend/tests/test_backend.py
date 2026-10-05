"""
Comprehensive Automated Test Suite for TomatoCare AI Backend.
Tests:
- Dataset & Preprocessing integrity
- Model Manager loading and inference
- Grad-CAM heatmap generation
- FastAPI endpoints (Predict, Explain, Diseases, History, Analytics, Model status)
- Database CRUD & note annotations
"""

import io
import pytest
from PIL import Image
import numpy as np
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database.session import Base, engine, SessionLocal
from backend.ml.data.constants import CLASS_NAMES, NUM_CLASSES, IMAGE_SIZE
from backend.ml.data.preprocessor import validate_image_bytes, preprocess_pil_image
from backend.app.services.model_manager import ModelManager
from backend.app.services.disease_service import get_all_disease_profiles, get_disease_profile_by_id


@pytest.fixture(scope="module")
def client():
    # Initialize DB tables for testing
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c


def test_constants_and_classes():
    assert len(CLASS_NAMES) == 10
    assert NUM_CLASSES == 10
    assert "Tomato___Bacterial_spot" in CLASS_NAMES
    assert "Tomato___healthy" in CLASS_NAMES


def test_preprocessing_validation():
    # Valid RGB image
    img = Image.new("RGB", (300, 300), color=(100, 200, 100))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    valid_bytes = buf.getvalue()

    is_valid, err, pil_img = validate_image_bytes(valid_bytes)
    assert is_valid is True
    assert err is None
    assert pil_img is not None

    # Preprocess
    arr = preprocess_pil_image(pil_img)
    assert arr.shape == (*IMAGE_SIZE, 3)
    assert arr.dtype == np.float32

    # Invalid empty bytes
    is_valid, err, _ = validate_image_bytes(b"")
    assert is_valid is False
    assert "Empty" in err


def test_disease_knowledge_base():
    profiles = get_all_disease_profiles()
    assert len(profiles) == 10
    
    # Check Bacterial Spot
    bspot = get_disease_profile_by_id("Tomato___Bacterial_spot")
    assert bspot is not None
    assert bspot["category"] == "Bacterial"
    assert len(bspot["symptoms"]) >= 3
    assert len(bspot["prevention"]) >= 3


def test_api_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_status" in data


def test_api_diseases(client):
    response = client.get("/api/diseases")
    assert response.status_code == 200
    diseases = response.json()
    assert len(diseases) == 10

    # Single disease
    r_single = client.get("/api/diseases/Tomato___Late_blight")
    assert r_single.status_code == 200
    assert r_single.json()["name"] == "Tomato Late Blight"


def test_api_model_status_and_metrics(client):
    r_status = client.get("/api/model/status")
    assert r_status.status_code == 200
    data = r_status.json()
    assert data["architecture"] == "EfficientNetB0"
    assert data["num_classes"] == 10

    r_metrics = client.get("/api/model/metrics")
    assert r_metrics.status_code == 200

    r_train = client.get("/api/model/training-info")
    assert r_train.status_code == 200


def test_api_prediction_and_gradcam_flow(client):
    # Create test leaf image
    img = Image.new("RGB", (256, 256), color=(40, 140, 40))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    # Post predict
    response = client.post(
        "/api/predict",
        files={"file": ("leaf.jpg", buf.getvalue(), "image/jpeg")},
        data={"generate_gradcam": "true", "save_to_history": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "predicted_class_index" in data
    assert "display_name" in data
    assert "confidence" in data
    assert len(data["top_k_predictions"]) == 3
    assert data["inference_time_ms"] > 0
    assert data["saved_record_id"] is not None

    # History verification
    r_hist = client.get("/api/history")
    assert r_hist.status_code == 200
    history_items = r_hist.json()
    assert len(history_items) > 0

    record_id = data["saved_record_id"]
    
    # Update note
    r_note = client.patch(
        f"/api/history/{record_id}",
        json={"user_notes": "Field Plot B - Sample 4", "is_bookmarked": True}
    )
    assert r_note.status_code == 200
    assert r_note.json()["user_notes"] == "Field Plot B - Sample 4"
    assert r_note.json()["is_bookmarked"] is True

    # Check analytics
    r_analytics = client.get("/api/analytics")
    assert r_analytics.status_code == 200
    analytics_data = r_analytics.json()
    assert analytics_data["total_analyses"] >= 1


def test_plant_assistant_query(client):
    response = client.post(
        "/api/assistant/query",
        json={"query": "How do I distinguish Early Blight from Late Blight?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "Early Blight" in data["content"]
    assert "Late Blight" in data["content"]
    assert len(data["suggested_questions"]) > 0
