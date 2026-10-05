"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  Table as TableIcon,
  ShieldAlert,
  AlertTriangle,
  Info,
  ScanLine,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { EvaluationMetricsResponse, ModelStatusResponse } from "@/types";

export default function ModelPerformancePage() {
  const [metricsData, setMetricsData] = useState<EvaluationMetricsResponse | null>(null);
  const [trainingInfo, setTrainingInfo] = useState<any>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cmMode, setCmMode] = useState<"normalized" | "raw">("normalized");

  useEffect(() => {
    Promise.allSettled([
      api.getModelMetrics(),
      api.getModelTrainingInfo(),
      api.getModelStatus(),
    ])
      .then(([metricsRes, trainRes, statusRes]) => {
        if (metricsRes.status === "fulfilled") setMetricsData(metricsRes.value);
        if (trainRes.status === "fulfilled") setTrainingInfo(trainRes.value);
        if (statusRes.status === "fulfilled") setModelStatus(statusRes.value);
      })
      .finally(() => setLoading(false));
  }, []);

  const history = trainingInfo?.data?.history;
  const epochsChartData = history?.epoch
    ? history.epoch.map((ep: number, idx: number) => ({
        epoch: `Epoch ${ep}`,
        loss: history.loss[idx],
        accuracy: Math.round(history.accuracy[idx] * 1000) / 10,
        val_loss: history.val_loss[idx],
        val_accuracy: Math.round(history.val_accuracy[idx] * 1000) / 10,
      }))
    : [];

  const metrics = metricsData?.metrics;
  const overall = metrics?.overall;
  const perClass = metrics?.per_class || [];
  const cm = metrics?.confusion_matrix;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Model Evaluation & Benchmark Metrics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Empirical validation results measured strictly on the held-out test split.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            Test Real Inference
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading evaluation metrics and loss curves...
        </div>
      ) : !metricsData?.is_available || !overall ? (
        <Card className="border-border border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Evaluation Metrics Not Generated Yet
            </h3>
            <p className="max-w-md text-xs text-muted-foreground">
              {metricsData?.message ||
                "Run 'python scripts/evaluate_model.py' in the terminal to evaluate the trained model on the test dataset and generate confusion matrix artifacts."}
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Key Overall KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Held-Out Test Accuracy</CardDescription>
                <CardTitle className="text-2xl font-black text-botanical-700 dark:text-botanical-400">
                  {Math.round(overall.test_accuracy * 1000) / 10}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {overall.total_test_samples} Test Specimens
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Macro Precision</CardDescription>
                <CardTitle className="text-2xl font-black text-foreground">
                  {overall.macro_precision}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Unweighted class average</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Macro Recall</CardDescription>
                <CardTitle className="text-2xl font-black text-foreground">
                  {overall.macro_recall}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Sensitivity across 10 classes</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Macro F1-Score</CardDescription>
                <CardTitle className="text-2xl font-black text-botanical-700 dark:text-botanical-400">
                  {overall.macro_f1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Harmonic mean of P & R</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Weighted F1-Score</CardDescription>
                <CardTitle className="text-2xl font-black text-foreground">
                  {overall.weighted_f1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Weighted by class support</p>
              </CardContent>
            </Card>
          </div>

          {/* Loss & Accuracy Curves */}
          {epochsChartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                    <span>Training vs Validation Accuracy</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Convergence progression across transfer learning and fine-tuning epochs
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={epochsChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="epoch" fontSize={11} stroke="currentColor" opacity={0.6} />
                      <YAxis
                        unit="%"
                        domain={[0, 100]}
                        fontSize={11}
                        stroke="currentColor"
                        opacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Train Accuracy"
                        stroke="#15803d"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val_accuracy"
                        name="Val Accuracy"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <span>Training vs Validation Loss</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sparse Categorical Crossentropy loss minimization trajectory
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={epochsChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="epoch" fontSize={11} stroke="currentColor" opacity={0.6} />
                      <YAxis fontSize={11} stroke="currentColor" opacity={0.6} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="loss"
                        name="Train Loss"
                        stroke="#e11d48"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val_loss"
                        name="Val Loss"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Per-Class Classification Report Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TableIcon className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>Per-Class Performance Metrics (Test Split)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Precision, Recall, and F1-score computed across all 10 PlantVillage classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 text-muted-foreground uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Class Index</th>
                      <th className="py-2.5 px-3">Target Condition</th>
                      <th className="py-2.5 px-3">Precision</th>
                      <th className="py-2.5 px-3">Recall</th>
                      <th className="py-2.5 px-3">F1-Score</th>
                      <th className="py-2.5 px-3 text-right">Test Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {perClass.map((row) => (
                      <tr key={row.class_index} className="hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          #{row.class_index + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {row.display_name}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{row.precision}</td>
                        <td className="py-2.5 px-3 font-mono">{row.recall}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-botanical-700 dark:text-botanical-400">
                          {row.f1_score}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right text-muted-foreground">
                          {row.support}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 10x10 Confusion Matrix Heatmap */}
          {cm && (
            <Card className="border-border">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold">
                    10×10 Confusion Matrix Heatmap
                  </CardTitle>
                  <CardDescription className="text-xs">
                    True Class (Rows) vs. Predicted Class (Columns)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <button
                    onClick={() => setCmMode("normalized")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      cmMode === "normalized"
                        ? "bg-botanical-700 text-white dark:bg-botanical-600"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Normalized (%)
                  </button>
                  <button
                    onClick={() => setCmMode("raw")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      cmMode === "raw"
                        ? "bg-botanical-700 text-white dark:bg-botanical-600"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Raw Counts
                  </button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[700px] space-y-1 text-xs">
                  <div className="grid grid-cols-11 gap-1 font-mono text-[10px] text-muted-foreground text-center font-bold">
                    <div>True\Pred</div>
                    {cm.labels.map((_, idx) => (
                      <div key={idx} title={cm.labels[idx]}>
                        C{idx + 1}
                      </div>
                    ))}
                  </div>

                  {(cmMode === "normalized" ? cm.normalized : cm.raw).map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-11 gap-1 items-center">
                      <div
                        className="font-mono text-[10px] text-muted-foreground font-bold truncate pr-1"
                        title={cm.labels[rIdx]}
                      >
                        C{rIdx + 1}
                      </div>
                      {row.map((val, cIdx) => {
                        const intensity = cmMode === "normalized" ? val : val / 5;
                        const isDiagonal = rIdx === cIdx;
                        return (
                          <div
                            key={cIdx}
                            title={`True: ${cm.labels[rIdx]} | Pred: ${cm.labels[cIdx]} | Value: ${val}`}
                            className={`h-8 rounded flex items-center justify-center font-mono text-[10px] transition-colors ${
                              isDiagonal
                                ? "bg-emerald-600/80 text-white font-bold"
                                : val > 0
                                ? "bg-amber-500/30 text-foreground"
                                : "bg-muted/40 text-muted-foreground/50"
                            }`}
                          >
                            {cmMode === "normalized" ? `${Math.round(val * 100)}%` : val}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model & Dataset Metadata Specifications */}
          {modelStatus?.model_metadata && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Info className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                  <span>Model Architecture & Dataset Specifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                  <span className="text-muted-foreground">Total Parameters</span>
                  <div className="text-sm font-bold text-foreground">
                    {modelStatus.model_metadata.training_params.total_params.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                  <span className="text-muted-foreground">Trainable Parameters</span>
                  <div className="text-sm font-bold text-foreground">
                    {modelStatus.model_metadata.training_params.trainable_params.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                  <span className="text-muted-foreground">Optimizer & Head LR</span>
                  <div className="text-sm font-bold text-foreground">
                    Adam ({modelStatus.model_metadata.training_params.initial_learning_rate})
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                  <span className="text-muted-foreground">Fine-Tuning LR</span>
                  <div className="text-sm font-bold text-foreground">
                    {modelStatus.model_metadata.training_params.fine_tune_learning_rate}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scientific Caveat Alert */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30 p-4 space-y-1 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400" /> Evaluation
              Generalization Caveat:
            </span>
            <p className="leading-relaxed">
              Test metrics reflect performance on controlled benchmark imagery. Real-world field
              accuracy may vary depending on ambient field illumination, overlapping viral vectors,
              severe leaf dust, and camera focus.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
