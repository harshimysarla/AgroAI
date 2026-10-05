# TomatoCare AI — Tomato Leaf Disease Detection and Classification Using EfficientNetB0 Deep Learning

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-FF6F00?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**TomatoCare AI** is an advanced, production-oriented agricultural technology web platform designed for automated tomato foliar disease identification, real-time classification, and visual model explainability. Built upon the **EfficientNetB0** deep convolutional neural network architecture and integrated with **Grad-CAM (Gradient-Weighted Class Activation Mapping)**, TomatoCare AI empowers agricultural students, crop consultants, agronomists, and growers with instant, transparent, and actionable diagnostic intelligence.

---

## 🌟 Executive Summary & Highlights

- **Real Deep Learning Inference**: High-accuracy classification across **10 discrete tomato leaf conditions** using transfer-learned EfficientNetB0 with Mobile Inverted Bottleneck convolutions (MBConv) and compound scaling.
- **Visual Explainable AI (XAI)**: Generates localized Grad-CAM class activation heatmaps overlaid directly onto leaf specimens, eliminating "black-box" uncertainty.
- **Complete Agronomic Ecosystem**: Integrates disease diagnosis with a curated botanical encyclopedia, cultural management protocols, persistent health journaling, usage telemetry analytics, and print-ready agronomic certificates.
- **Production Architecture**: Decoupled full-stack architecture featuring a **FastAPI** Python backend, SQLite persistence via **SQLAlchemy**, and a modern **Next.js 14 App Router** frontend with dark/light themes.

---

## 📋 Comprehensive Feature Matrix

### 1. 🔬 Deep Learning Diagnostic Engine
- **EfficientNetB0 Backbone**: Utilizes compound scaling across depth (\(d=\alpha^\phi\)), width (\(w=\beta^\phi\)), and resolution (\(r=\gamma^\phi\)) to maximize feature extraction while maintaining a low parameter footprint (~5.3M parameters).
- **Sub-50ms Inference**: Optimized preprocessing and forward pass pipeline delivering high throughput and low-latency prediction on both CPU and GPU hardware.
- **Probabilistic Ranking**: Computes full 10-class Softmax probability distributions, returning the primary predicted diagnosis along with top-3 candidate confidence scores.
- **Strict Image Validation**: Validates file types (JPEG, PNG, WEBP), enforces a 10 MB upload ceiling, checks spatial resolution (\(\ge 32\times32\)), and sanitizes RGB channel streams.
- **Interactive Specimen Manipulation**: In-browser preview offering 90-degree specimen rotation, aspect-ratio preservation, and instant file replacement.

### 2. 🔍 Grad-CAM Visual Explainability (XAI)
- **Targeted Convolutional Gradients**: Calculates first-order gradients of the predicted class score with respect to feature maps of the final convolutional layer (`top_conv`).
- **Neuron Importance Pooling**: Global average pooling of gradients generates guided weights (\(\alpha_k\)) that isolate features positively correlating with the identified disease.
- **Dynamic Opacity Blending**: Real-time slider (10% to 90% opacity) superimposing high-resolution JET/TURBO heatmaps over the original leaf specimen.
- **Audit Verification**: Enables growers and researchers to confirm that the neural network is focusing on actual necrotic lesions, chlorotic margins, or pustules rather than background artifacts.

### 3. 🌿 Curated 10-Class Botanical Pathology Library
- **Full Taxonomy Coverage**: Covers the 10 benchmark tomato classes defined in the PlantVillage dataset across fungal, bacterial, viral, oomycete, and pest pathologies.
- **In-Depth Disease Profiles**: Each entry provides scientific taxonomy, pathogen nomenclature, macroscopic symptom progression, environmental vectors (temperature, humidity), and spread mechanisms.
- **Lookalike Comparison Tool**: Interactive side-by-side comparative modal allowing agronomists to evaluate visually similar pathologies (e.g., Early Blight vs. Late Blight, Septoria vs. Bacterial Spot) side-by-side.
- **Fast Search & Filter**: Real-time keyword search and category filtering (Fungal, Bacterial, Viral, Pest, Oomycete, Healthy).

### 4. 🛡️ Crop Care & Cultural Prevention Center
- **Agronomic Best Practices**: Actionable cultural management guidelines structured across three pillars:
  - **Precision Irrigation**: Drip irrigation protocols to eliminate foliar splash-dispersal of spores.
  - **Canopy Aeration & Spacing**: Pruning lower foliage (lowest 12–18 inches) and establishing 24–36 inch spacing to reduce microclimate humidity.
  - **Sanitation & Tool Sterilization**: Tool disinfection protocols (isopropyl alcohol, trisodium phosphate) and tobacco handling restrictions to prevent mechanical viral transmission.
