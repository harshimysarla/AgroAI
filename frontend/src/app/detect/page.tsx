"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  ScanLine,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  Printer,
  Bookmark,
  Flag,
  Info,
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { PredictResponse, GradCamResponse } from "@/types";
import { getCategoryBadgeClass, getSeverityBadgeClass } from "@/lib/utils";
import { PrintableReportModal } from "@/components/reports/PrintableReportModal";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

export default function LeafDetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);

  // Grad-CAM interactive controls
  const [gradcamAlpha, setGradcamAlpha] = useState(0.45);
  const [gradcamData, setGradcamData] = useState<GradCamResponse | null>(null);
  const [gradcamLoading, setGradcamLoading] = useState(false);

  // Modal states
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [userNote, setUserNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit.");
      return;
    }

    setError(null);
    setPrediction(null);
    setGradcamData(null);
    setRotation(0);
    setUserNote("");
    setNoteSaved(false);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setGradcamData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const result = await api.predictLeaf(selectedFile, true, true);
      setPrediction(result);
      if (result.gradcam_overlay_url && result.gradcam_heatmap_url) {
        setGradcamData({
          success: true,
          overlay_base64: result.gradcam_overlay_url,
          heatmap_base64: result.gradcam_heatmap_url,
          target_class_index: result.predicted_class_index,
          heatmap_shape: [7, 7],
          notice: "Grad-CAM computed successfully",
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze leaf image. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleOpacityChange = async (newAlpha: number) => {
    setGradcamAlpha(newAlpha);
    if (!selectedFile || !prediction) return;

    setGradcamLoading(true);
    try {
      const camRes = await api.explainImage(
        selectedFile,
        prediction.predicted_class_index,
        newAlpha
      );
      setGradcamData(camRes);
    } catch (err) {
      console.warn("Could not recalculate Grad-CAM overlay:", err);
    } finally {
      setGradcamLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!prediction?.saved_record_id || !userNote.trim()) return;
    try {
      await api.updateHistoryNotes(prediction.saved_record_id, userNote);
      setNoteSaved(true);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Tomato Leaf Disease Detection
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload or capture a tomato leaf photograph to perform real-time EfficientNetB0 deep learning
          classification and Grad-CAM interpretability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Specimen Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>Leaf Specimen Input</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Supports JPG, PNG, WEBP up to 10 MB. High-contrast leaf focus recommended.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag & Drop Zone */}
              {!previewUrl ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-botanical-600 bg-muted/30 hover:bg-botanical-50/40 dark:hover:bg-botanical-950/20 p-10 text-center cursor-pointer transition-all duration-200"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-botanical-100 text-botanical-800 dark:bg-botanical-900 dark:text-botanical-200 mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    Click to select or drag & drop leaf image
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPEG, PNG, or WEBP (Standard 224×224 inference)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                /* Image Preview Container */
                <div className="space-y-3">
                  <div className="relative h-72 w-full rounded-2xl border border-border bg-black/5 dark:bg-black/30 overflow-hidden flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Selected leaf specimen"
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className="max-h-full max-w-full object-contain transition-transform duration-200"
                    />
                  </div>

                  {/* Specimen Tools */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-muted-foreground truncate">
                      {selectedFile?.name} ({(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRotate}
                        title="Rotate 90 degrees"
                        className="h-8 px-2.5"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                        title="Clear image"
                        className="h-8 px-2.5 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="w-full h-12 text-base font-bold shadow-md shadow-botanical-900/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Running EfficientNetB0 Inference...
                  </>
                ) : (
                  <>
                    <ScanLine className="mr-2 h-5 w-5" />
                    Analyze Leaf Specimen
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Practical Capture Guidelines */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-xs text-muted-foreground">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-4 w-4 text-botanical-700 dark:text-botanical-400" />
              Optimal Diagnostic Photography Tips:
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li>Position the suspect lesion or leaf squarely in the center.</li>
              <li>Ensure even ambient lighting; avoid harsh shadows or direct flash flare.</li>
              <li>Keep background neutral (soil, bench, or uncluttered field canopy).</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Diagnostic Results & Explainability (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!prediction && !loading && (
            <Card className="border-border border-dashed h-full min-h-[420px] flex flex-col items-center justify-center text-center p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-botanical-50 dark:bg-botanical-950 text-botanical-700 dark:text-botanical-400 mb-4">
                <ScanLine className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Diagnostic Engine Ready</h3>
              <p className="max-w-md text-xs text-muted-foreground mt-1 mb-4">
                Select a tomato leaf image on the left and click <strong>Analyze Leaf Specimen</strong> to
                view predictions, model confidence, and Grad-CAM explainability heatmaps.
              </p>
            </Card>
          )}

          {loading && (
            <Card className="border-border min-h-[420px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-botanical-100 text-botanical-800 dark:bg-botanical-900 animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Processing Neural Network Layers...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Resizing 224×224 → MBConv Backbone → GAP → Softmax → Grad-CAM gradients
                </p>
              </div>
            </Card>
          )}

          {prediction && (
            <div className="space-y-6">
              {/* Primary Output Banner */}
              <Card className="border-border overflow-hidden">
                <div className="bg-gradient-to-r from-botanical-800 to-botanical-900 p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-botanical-200">
                          Primary AI Prediction
                        </span>
                        <span className="text-[10px] font-mono bg-botanical-700/80 px-2 py-0.5 rounded text-botanical-100">
                          {prediction.inference_time_ms} ms
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black mt-1">
                        {prediction.display_name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-medium border border-white/20">
                          Category: {prediction.category}
                        </span>
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-medium border border-white/20">
                          Severity: {prediction.severity}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center border border-white/20">
                      <span className="text-xs font-medium text-botanical-200">Confidence</span>
                      <div className="text-3xl font-black text-white">
                        {prediction.confidence_percent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top-3 Probabilities Breakdown */}
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Top-3 Probability Distribution
                  </h4>
                  <div className="space-y-3">
                    {prediction.top_k_predictions.map((top, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-foreground">
                            {idx + 1}. {top.display_name}
                          </span>
                          <span className="font-bold text-foreground">
                            {top.confidence_percent}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0
                                ? "bg-botanical-600 dark:bg-botanical-500"
                                : "bg-slate-400 dark:bg-slate-600"
                            }`}
                            style={{ width: `${top.confidence_percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grad-CAM Explainable AI Card */}
              {gradcamData && (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                        <span>Grad-CAM Visual Explainability</span>
                      </CardTitle>
                      <Badge variant="botanical">Conv2D Feature Maps</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Highlights specific pixels in the leaf image that triggered the EfficientNetB0
                      decision.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Original Specimen
                        </span>
                        <div className="h-52 w-full rounded-xl border border-border bg-black/5 overflow-hidden flex items-center justify-center">
                          <img
                            src={previewUrl!}
                            alt="Original"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Superimposed Activation Heatmap</span>
                          {gradcamLoading && <Loader2 className="h-3 w-3 animate-spin text-botanical-600" />}
                        </span>
                        <div className="h-52 w-full rounded-xl border border-border bg-black/5 overflow-hidden flex items-center justify-center relative">
                          <img
                            src={gradcamData.overlay_base64}
                            alt="Grad-CAM Overlay"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Opacity Slider */}
                    <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="h-3.5 w-3.5" /> Heatmap Intensity Overlay
                        </span>
                        <span>{Math.round(gradcamAlpha * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={gradcamAlpha}
                        onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                        className="w-full cursor-pointer accent-botanical-700"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disease Info & Prevention Snapshot */}
              {prediction.disease_info && (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                      <span>Pathology & Crop Care Guidance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <p className="text-muted-foreground leading-relaxed">
                      {prediction.disease_info.overview}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                        <span className="font-bold text-foreground">Identified Symptoms:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {prediction.disease_info.symptoms.slice(0, 2).map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                        <span className="font-bold text-foreground">Primary Prevention:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {prediction.disease_info.prevention.slice(0, 2).map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <Link href={`/diseases/${encodeURIComponent(prediction.raw_class_name)}`}>
                        <Button variant="ghost" size="sm" className="text-botanical-700 hover:text-botanical-800">
                          View Complete Pathology Profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Field Notes & Actions Bar */}
              <Card className="border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="Add field plot or plant observation note..."
                      className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveNote}
                      disabled={!userNote.trim() || noteSaved}
                    >
                      {noteSaved ? "Note Saved" : "Save to Journal"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReportModalOpen(true)}
                        className="flex items-center gap-1.5"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Generate Report</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setFeedbackModalOpen(true)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span>Report Anomaly</span>
                      </Button>
                    </div>

                    <Button size="sm" onClick={handleClear}>
                      Scan Another Leaf
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Advisory Caution Alert */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30 p-3.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Notice:</strong> {prediction.warning_notice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Report Modal */}
      {prediction && (
        <PrintableReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          data={prediction}
          originalImageSrc={previewUrl!}
          notes={userNote}
        />
      )}

      {/* Feedback Dialog */}
      {prediction && (
        <FeedbackDialog
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          predictionId={prediction.saved_record_id}
          predictedClass={prediction.display_name}
        />
      )}
    </div>
  );
}
