# TomatoCare AI — REST API Documentation

The TomatoCare AI backend is built with FastAPI. All endpoints are versioned under the `/api` prefix.

---

## 1. Inference & Explainability

### `POST /api/predict`
Executes real-time inference on a multipart leaf image.

**Request Form Data:**
- `file`: Image file (JPG/PNG/WEBP, max 10 MB)
- `generate_gradcam` (bool, default: `true`): Whether to compute Grad-CAM heatmap.
- `save_to_history` (bool, default: `true`): Whether to persist prediction in the database.

**Response (200 OK):**
```json
{
  "success": true,
  "predicted_class_index": 1,
  "raw_class_name": "Tomato___Early_blight",
  "display_name": "Tomato Early Blight",
  "category": "Fungal",
  "severity": "Moderate",
  "confidence": 0.9421,
  "confidence_percent": 94.21,
  "top_k_predictions": [
    {
      "class_index": 1,
      "raw_class_name": "Tomato___Early_blight",
      "display_name": "Tomato Early Blight",
      "category": "Fungal",
      "severity": "Moderate",
      "confidence": 0.9421,
      "confidence_percent": 94.21
    }
  ],
  "all_class_probabilities": [...],
  "inference_time_ms": 42.15,
  "model_name": "TomatoCare_EfficientNetB0",
  "model_version": "1.0.0",
  "image_size": [800, 600],
  "gradcam_overlay_url": "data:image/jpeg;base64,...",
  "saved_record_id": 14,
  "warning_notice": "..."
}
```

---

### `POST /api/explain`
Generates an on-demand Grad-CAM visual explanation with custom opacity.

**Request Form Data:**
- `file`: Image file
- `class_index` (int, optional): Specific class index to visualize.
- `alpha` (float, default: `0.45`): Overlay transparency (0.1 to 0.9).

---

## 2. Disease Encyclopedia

- `GET /api/diseases`: Returns all 10 curated botanical disease profiles.
- `GET /api/diseases/{id}`: Returns single detailed pathology profile.

---

## 3. Health Journal & History

- `GET /api/history`: List paginated past analyses (`limit`, `offset`, `category`, `bookmarked_only`).
- `GET /api/history/{id}`: Detailed record with top-k predictions and images.
- `PATCH /api/history/{id}`: Update user field notes or bookmark status.
- `DELETE /api/history/{id}`: Delete an analysis record.

---

## 4. Telemetry, Analytics & Model Status

- `GET /api/health`: Service and model healthcheck.
- `GET /api/model/status`: Model readiness, architecture, and training metadata.
- `GET /api/model/metrics`: Held-out test evaluation metrics and confusion matrix.
- `GET /api/model/training-info`: Training configuration and epoch curves.
- `GET /api/analytics`: Telemetry distributions, class frequencies, and timeline activity.

---

## 5. Assistant & Feedback

- `POST /api/assistant/query`: Structured agronomic and methodology assistant query.
- `POST /api/feedback`: Submits field observation feedback for research review.