- **Interactive Field Scouting Checklist**: Integrated digital checklist tracking weekly foliar inspections (underside sporulation, terminal leaf curling, collar rot, and fruit scabs).
- **Extension Consultation Protocol**: Guidelines outlining when growers should contact certified agricultural extension agents for regional disease alerts or laboratory PCR/ELISA confirmation.

### 5. 📖 Persistent Crop Health Journal
- **Automated Ledger**: Inferences are automatically recorded in an ACID-compliant SQLite database with timestamps, model versions, predicted classes, and confidence scores.
- **Agronomist Field Notes**: In-place editing enabling field researchers to attach custom plot identifiers, block numbers, or environmental notes to any record.
- **Bookmarking & Filtering**: Quick-access bookmarks for critical specimens, filterable by disease category and searchable by user notes.
- **Safe Management**: Record deletion with user confirmation, preserving data hygiene.

### 6. 📊 Real-Time Telemetry & Usage Analytics
- **Live Aggregations**: Computes statistical summaries from genuine stored diagnoses, entirely decoupled from model training data.
- **KPI Metrics**: Displays total diagnostic volume, mean prediction confidence, average inference latency, and most prevalent crop conditions.
- **Interactive Visualizations (Recharts)**:
  - **Pathology Distribution**: Donut charts illustrating proportions of bacterial, fungal, viral, oomycete, and healthy specimens.
  - **Daily Activity Timeline**: Bar chart displaying diagnostic frequency trends over recent days.
  - **Class Frequency Ranking**: Comparative percentage progress bars ranking all 10 classes by occurrence.
- **Epidemiological Transparency**: Explicit advisory notices highlighting the distinction between application telemetry and real-world farm disease prevalence.

### 7. 🎯 Empirical Model Performance Dashboard
- **Held-Out Test Benchmarks**: Visualizes real empirical performance metrics calculated strictly on an unaugmented test split:
  - Overall Test Accuracy
  - Macro & Weighted Precision
  - Macro & Weighted Recall
  - Macro & Weighted F1-Score
- **10×10 Confusion Matrix Heatmap**: Interactive matrix visualizing true vs. predicted classifications with dynamic toggling between **Normalized Percentages (%)** and **Raw Sample Counts**.
- **Per-Class Metrics Table**: Comprehensive classification report tabulating precision, recall, F1-score, and support for each class.
- **Training Convergence Curves**: Dual-axis line charts tracking Training vs. Validation Loss and Accuracy trajectories across transfer learning and fine-tuning epochs.

### 8. 🤖 Plant Health Assistant
- **Domain-Grounded Knowledge Engine**: Rule-based agronomic assistant providing structured responses regarding tomato diseases, pathogen biology, cultural management, and AI architecture.
- **Lookalike Guidance**: Answers complex queries distinguishing lookalike symptoms (e.g., Early Blight target rings vs. Septoria pycnidia vs. Target Spot).
- **Methodology Explanations**: Explains EfficientNetB0 compound scaling, Mobile Inverted Bottleneck (MBConv) layers, and Grad-CAM mathematical formulations.
- **Follow-Up Suggestions**: Dynamic suggested questions guiding the user through thorough agronomic investigations.

### 9. 📄 Export-Ready Agronomic Diagnostic Reports
- **Formatted Printable Certificates**: Generates structured, print-ready diagnostic summaries suitable for farm audits, academic reviews, or laboratory handoffs.
- **Complete Visual Dossier**: Embeds the original specimen photograph, the Grad-CAM activation heatmap, confidence breakdown, symptoms summary, preventive advice, and agronomist notes.
- **Browser Print & PDF Export**: Integrated print CSS hiding application navigation and optimizing formatting for standard A4 and Letter paper sizes or digital PDF saving.
- **Advisory Disclaimers**: Incorporates prominent notices stating AI pattern recognition limitations and recommending verified extension verification.

### 10. 🎨 Botanical Agritech UI/UX & Shell
- **Botanical Color Palette**: Designed with earthy greens, clean light neutrals, and botanical accents conforming to modern agricultural tech standards.
- **Responsive Layout**: Desktop sidebar navigation with collapse toggle, mobile drawer navigation, top application bar with breadcrumbs, and live telemetry indicators.
- **Theme Flexibility**: Native Dark and Light modes with zero-flicker localStorage state persistence.
- **Accessibility & Feedback**: Refined loading skeletons, interactive buttons, animated micro-interactions (Framer Motion), accessible contrast ratios, and toast notifications.
- **System Health & Telemetry**: Dedicated Settings page displaying live FastAPI service health (`/api/health`), model readiness, database driver telemetry, and client endpoints.

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

## 🏗️ System Architecture & Workflow

