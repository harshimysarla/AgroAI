"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  ScanLine,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { AnalyticsResponse } from "@/types";
import { getCategoryBadgeClass } from "@/lib/utils";

const COLORS = ["#15803d", "#f59e0b", "#e11d48", "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Failed to fetch analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  const categoryChartData = analytics?.category_breakdown
    ? Object.entries(analytics.category_breakdown).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            System Usage Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Telemetry metrics and distribution trends calculated from stored diagnostic inferences.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            New Leaf Analysis
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Aggregating telemetry and diagnosis statistics...
        </div>
      ) : !analytics || analytics.total_analyses === 0 ? (
        <Card className="border-border border-dashed p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Diagnostic Data Yet</h3>
            <p className="max-w-sm text-xs text-muted-foreground">
              Run leaf analyses to generate telemetry data and populate real usage distributions.
            </p>
            <Link href="/detect">
              <Button size="sm">Perform First Analysis</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Total Inferences Executed</CardDescription>
                <CardTitle className="text-2xl font-black text-foreground">
                  {analytics.total_analyses}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Validated against SQLite persistent ledger
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Mean Prediction Confidence</CardDescription>
                <CardTitle className="text-2xl font-black text-botanical-700 dark:text-botanical-400">
                  {Math.round(analytics.average_confidence * 1000) / 10}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Across all 10 target classes
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Mean Inference Latency</CardDescription>
                <CardTitle className="text-2xl font-black text-foreground">
                  {analytics.average_inference_time_ms} ms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  EfficientNetB0 CPU/GPU forward pass
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Top Identified Class</CardDescription>
                <CardTitle className="text-lg font-bold text-foreground truncate">
                  {analytics.class_distribution[0]?.name || "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {analytics.class_distribution[0]?.count || 0} occurrences (
                  {analytics.class_distribution[0]?.percentage || 0}%)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Category Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <PieIcon className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                    <span>Pathology Category Breakdown</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Distribution across Fungal, Bacterial, Viral, Pest, and Healthy classes
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Activity (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                    <span>Daily Analysis Frequency</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Diagnostic requests logged over recent activity cycles
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.timeline}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" fontSize={11} stroke="currentColor" opacity={0.6} />
                      <YAxis allowDecimals={false} fontSize={11} stroke="currentColor" opacity={0.6} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Class Distribution Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Class Frequency Distribution</CardTitle>
              <CardDescription className="text-xs">
                Empirical breakdown of classifications performed on this system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {analytics.class_distribution.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-muted-foreground w-6">#{idx + 1}</span>
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center w-full sm:w-64">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-botanical-700 dark:bg-botanical-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-foreground w-16 text-right">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Epidemiological Disclaimer */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30 p-4 space-y-1 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400" /> Telemetry
              Notice:
            </span>
            <p className="leading-relaxed">{analytics.disclaimer}</p>
          </div>
        </>
      )}
    </div>
  );
}
