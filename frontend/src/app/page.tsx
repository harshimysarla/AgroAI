"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ScanLine,
  BookOpen,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { ModelStatusResponse, HistoryItem } from "@/types";
import { formatDateTime, getCategoryBadgeClass } from "@/lib/utils";

const SUPPORTED_CLASSES = [
  { name: "Tomato Bacterial Spot", cat: "Bacterial", severity: "High" },
  { name: "Tomato Early Blight", cat: "Fungal", severity: "Moderate" },
  { name: "Tomato Late Blight", cat: "Oomycete", severity: "Severe" },
  { name: "Tomato Leaf Mold", cat: "Fungal", severity: "Moderate" },
  { name: "Tomato Septoria Leaf Spot", cat: "Fungal", severity: "Moderate" },
  { name: "Tomato Spider Mites", cat: "Pest", severity: "Moderate" },
  { name: "Tomato Target Spot", cat: "Fungal", severity: "Moderate" },
  { name: "Tomato Yellow Leaf Curl Virus", cat: "Viral", severity: "Severe" },
  { name: "Tomato Mosaic Virus", cat: "Viral", severity: "High" },
  { name: "Tomato Healthy", cat: "Healthy", severity: "None" },
];

export default function OverviewDashboard() {
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.getModelStatus(), api.getHistory(5, 0)])
      .then(([statusRes, historyRes]) => {
        if (statusRes.status === "fulfilled") setModelStatus(statusRes.value);
        if (historyRes.status === "fulfilled") setRecentHistory(historyRes.value);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-botanical-900 via-botanical-800 to-botanical-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-botanical-700/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-botanical-600/50">
            <Sparkles className="h-3.5 w-3.5 text-botanical-300" />
            <span>Real Deep Learning Plant Pathology</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            TomatoCare AI
          </h1>
          <p className="text-sm sm:text-base text-botanical-100/90 leading-relaxed font-normal">
            Automated tomato leaf disease detection, classification, and Grad-CAM explainability
            powered by transfer-learned <strong>EfficientNetB0</strong> neural networks.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/detect">
              <Button size="lg" className="bg-white text-botanical-900 hover:bg-botanical-50 font-bold shadow-lg">
                <ScanLine className="mr-2 h-5 w-5 text-botanical-700" />
                Start Leaf Analysis
              </Button>
            </Link>
            <Link href="/diseases">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <BookOpen className="mr-2 h-5 w-5" />
                Disease Encyclopedia
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Background Botanical Pattern */}
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none hidden md:block">
          <Cpu className="h-80 w-80 text-white" />
        </div>
      </div>

      {/* Model Readiness & System Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Model Engine Status</CardDescription>
            <CardTitle className="text-lg flex items-center gap-2">
              {modelStatus?.is_ready ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ready & Loaded</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>Model Offline</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground truncate">
              {modelStatus?.message || "Checking inference backend..."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Deep Learning Architecture</CardDescription>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
              <span>EfficientNetB0</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Compound Scaled MBConv Feature Extractor
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Input Resolution & Output</CardDescription>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
              <span>224 × 224 × 3</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              10 Discrete PlantVillage Classes (Softmax)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Explainability Module</CardDescription>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
              <span>Grad-CAM Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Feature Map Gradient Localization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Visualization */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-bold">End-to-End Diagnostic Pipeline</CardTitle>
          <CardDescription>
            Architectural workflow from leaf specimen acquisition to explainable AI insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {[
              { step: "01", title: "Image Upload", desc: "RGB Leaf Image (JPG/PNG/WEBP)" },
              { step: "02", title: "Preprocessing", desc: "224×224 Normalization & Channel Align" },
              { step: "03", title: "EfficientNetB0", desc: "MBConv Feature Extraction & GAP" },
              { step: "04", title: "Softmax Output", desc: "10-Class Probabilities & Ranking" },
              { step: "05", title: "Grad-CAM & Care", desc: "Attention Heatmap & Agronomic Advice" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative flex flex-col rounded-xl border border-border bg-muted/40 p-4 transition-all hover:bg-muted/70"
              >
                <span className="text-xs font-black text-botanical-700 dark:text-botanical-400">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-foreground mt-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported 10 Classes Grid */}
      <Card className="border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Supported 10 Tomato Leaf Classes</CardTitle>
            <CardDescription>
              Benchmark classification taxonomy conforming to PlantVillage standards
            </CardDescription>
          </div>
          <Link href="/diseases">
            <Button variant="ghost" size="sm" className="text-xs text-botanical-700 hover:text-botanical-800">
              Browse Encyclopedia <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SUPPORTED_CLASSES.map((cls, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 shadow-sm hover:border-botanical-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Class #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        cls.cat
                      )}`}
                    >
                      {cls.cat}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight">
                    {cls.name}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
                  <span>Severity:</span>
                  <span className="font-medium text-foreground">{cls.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Persistent Predictions Feed */}
      <Card className="border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Recent Genuine Inferences</CardTitle>
            <CardDescription>
              Authenticated historical diagnostic records saved in database
            </CardDescription>
          </div>
          <Link href="/journal">
            <Button variant="outline" size="sm" className="text-xs">
              Open Full Journal <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading recent inferences...
            </div>
          ) : recentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">No analyses recorded yet</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Upload a tomato leaf specimen to run inference and populate the persistent health journal.
              </p>
              <Link href="/detect">
                <Button size="sm">Scan Leaf Now</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3"
                >
                  <div className="flex items-center gap-3">
                    {item.image_data_url ? (
                      <img
                        src={item.image_data_url}
                        alt="Specimen"
                        className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border shrink-0">
                        <ScanLine className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.predicted_class}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{formatDateTime(item.created_at)}</span>
                        <span>•</span>
                        <span>{item.inference_time_ms} ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {Math.round(item.confidence * 1000) / 10}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