```
   ┌────────────────────────────────────────────────────────┐
   │                  Tomato Leaf Specimen                  │
   │               (Camera / Upload / Sensor)               │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             Preprocessing & Normalization              │
   │        (RGB Conversion • 224×224 Bilinear • [0,255])   │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            EfficientNetB0 Deep Learning Core           │
   │  ┌──────────────────────────────────────────────────┐  │
   │  │  MBConv Feature Extractor (ImageNet Weights)     │  │
   │  │  Global Average Pooling (1280 Channels)          │  │
   │  │  Batch Normalization + Dense(256) + Dropout(0.3) │  │
   │  │  Dense Softmax Output (10 Target Classes)        │  │
   │  └──────────────────────────────────────────────────┘  │
   └───────────────┬────────────────────────┬───────────────┘
                   │                        │
                   ▼                        ▼
   ┌────────────────────────┐      ┌────────────────────────┐
   │   Grad-CAM Engine      │      │    Softmax Prediction  │
   │  (top_conv Gradients)  │      │  (Probabilities, Top-3)│
   └───────────────┬────────┘      └────────┬───────────────┘
                   │                        │
                   └───────────┬────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                  Next.js 14 Frontend                   │
   │  • Diagnostic Banner with Class & Measured Latency     │
   │  • Interactive Grad-CAM Heatmap Opacity Slider         │
   │  • Curated Pathology Info & Prevention Protocols       │
   │  • SQLite Persistent Journaling & Note Annotation      │
   │  • Exportable PDF / Print Agronomic Report             │
   └────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Deep Learning** | TensorFlow 2.21, Keras 3.15, EfficientNetB0, NumPy, OpenCV, scikit-learn |
| **Explainable AI (XAI)** | Grad-CAM (Gradient-Weighted Class Activation Mapping targeting `top_conv`) |
| **Backend API** | Python 3.13, FastAPI 0.139, Uvicorn, Pydantic v2, SQLAlchemy 2.0 |
| **Data Storage** | SQLite (ACID-compliant relational ledger for prediction telemetry and notes) |
| **Frontend Framework** | Next.js 14.2 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React, Framer Motion, Recharts, Custom Botanical Theme |
| **Quality & Testing** | Pytest, TestClient, Automated Preprocessing and Metric Validation Suites |

---

## 📁 Repository Structure

```
├── Dockerfile                  # Container definition for cloud deployment
├── render.yaml                 # Render Blueprint configuration
├── vercel.json                 # Vercel deployment configuration
├── run_tomatocare.bat          # One-click Windows local demo launcher
├── stop_tomatocare.bat         # Clean shutdown script
├── EXAMINER_DEMO_GUIDE.md      # Examiner defense & presentation cheat-sheet
├── demo_samples/               # 10 benchmark test leaf images (one per class)
├── backend/
│   ├── app/                    # FastAPI endpoints, schemas, services, DB models
│   ├── ml/                     # EfficientNetB0, Grad-CAM, dataset loader, evaluator
│   ├── artifacts/              # Trained model weights, metadata, evaluation metrics
│   ├── requirements.txt        # Python backend dependencies
│   └── tests/                  # Automated pytest test suite
├── frontend/
│   ├── src/app/                # 10 Next.js App Router main pages
│   ├── src/components/         # Reusable UI, layout, and modal components
│   ├── src/lib/                # Typed API client and styling utilities
│   └── package.json            # Frontend Node dependencies
└── docs/                       # Technical setup, methodology, and API documentation
```

---

## ⚡ Quick Execution Commands

### Local Launch (One-Click)
- **Windows**: Double-click `run_tomatocare.bat` to launch both backend and frontend servers and open `http://localhost:3000`.
- **Manual Launch**:
  ```bash
  # Terminal 1 - Backend API:
  python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
  
  # Terminal 2 - Frontend Web UI:
  cd frontend && npm run start -- -p 3000
  ```

### Automated Testing
```bash
# Run backend test suite:
python -m pytest backend/tests/ -v

# Run frontend production build check:
cd frontend && npm run build
```

---

## ⚠️ Agricultural Advisory & Disclaimers

1. **Statistical Correlation**: Model predictions reflect visual feature pattern matching on leaf images and do not constitute certified laboratory diagnostic tests.
2. **Field Environment Variance**: Uncontrolled ambient lighting, dust, camera flare, insect co-infestation, and unfamiliar tomato cultivars may impact accuracy compared to controlled benchmark datasets.
3. **Pesticide Compliance**: TomatoCare AI provides educational cultural and preventive guidelines. Always consult local university or governmental agricultural extension specialists before applying chemical crop protection products.

---

## 📄 License

This project is open-source and distributed under the **MIT License**.
