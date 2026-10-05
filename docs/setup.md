# TomatoCare AI — Setup & Installation Guide

This guide details the steps required to set up, train, and run the **TomatoCare AI** deep learning web application locally.

---

## 1. Prerequisites

- **Python**: 3.10 to 3.13
- **Node.js**: v18+ (tested on Node v20 & v24)
- **NPM**: v9+
- **GPU (Optional)**: CUDA-capable GPU for accelerated training (CPU fallback is fully supported).

---

## 2. Backend Setup & Dependencies

```bash
# From the repository root
cd backend
pip install -r requirements.txt
cd ..
```

---

## 3. Dataset Preparation

TomatoCare AI is built for the **PlantVillage Tomato Leaf Disease Dataset** (10 classes).

The dataset directory structure should be:
```
backend/data/plantvillage_tomato/
├── Tomato___Bacterial_spot/
├── Tomato___Early_blight/
├── Tomato___Late_blight/
├── Tomato___Leaf_Mold/
├── Tomato___Septoria_leaf_spot/
├── Tomato___Spider_mites Two-spotted_spider_mite/
├── Tomato___Target_Spot/
├── Tomato___Tomato_Yellow_Leaf_Curl_Virus/
├── Tomato___Tomato_mosaic_virus/
└── Tomato___healthy/
```

### Validate Dataset:
```bash
python scripts/prepare_dataset.py --data_dir backend/data/plantvillage_tomato
```

### Setup Benchmark Sample Dataset (if full dataset is not downloaded yet):
```bash
python scripts/setup_sample_data.py
```

---

## 4. Model Training & Evaluation

To train the **EfficientNetB0** model using two-stage transfer learning:

```bash
python scripts/train_model.py \
  --data_dir backend/data/plantvillage_tomato \
  --initial_epochs 15 \
  --fine_tune_epochs 10 \
  --batch_size 32 \
  --initial_lr 0.0001 \
  --fine_tune_lr 0.00001
```

To evaluate the trained model on held-out test data:
```bash
python scripts/evaluate_model.py \
  --model_path backend/artifacts/best_model.keras \
  --data_dir backend/data/plantvillage_tomato
```

This generates:
- `backend/artifacts/best_model.keras`
- `backend/artifacts/class_indices.json`
- `backend/artifacts/model_metadata.json`
- `backend/artifacts/training_history.json`
- `backend/artifacts/evaluation_metrics.json`

---

## 5. Starting the FastAPI Backend

```bash
# Start the FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

Verify backend health at: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
Interactive Swagger API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 6. Starting the Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 7. Running Backend Tests

```bash
python -m pytest backend/tests/ -v
```
