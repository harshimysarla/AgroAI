# TomatoCare AI — Tomato Leaf Disease Detection and Classification Using EfficientNetB0 Deep Learning

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-FF6F00?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**TomatoCare AI** is an end-to-end, production-grade agricultural AI web platform designed to detect, classify, and explain tomato leaf diseases in real time. Powered by a transfer-learned **EfficientNetB0** deep convolutional neural network with **Grad-CAM (Gradient-Weighted Class Activation Mapping)** visual explainability, the platform enables agronomists, students, and growers to make informed crop health decisions.

---

## 🚀 Cloud Deployment Architecture (Render + Vercel)

```
┌───────────────────────────────────────┐
│     Next.js 14 Frontend on VERCEL     │
│   (https://tomatocare-ai.vercel.app)  │
└──────────────────┬────────────────────┘
                   │
                   │ HTTPS API Requests (NEXT_PUBLIC_API_URL)
                   ▼
┌───────────────────────────────────────┐
│     FastAPI Backend on RENDER/DOCKER  │
│(https://tomatocare-api.onrender.com)  │
├───────────────────────────────────────┤
│  • EfficientNetB0 Deep Learning Model │
│  • Grad-CAM Explainable AI Engine     │
│  • SQLite Persistent History Ledger   │
│  • 10-Class Agronomic Knowledge Base  │
└───────────────────────────────────────┘
```

---

## ☁️ Step-by-Step Cloud Deployment

### 1. Deploy the Backend to Render (Docker)

