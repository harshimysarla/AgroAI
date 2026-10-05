"use client";

import React, { useState } from "react";
import { Flag, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId?: number;
  predictedClass: string;
}

const TOMATO_CLASSES = [
  "Tomato Bacterial Spot",
  "Tomato Early Blight",
  "Tomato Late Blight",
  "Tomato Leaf Mold",
  "Tomato Septoria Leaf Spot",
  "Tomato Spider Mites",
  "Tomato Target Spot",
  "Tomato Yellow Leaf Curl Virus",
  "Tomato Mosaic Virus",
  "Tomato Healthy",
  "Other / Unknown Condition",
];

export function FeedbackDialog({
  isOpen,
  onClose,
  predictionId,
  predictedClass,
}: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState("uncertain_prediction");
  const [suggestedClass, setSuggestedClass] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitFeedback({
        prediction_id: predictionId,
        predicted_class: predictedClass,
        user_suggested_class: suggestedClass || undefined,
        feedback_type: feedbackType,
        comments: comments || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Report Prediction Feedback</h3>
              <p className="text-xs text-muted-foreground">Assistive Research Audit Log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-foreground">Feedback Recorded</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Thank you. Your observation has been logged for agronomic validation and model review.
            </p>
            <Button onClick={onClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground space-y-1 border border-border/60">
              <div>
                <span className="font-semibold text-foreground">Model Predicted:</span>{" "}
                <span className="text-botanical-800 dark:text-botanical-300 font-medium">
                  {predictedClass}
                </span>
              </div>
              {predictionId && <div>Record ID: #{predictionId}</div>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Feedback Type</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600"
              >
                <option value="uncertain_prediction">Low confidence / Visual ambiguity</option>
                <option value="incorrect_prediction">Incorrect disease classification</option>
                <option value="image_artifact">Image quality or lighting distortion</option>
                <option value="multiple_symptoms">Multiple overlapping diseases present</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Suggested Correct Class (Optional)
              </label>
              <select
                value={suggestedClass}
                onChange={(e) => setSuggestedClass(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600"
              >
                <option value="">-- Select suspected condition --</option>
                {TOMATO_CLASSES.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Field Observations & Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Describe leaf texture, greenhouse humidity, or visible spore patterns..."
                className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600 placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
