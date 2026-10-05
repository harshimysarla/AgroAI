"use client";

import React from "react";
import Link from "next/link";
import {
  FileCode2,
  Cpu,
  Layers,
  Activity,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function MethodologyPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            System Methodology & DL Architecture
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mathematical foundations, compound scaling principles, and Grad-CAM explainability mechanics.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            Launch Inference
          </Button>
        </Link>
      </div>

      {/* Compound Scaling & EfficientNetB0 Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>EfficientNetB0 & Compound Scaling Formulation</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Principled multi-dimensional neural scaling vs. conventional arbitrary depth scaling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                Conventional convolutional neural networks traditionally scale only one dimension
                arbitrarily (such as adding more layers in ResNet-152, or increasing channel width in
                WideResNet). <strong>EfficientNetB0</strong> utilizes a compound scaling method that
                uniformly scales network depth, channel width, and input image resolution with a fixed
                set of scaling coefficients.
              </p>

              <div className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-foreground space-y-2 text-xs">
                <div>Depth: d = α^φ &nbsp;&nbsp;&nbsp; Width: w = β^φ &nbsp;&nbsp;&nbsp; Resolution: r = γ^φ</div>
                <div className="text-[11px] text-muted-foreground">
                  Subject to: α · β² · γ² ≈ 2, where α ≥ 1, β ≥ 1, γ ≥ 1
                </div>
              </div>

              <p>
                This principled compound balance ensures that receptive field expansion matches the
                increased visual granularity of leaf disease spots without exponential parameter
                explosion.
              </p>
            </CardContent>
          </Card>

          {/* Transfer Learning & Classification Head */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>Custom Tomato Pathology Classification Head</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Layer-by-layer specification of the custom transfer learning head
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                {[
                  {
                    name: "Input Layer",
                    detail: "RGB Tensor (224 × 224 × 3), normalized to standard float32 representation.",
                  },
                  {
                    name: "EfficientNetB0 Backbone",
                    detail: "MBConv blocks with Squeeze-and-Excitation (SE) attention (Pretrained ImageNet weights).",
                  },
                  {
                    name: "GlobalAveragePooling2D",
                    detail: "Reduces spatial feature maps (7×7×1280) to a compact 1280-dimensional embedding.",
                  },
                  {
                    name: "BatchNormalization",
                    detail: "Stabilizes intermediate latent distributions and accelerates gradient descent.",
                  },
                  {
                    name: "Dense Feature Projection",
                    detail: "256 units with ReLU activation and L2 kernel regularization (1e-4) to combat overfitting.",
                  },
                  {
                    name: "Dropout Regularization",
                    detail: "Rate = 0.3 to prevent co-adaptation of features during training.",
                  },
                  {
                    name: "Dense Softmax Classifier",
                    detail: "10 probability outputs corresponding to the target tomato pathology classes.",
                  },
                ].map((l, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <span className="font-mono text-xs font-bold text-botanical-700 dark:text-botanical-400 w-6 shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-foreground">{l.name}:</span>{" "}
                      <span className="text-muted-foreground">{l.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grad-CAM Formulation */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>Grad-CAM (Gradient-Weighted Class Activation Mapping)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Visual interpretability through final convolutional feature gradients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                To provide genuine interpretability into deep network decisions, Grad-CAM calculates
                the gradient of the predicted score y^c for class c with respect to the
                feature activation maps A^k of the last convolutional layer (<code>top_conv</code>).
              </p>

              <div className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-foreground space-y-2 text-xs">
                <div>α_k^c = (1/Z) ∑_i ∑_j (∂y^c / ∂A_{`i,j`}^k)</div>
                <div>L_{`Grad-CAM`}^c = ReLU( ∑_k α_k^c A^k )</div>
              </div>

              <p>
                The calculated weights α_k^c capture the importance of feature map k
                for target disease c. Applying a Rectified Linear Unit (ReLU) ensures only features
                that positively contribute to the disease class are highlighted on the leaf.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Two-Stage Training & Preprocessing */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>Two-Stage Training Protocol</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-bold text-foreground">Phase 1: Feature Extraction</span>
                <p>
                  Backbone weights are frozen (<code>trainable=False</code>). Only the custom classifier
                  head is trained with Adam (LR = 0.0001).
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-bold text-foreground">Phase 2: Fine-Tuning</span>
                <p>
                  Top 30 backbone layers are unfrozen and trained with a reduced learning rate
                  (LR = 0.00001) to adapt convolutional filters to botanical pathology.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-bold text-foreground">Automated Callbacks</span>
                <p>
                  • ModelCheckpoint (saves best <code>val_accuracy</code>)<br />
                  • EarlyStopping (patience = 5)<br />
                  • ReduceLROnPlateau (factor = 0.5)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing & Augmentation Policy */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Data Augmentation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                Augmentation is applied <strong>strictly during training</strong> to prevent data
                leakage. Validation and test sets receive deterministic 224×224 bilinear resizing only.
              </p>
              <ul className="list-disc list-inside space-y-1 pt-1 text-foreground font-medium">
                <li>Random Horizontal & Vertical Flips</li>
                <li>Random Rotation (±8%)</li>
                <li>Random Zoom (±10%)</li>
                <li>Random Translation (±8%)</li>
                <li>Random Contrast (±10%)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