1. Sign up or log in to **[Render.com](https://render.com)**.
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect:
   `https://github.com/harshimysarla/AgroAI`
4. Configure service details:
   - **Name**: `tomatocare-backend`
   - **Region**: Any (e.g. *Oregon, US*)
   - **Branch**: `main`
   - **Runtime**: **Docker** (Render will automatically detect `Dockerfile` and `render.yaml`)
   - **Instance Type**: **Free**
5. Add Environment Variables (optional, defaults are already preconfigured):
   - `PORT`: `8000`
   - `PROJECT_NAME`: `TomatoCare AI`
   - `API_PREFIX`: `/api`
6. Click **Create Web Service**.
7. Once deployed, copy your Render public URL:
   👉 e.g. `https://tomatocare-backend.onrender.com`
   *(Verify it by visiting `https://tomatocare-backend.onrender.com/api/health`)*

---

### 2. Deploy the Frontend to Vercel

1. Sign up or log in to **[Vercel.com](https://vercel.com)**.
2. Click **Add New...** → **Project**.
3. Import the repository: `https://github.com/harshimysarla/AgroAI`.
4. In the Project Configuration:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`frontend`** (or leave as root; `frontend/vercel.json` is ready).
5. Open the **Environment Variables** section and add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render Backend URL + `/api` (e.g. `https://tomatocare-backend.onrender.com/api`)
6. Click **Deploy**.
7. Vercel will build the Next.js app in ~60 seconds and provide your live application link!

---

## 💻 One-Click Local Demonstration (Examiner Presentation)

For in-person or college exam demonstrations where you want **zero dependence on internet latency**:

1. In the project root, **double-click `run_tomatocare.bat`**.
2. Both the FastAPI Backend and Next.js Frontend will launch automatically.
3. Your browser will open to:
   👉 **`http://localhost:3000`**
4. Ready-to-use sample leaf test images are located in:
   👉 **`demo_samples/`** (10 pre-sorted images for each disease class).
5. When finished, double-click `stop_tomatocare.bat` to cleanly terminate background services.

---

## 🌿 10 Supported Tomato Leaf Classes

TomatoCare AI classifies tomato foliar specimens into the 10 benchmark categories conforming to the **PlantVillage Tomato Dataset**:

| Class Index | Disease Name | Pathogen / Vector | Category | Severity |
|---|---|---|---|---|
| **0** | **Tomato Bacterial Spot** | *Xanthomonas perforans* | Bacterial | High |
| **1** | **Tomato Early Blight** | *Alternaria solani* | Fungal | Moderate |
| **2** | **Tomato Late Blight** | *Phytophthora infestans* | Oomycete | Severe |
| **3** | **Tomato Leaf Mold** | *Passalora fulva* | Fungal | Moderate |
| **4** | **Tomato Septoria Leaf Spot** | *Septoria lycopersici* | Fungal | Moderate |
| **5** | **Tomato Spider Mites** | *Tetranychus urticae* | Pest | Moderate |
| **6** | **Tomato Target Spot** | *Corynespora cassiicola* | Fungal | Moderate |
| **7** | **Tomato Yellow Leaf Curl Virus** | *TYLCV* (Whitefly vector) | Viral | Severe |
| **8** | **Tomato Mosaic Virus** | *ToMV* (Mechanical vector) | Viral | High |
| **9** | **Tomato Healthy** | *Solanum lycopersicum* | Healthy | None |

---

## 📱 Platform Modules & Pages

| # | Route | Module | Purpose |
|---|---|---|---|
| 1 | `/` | **Overview Dashboard** | Real-time model readiness telemetry, 10-class summary, pipeline workflow diagram, and recent genuine predictions feed. |
| 2 | `/detect` | **Leaf Disease Detection** | Drag-and-drop image upload, preview rotation, real-time inference, top-3 probabilities, interactive Grad-CAM heatmap with opacity slider, field note logger, and report generator. |
| 3 | `/diseases` | **Disease Encyclopedia** | Searchable, filterable 10-class library with botanical overviews, symptom markers, environmental vectors, and side-by-side lookalike comparison modal. |
| 4 | `/crop-care` | **Crop Care Center** | Cultural management best practices, drip irrigation principles, canopy aeration guides, and interactive weekly field scouting checklist. |
| 5 | `/journal` | **Health Journal** | Persistent historical diagnostic ledger backed by SQLite with bookmarking, custom notes editing, and record deletion. |
| 6 | `/analytics` | **Usage Analytics** | Telemetry charts (Recharts) visualizing inference counts, mean confidence, latency benchmarks, category breakdowns, and activity timelines. |
| 7 | `/model-performance` | **Model Performance** | Held-out test evaluation dashboard showing Test Accuracy, Precision, Recall, Macro/Weighted F1, per-class metrics, 10×10 confusion matrix heatmap, and training loss/accuracy curves. |
| 8 | `/methodology` | **System Methodology** | Mathematical formulation of EfficientNetB0 compound scaling, MBConv architecture, two-stage transfer learning, and Grad-CAM gradient equations. |
| 9 | `/about` | **About Project** | Technology stack breakdown, research objectives, PlantVillage dataset provenance, and future IoT edge deployment roadmap. |
| 10 | `/settings` | **Settings & Diagnostics** | Live FastAPI `/api/health` monitor, model weights inspector, database connection telemetry, and client configuration. |
| 11 | **Modal** | **Plant Health Assistant** | Domain-grounded interactive query engine answering questions on diseases, lookalikes, AI confidence, and cultural practices. |
| 12 | **Modal** | **Printable Reports** | Formatted PDF/Print modal with specimen photos, Grad-CAM heatmaps, pathology summaries, and agronomic advisory disclaimers. |

---

## 🛠️ Technology Stack

- **Deep Learning Core**: TensorFlow 2.21, Keras 3.15, EfficientNetB0, NumPy, OpenCV, scikit-learn.
- **Backend API**: Python 3.13, FastAPI 0.139, Uvicorn, Pydantic v2, SQLAlchemy 2.0, SQLite.
- **Frontend Architecture**: Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts.
- **Explainability (XAI)**: Grad-CAM targeting `top_conv` convolutional feature maps with JET/TURBO color mapping.
- **Cloud Containers**: Docker, Render Blueprint (`render.yaml`), Vercel (`vercel.json`).

---

## 🧪 Automated Testing

To run the backend test suite:
```bash
python -m pytest backend/tests/ -v
```

To run the frontend production build:
```bash
cd frontend
npm run build
```

---

## 📄 Repository Structure

```
├── Dockerfile                  # Container definition for Render/Railway
├── render.yaml                 # Render Blueprint configuration
├── vercel.json                 # Vercel deployment configuration
├── run_tomatocare.bat          # One-click Windows local demo launcher
├── stop_tomatocare.bat         # Clean shutdown script
├── EXAMINER_DEMO_GUIDE.md      # Examiner defense & presentation cheat-sheet
├── demo_samples/               # 10 benchmark test leaf images
├── backend/
│   ├── app/                    # FastAPI endpoints, schemas, services, DB
│   ├── ml/                     # EfficientNetB0, Grad-CAM, dataset loader
│   ├── artifacts/              # Trained weights, metadata, metrics
│   ├── requirements.txt        # Python backend dependencies
│   └── tests/                  # Pytest test suite
├── frontend/
│   ├── src/app/                # 10 Next.js App Router pages
│   ├── src/components/         # Reusable UI & layout components
│   ├── src/lib/                # API client & styling utilities
│   └── package.json            # Frontend Node dependencies
└── docs/                       # Setup, methodology, and API docs
```

---

## 📄 License
This project is open-source and distributed under the MIT License.
