"use client";

import React, { useState } from "react";
import { Bot, X, Send, Sparkles, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AssistantResponse } from "@/types";
import { Button } from "@/components/ui/Button";

interface PlantAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  "How do I distinguish Early Blight from Late Blight?",
  "How does EfficientNetB0 compound scaling work?",
  "What is the function of Grad-CAM in tomato pathology?",
  "How to manage Tomato Yellow Leaf Curl Virus?",
  "What are best irrigation practices for tomato foliage?",
];

export function PlantAssistantModal({ isOpen, onClose }: PlantAssistantModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: AssistantResponse }>>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.queryAssistant(q);
      setHistory((prev) => [...prev, { q, a: response }]);
      setQuery("");
    } catch (err: any) {
      setError(err.message || "Failed to query assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-botanical-50/60 dark:bg-botanical-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-botanical-700 text-white shadow-sm dark:bg-botanical-600">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Plant Health Assistant</h3>
              <p className="text-xs text-muted-foreground">
                Domain-grounded Tomato Pathology & AI Architecture Knowledge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History & Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-botanical-100 dark:bg-botanical-950/80 text-botanical-800 dark:text-botanical-300 mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                How can I assist your crop analysis today?
              </h4>
              <p className="max-w-md text-xs text-muted-foreground mt-1 mb-6">
                Ask about tomato leaf diseases, compare symptom lookalikes, or inquire about the
                EfficientNetB0 deep learning architecture and Grad-CAM interpretability.
              </p>

              {/* Suggestions */}
              <div className="w-full space-y-2">
                <p className="text-xs font-semibold text-muted-foreground text-left px-1">
                  Suggested topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(item)}
                      className="rounded-xl border border-border bg-muted/50 px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-botanical-100 hover:border-botanical-300 dark:hover:bg-botanical-950 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-botanical-700 px-4 py-2.5 text-sm text-white shadow-sm dark:bg-botanical-600">
                    {item.q}
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-botanical-100 text-botanical-800 dark:bg-botanical-900 dark:text-botanical-200">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-3 max-w-[90%] rounded-2xl rounded-tl-sm border border-border bg-muted/40 p-4 text-sm text-foreground">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-botanical-700 dark:text-botanical-400 uppercase tracking-wider">
                        {item.a.category} • {item.a.title}
                      </span>
                    </div>

                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {item.a.content}
                    </div>

                    {item.a.suggested_questions?.length > 0 && (
                      <div className="border-t border-border/60 pt-2.5">
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5" /> Follow-up questions:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.a.suggested_questions.map((sq, sidx) => (
                            <button
                              key={sidx}
                              onClick={() => handleAsk(sq)}
                              className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] text-foreground hover:bg-botanical-50 hover:text-botanical-800 dark:hover:bg-botanical-950 transition-colors"
                            >
                              {sq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground italic border-t border-border/40 pt-1.5">
                      ⚠️ {item.a.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-botanical-100 text-botanical-800 dark:bg-botanical-900">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                Analyzing agronomic knowledge base...
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border bg-card p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about tomato leaf diseases or EfficientNetB0..."
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600 placeholder:text-muted-foreground"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!query.trim() || loading}
              className="flex items-center gap-1.5 shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Ask</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
