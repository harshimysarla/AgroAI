"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookHeart,
  Bookmark,
  Trash2,
  Printer,
  Edit3,
  Search,
  Filter,
  Check,
  X,
  ScanLine,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { HistoryItem, HistoryDetail } from "@/types";
import { formatDateTime, getCategoryBadgeClass, getSeverityBadgeClass } from "@/lib/utils";
import { PrintableReportModal } from "@/components/reports/PrintableReportModal";

const CATEGORIES = ["All", "Bacterial", "Fungal", "Oomycete / Fungal-like", "Pest", "Viral", "Healthy"];

export default function HealthJournalPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Note editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeReportDetail, setActiveReportDetail] = useState<HistoryDetail | null>(null);

  const fetchRecords = () => {
    setLoading(true);
    api
      .getHistory(100, 0, selectedCategory, bookmarkedOnly)
      .then((data) => setHistory(data))
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedCategory, bookmarkedOnly]);

  const handleToggleBookmark = async (item: HistoryItem) => {
    try {
      const updated = await api.updateHistoryNotes(item.id, item.user_notes, !item.is_bookmarked);
      setHistory((prev) =>
        prev.map((h) => (h.id === item.id ? { ...h, is_bookmarked: updated.is_bookmarked } : h))
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleSaveNote = async (id: number) => {
    try {
      const updated = await api.updateHistoryNotes(id, noteText);
      setHistory((prev) =>
        prev.map((h) => (h.id === id ? { ...h, user_notes: updated.user_notes } : h))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this historical analysis record?")) return;
    try {
      await api.deleteHistoryRecord(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleOpenReport = async (id: number) => {
    try {
      const detail = await api.getHistoryDetail(id);
      setActiveReportDetail(detail);
      setReportModalOpen(true);
    } catch (err) {
      console.error("Failed to load record details:", err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.predicted_class.toLowerCase().includes(search.toLowerCase()) ||
    (item.user_notes && item.user_notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Crop Health Journal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Persistent field diagnostic records, agronomist notes, and historical audit logs.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            New Leaf Analysis
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by predicted disease or notes..."
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600 placeholder:text-muted-foreground shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              bookmarkedOnly
                ? "border-botanical-700 bg-botanical-700 text-white dark:bg-botanical-600"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarked Only</span>
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-botanical-700 text-white dark:bg-botanical-600 shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading historical analysis records...
        </div>
      ) : filteredHistory.length === 0 ? (
        <Card className="border-border border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BookHeart className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Records Found</h3>
            <p className="max-w-sm text-xs text-muted-foreground">
              {bookmarkedOnly || selectedCategory !== "All"
                ? "No saved analyses match your active filter criteria."
                : "Analyze your first tomato leaf image to start recording persistent health entries."}
            </p>
            <Link href="/detect">
              <Button size="sm">Start First Analysis</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getSeverityBadgeClass(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.is_bookmarked
                          ? "text-amber-500 bg-amber-50 dark:bg-amber-950"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      title={item.is_bookmarked ? "Remove bookmark" : "Bookmark record"}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {item.image_data_url ? (
                    <img
                      src={item.image_data_url}
                      alt="Specimen"
                      className="h-20 w-20 rounded-xl object-cover border border-border shrink-0 bg-muted"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border shrink-0">
                      <ScanLine className="h-6 w-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold leading-tight text-foreground">
                      {item.predicted_class}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDateTime(item.created_at)}</span>
                      <span>•</span>
                      <span>{item.inference_time_ms} ms</span>
                    </div>
                    <div className="text-xs font-semibold text-botanical-700 dark:text-botanical-400 pt-0.5">
                      {Math.round(item.confidence * 1000) / 10}% Confidence
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* Notes Display / Editor */}
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add plant or field plot observations..."
                        className="w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground focus:ring-2 focus:ring-botanical-600"
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-7 px-2 text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveNote(item.id)}
                          className="h-7 px-2.5 text-xs"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Notes:</span>{" "}
                        {item.user_notes ? (
                          <span>{item.user_notes}</span>
                        ) : (
                          <span className="italic text-muted-foreground/70">No notes attached.</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setNoteText(item.user_notes || "");
                        }}
                        className="text-botanical-700 hover:text-botanical-800 p-1 shrink-0"
                        title="Edit note"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Record #{item.id}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenReport(item.id)}
                    className="h-8 text-xs flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Printable Report Modal */}
      {activeReportDetail && (
        <PrintableReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setActiveReportDetail(null);
          }}
          data={activeReportDetail}
          notes={activeReportDetail.user_notes}
        />
      )}
    </div>
  );
}
