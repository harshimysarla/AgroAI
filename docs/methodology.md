# TomatoCare AI — Deep Learning Methodology & Architecture

## 1. Problem Formulation

Tomato (*Solanum lycopersicum*) is among the world's most widely consumed vegetable crops, but foliar pathogens (fungal, bacterial, viral, oomycete, and pest infestations) cause billions of dollars in annual agricultural losses. Visual diagnosis in the field is hindered by overlapping symptom morphology and variable lighting conditions.

TomatoCare AI formulates the problem as a 10-class multi-class image classification task:
\[
f_\theta : \mathbb{R}^{224 \times 224 \times 3} \to \Delta^9
\]
where \(\Delta^9\) is the 10-dimensional probability simplex computed via the Softmax activation function.

---

## 2. Supported Pathology Classes

| Class Index | Canonical Identifier | Common Name | Category | Pathogen / Vector |
|---|---|---|---|---|
| **0** | `Tomato___Bacterial_spot` | Bacterial Spot | Bacterial | *Xanthomonas perforans* |
| **1** | `Tomato___Early_blight` | Early Blight | Fungal | *Alternaria solani* |
| **2** | `Tomato___Late_blight` | Late Blight | Oomycete | *Phytophthora infestans* |
| **3** | `Tomato___Leaf_Mold` | Leaf Mold | Fungal | *Passalora fulva* |
| **4** | `Tomato___Septoria_leaf_spot` | Septoria Leaf Spot | Fungal | *Septoria lycopersici* |
| **5** | `Tomato___Spider_mites Two-spotted_spider_mite` | Spider Mites | Pest | *Tetranychus urticae* |
| **6** | `Tomato___Target_Spot` | Target Spot | Fungal | *Corynespora cassiicola* |
| **7** | `Tomato___Tomato_Yellow_Leaf_Curl_Virus` | Yellow Leaf Curl Virus | Viral | *TYLCV* (Vector: Whitefly) |
| **8** | `Tomato___Tomato_mosaic_virus` | Tomato Mosaic Virus | Viral | *ToMV* (Mechanical vector) |
| **9** | `Tomato___healthy` | Tomato Healthy | Healthy | None (Physiologically sound) |

---

## 3. EfficientNetB0 Neural Architecture

### 3.1 Compound Scaling
EfficientNet balances network depth \(d\), width \(w\), and resolution \(r\) using a compound coefficient \(\phi\):
\[
d = \alpha^\phi, \quad w = \beta^\phi, \quad r = \gamma^\phi
\]
subject to \(\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2\) and \(\alpha \ge 1, \beta \ge 1, \gamma \ge 1\).

### 3.2 Mobile Inverted Bottleneck (MBConv)
The core computational unit is the **MBConv** block featuring:
1. Pointwise \(1 \times 1\) expansion convolution.
2. Depthwise \(3 \times 3\) or \(5 \times 5\) spatial convolution.
3. Squeeze-and-Excitation (SE) channel-attention optimization.
4. Pointwise \(1 \times 1\) projection without non-linearity.
5. Inverted residual skip connections where stride = 1.

### 3.3 Custom Transfer Learning Head
```
Input (224 × 224 × 3)
  ↓
EfficientNetB0 Backbone (Pretrained ImageNet weights, 1280 feature channels)
  ↓
GlobalAveragePooling2D
  ↓
BatchNormalization
  ↓
Dense(256, activation='relu', kernel_regularizer=L2(1e-4))
  ↓
Dropout(rate=0.3)
  ↓
Dense(10, activation='softmax', name='predictions')
```

---

## 4. Two-Stage Training Protocol

1. **Phase 1: Feature Extraction Head Training**:
   - Backbone frozen (`trainable=False`).
   - Optimizer: Adam (\(\text{LR} = 10^{-4}\)).
   - Objective: Optimize custom dense projection weights while preserving general low-level edge and texture representations.

2. **Phase 2: Backbone Fine-Tuning**:
   - Top 30 backbone layers unfrozen (`trainable=True`, Batch Normalization remaining frozen).
   - Optimizer: Adam (\(\text{LR} = 10^{-5}\)).
   - Objective: Specialize high-level feature filters to subtle botanical necrosis, chlorosis, and lesion borders.

---

## 5. Grad-CAM Explainable AI (XAI)

Grad-CAM computes gradients of the predicted class score \(y^c\) with respect to feature map activations \(A^k\) of the final convolutional layer:
\[
\alpha_k^c = \frac{1}{Z} \sum_{i=1}^u \sum_{j=1}^v \frac{\partial y^c}{\partial A_{i,j}^k}
\]
The final heatmap is synthesized by a weighted combination followed by ReLU:
\[
L_{\text{Grad-CAM}}^c = \text{ReLU}\left( \sum_k \alpha_k^c A^k \right)
\]
The normalized heatmap is resized and overlaid onto the original leaf to reveal which pixel clusters drove the classification decision.
