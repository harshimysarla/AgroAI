"use client";

import React from "react";
import { Printer, X, Download, ShieldAlert, CheckCircle2, Leaf } from "lucide-react";
import { PredictResponse, HistoryDetail } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PredictResponse | HistoryDetail;
  originalImageSrc?: string;
  notes?: string;
}

export function PrintableReportModal({
  isOpen,
  onClose,
  data,
  originalImageSrc,
  notes,
}: PrintableReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPredictResponse = "predicted_class_index" in data;
  const displayName = isPredictResponse
    ? (data as PredictResponse).display_name
    : (data as HistoryDetail).predicted_class;
  const category = data.category;
  const severity = data.severity;
  const confidence = isPredictResponse
    ? (data as PredictResponse).confidence_percent
    : Math.round((data as HistoryDetail).confidence * 1000) / 10;
  const inferenceTime = data.inference_time_ms;
  const modelVersion = data.model_version || "1.0.0";
  const gradcamUrl = isPredictResponse
    ? (data as PredictResponse).gradcam_overlay_url
    : (data as HistoryDetail).gradcam_data_url;
  const imageSrc =
    originalImageSrc ||
    (isPredictResponse ? undefined : (data as HistoryDetail).image_data_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Diagnostic Report Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-botanical-700 hover:bg-botanical-800 text-white"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-900 font-sans" id="printable-report">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white">
                <Leaf className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  TomatoCare <span className="text-emerald-700">AI</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  EfficientNetB0 Tomato Leaf Pathology Diagnostic Report
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 space-y-0.5">
              <div>
                <span className="font-semibold text-slate-700">Date Generated:</span>{" "}
                {new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Architecture:</span> EfficientNetB0 (v{modelVersion})
              </div>
              <div>
                <span className="font-semibold text-slate-700">Latency:</span> {inferenceTime} ms
              </div>
            </div>
          </div>

          {/* Primary Result Banner */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Classification Output
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{displayName}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-emerald-200 text-emerald-900">
                    Category: {category}
                  </span>
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-emerald-200 text-emerald-900">
                    Severity: {severity}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-medium text-slate-500">Model Confidence</span>
                <div className="text-3xl font-black text-emerald-800">{confidence}%</div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {imageSrc && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Analyzed Leaf Specimen
                </span>
                <div className="h-56 w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={imageSrc}
                    alt="Analyzed specimen"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {gradcamUrl && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Grad-CAM Attention Map
                </span>
                <div className="h-56 w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={gradcamUrl}
                    alt="Grad-CAM visualization"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* User Observations / Field Notes */}
          {notes && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Agronomist Field Notes
              </span>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Disease Profile Details if available */}
          {isPredictResponse && (data as PredictResponse).disease_info && (
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Pathology Information & Guidance
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                {(data as PredictResponse).disease_info?.overview}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-1.5">
                  <span className="font-bold text-slate-800">Primary Symptoms:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {(data as PredictResponse).disease_info?.symptoms.slice(0, 3).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-1.5">
                  <span className="font-bold text-slate-800">Preventive Measures:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {(data as PredictResponse).disease_info?.prevention.slice(0, 3).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Advisory Disclaimer */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold">Agricultural AI Disclaimer:</span> This report was
              generated using automated deep learning image pattern matching (EfficientNetB0). Model
              probabilities reflect statistical feature correlation on leaf imagery and should not
              replace certified agronomist laboratory diagnosis or local agricultural extension
              counsel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
