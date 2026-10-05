"use client";

import React from "react";
import Link from "next/link";
import {
  Info,
  Leaf,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  Database,
  Globe,
  Sparkles,
  ScanLine,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AboutProjectPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            About TomatoCare AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Research scope, engineering architecture, dataset provenance, and platform objectives.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            Launch Inference Engine
          </Button>
        </Link>
      </div>

      {/* Project Overview Card */}
      <Card className="border-border overflow-hidden">
        <div className="bg-gradient-to-r from-botanical-800 to-botanical-950 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-botanical-600 text-white">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Tomato Leaf Disease Detection & Classification
              </h2>
              <p className="text-xs text-botanical-200">
                EfficientNetB0 Transfer Learning & Explainable AI (Grad-CAM)
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-botanical-100/90 max-w-3xl leading-relaxed">
            TomatoCare AI is an end-to-end precision agriculture web platform engineered to assist
            growers, agricultural consultants, and researchers in early identification of tomato leaf
            pathologies. By uniting lightweight compound-scaled convolutional neural networks with
            Grad-CAM interpretability, the system offers transparent, real-time diagnostic guidance.
          </p>
        </div>
      </Card>

      {/* Technology Stack Grid */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
            <span>Full-Stack Engineering & AI Architecture</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Modern, decoupled software stack engineered for robust inference and responsiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <span className="font-bold text-foreground">Deep Learning</span>
              <p className="text-muted-foreground leading-relaxed">
                TensorFlow 2.21, Keras 3.15, EfficientNetB0, NumPy, OpenCV, scikit-learn metrics.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <span className="font-bold text-foreground">Backend API</span>
              <p className="text-muted-foreground leading-relaxed">
                Python 3.13, FastAPI, Uvicorn, Pydantic v2 validation, SQLAlchemy, SQLite persistence.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <span className="font-bold text-foreground">Frontend Platform</span>
              <p className="text-muted-foreground leading-relaxed">
                Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <span className="font-bold text-foreground">Explainable AI</span>
              <p className="text-muted-foreground leading-relaxed">
                Grad-CAM gradient feature map extraction targeting the final convolutional layer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset & Benchmark Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Database className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
              <span>PlantVillage Tomato Benchmark Dataset</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              The classification taxonomy strictly adheres to the 10 standard tomato classes defined in
              the peer-reviewed PlantVillage benchmark dataset:
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-medium text-foreground">
              <div>1. Bacterial Spot</div>
              <div>6. Spider Mites</div>
              <div>2. Early Blight</div>
              <div>7. Target Spot</div>
              <div>3. Late Blight</div>
              <div>8. Yellow Leaf Curl</div>
              <div>4. Leaf Mold</div>
              <div>9. Mosaic Virus</div>
              <div>5. Septoria Leaf Spot</div>
              <div>10. Healthy Foliage</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
              <span>Future Research Roadmap</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              • <strong>Edge Deployment:</strong> Quantization to TensorFlow Lite (TFLite INT8) for
              offline embedded operation on microcontrollers and field drones.
            </p>
            <p>
              • <strong>Multi-Crop Expansion:</strong> Extending architecture to pepper, potato, and
              cucurbit solanaceous families.
            </p>
            <p>
              • <strong>Microclimate Integration:</strong> Merging leaf imagery with real-time field
              temperature and relative humidity IoT sensor streams.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
