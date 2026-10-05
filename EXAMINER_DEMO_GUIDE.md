# TomatoCare AI — Examiner Demonstration & Defense Guide

Use this document to prepare for your presentation and project viva tomorrow.

---

## 1. Fast Startup (Before Examiner Calls You)

### Option A: One-Click Local Demo (Recommended & Safest)
1. Double-click `run_tomatocare.bat` in the project root (`c:\wse\AgroAI`).
2. Two console windows will launch (FastAPI Backend + Next.js Frontend).
3. The browser will open automatically at **http://localhost:3000**.
4. Test image specimens are organized in **`c:\wse\AgroAI\demo_samples\`** ready for drag-and-drop.

### Option B: Instant Public HTTPS Link (If Examiner wants to open on their phone/laptop)
Run in a separate PowerShell window:
```bash
npx localtunnel --port 3000
```
It gives you a public HTTPS URL (e.g. `https://tomato-ai-demo.loca.lt`) that anyone on the WiFi can open on their mobile phone!

---

## 2. The 3-Minute Examiner Demo Script

### Step 1: Problem Statement & Architecture (45 seconds)
> *"Respected Examiners, our project is TomatoCare AI: Tomato Leaf Disease Detection and Classification using EfficientNetB0 Deep Learning with Grad-CAM Explainable AI.*
> *Tomato crops suffer severe yield loss from 9 major foliar diseases. Our system classifies leaves into 10 discrete classes with real-time inference and provides visual attention heatmaps so agricultural consultants can verify which leaf regions influenced the decision."*

### Step 2: Live Inference & Grad-CAM (90 seconds)
1. Click **"Leaf Detection"** in the sidebar.
2. Open the **`demo_samples/`** folder in Windows Explorer and drag `02_Tomato_Early_Blight.jpg` into the upload zone.
3. Click **"Analyze Leaf Specimen"**:
   - Point out the **Primary Prediction** (`Tomato Early Blight`), **Category** (`Fungal`), and **Latency** (`~30-50 ms`).
   - Show the **Top-3 Probability Distribution** bars.
   - Point to the **Grad-CAM Attention Heatmap**: Drag the opacity slider to show the examiner how the network activates specifically on the concentric lesion rings.
   - Click **"Generate Report"** to show the professional PDF/Print diagnostic certificate with the specimen photo and agronomic guidance.

### Step 3: Scientific Rigor & System Features (45 seconds)
1. Navigate to **"Model Performance"** (`/model-performance`):
   - Show the **10×10 Confusion Matrix Heatmap**.
   - Show the **Training & Validation Accuracy/Loss curves**.
2. Navigate to **"Crop Health Journal"** (`/journal`):
   - Show how the prediction was persisted into SQLite database with notes and bookmarking.
3. Open the **"Plant Assistant"** widget from the header and show domain-grounded query answering.

---

## 3. Top 5 Examiner Questions & Model Answers

### Q1: Why did you choose EfficientNetB0 instead of ResNet50 or VGG16?
> **Answer**: *"VGG16 has ~138 million parameters and ResNet50 has ~25 million. EfficientNetB0 uses compound scaling with MBConv (Mobile Inverted Bottleneck) blocks and Squeeze-and-Excitation attention, achieving superior feature representation with only ~5.3 million parameters (approx. 5x fewer parameters than ResNet50). This makes it fast enough for real-time mobile and edge field deployment."*

### Q2: How does Grad-CAM work in this architecture?
> **Answer**: *"Grad-CAM computes the gradients of the target class score with respect to the feature activation maps of the final convolutional layer (`top_conv`). The pooled gradients act as importance weights (\(\alpha_k\)), and a ReLU activation isolates positive visual evidence, creating a 2D spatial heatmap localized over disease lesions."*

### Q3: What dataset did you use and how were splits handled?
> **Answer**: *"We used the benchmark PlantVillage tomato subset covering 10 classes (9 diseases + healthy). We applied a stratified 70% train, 15% validation, and 15% held-out test split with a fixed random seed. Data augmentations (flips, rotations, contrast) were strictly applied to training data only to prevent data leakage."*

### Q4: How did you train the model?
> **Answer**: *"We implemented a two-stage transfer learning protocol with ImageNet pretrained weights. In Phase 1, the backbone was frozen to train the custom dense classification head with Adam optimizer (\(\text{LR}=10^{-4}\)). In Phase 2, the top 30 layers were unfrozen for fine-tuning at a reduced learning rate (\(\text{LR}=10^{-5}\)) with EarlyStopping and ReduceLROnPlateau callbacks."*

### Q5: What happens if an image is blurry or contains fingers/soil?
> **Answer**: *"Our preprocessing validates file formats, dimensions, and decodability. In addition, the Grad-CAM visualization immediately reveals if the model focused on background artifacts rather than the leaf blade, giving the agronomist visual transparency to reject unreliable samples."*
