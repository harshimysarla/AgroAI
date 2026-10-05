"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Moon,
  Sun,
  Bot,
  ScanLine,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  setMobileOpen: (v: boolean) => void;
  onOpenAssistant: () => void;
  isModelReady?: boolean;
  modelStatusText?: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Executive Overview", subtitle: "EfficientNetB0 Tomato Pathology System" },
  "/detect": { title: "Leaf Disease Detection", subtitle: "Deep Learning Diagnostic Inference" },
  "/diseases": { title: "Disease Encyclopedia", subtitle: "Curated 10-Class Botanical Reference" },
  "/crop-care": { title: "Crop Care Center", subtitle: "Cultural Management & Prevention Practices" },
  "/journal": { title: "Health Journal", subtitle: "Persistent Field Diagnostic Records" },
  "/analytics": { title: "Usage Analytics", subtitle: "Historical Telemetry & Prevalence Trends" },
  "/model-performance": { title: "Model Performance", subtitle: "Held-Out Test Metrics & Confusion Matrix" },
  "/methodology": { title: "System Methodology", subtitle: "Compound Scaling & Transfer Learning Architecture" },
  "/about": { title: "About TomatoCare AI", subtitle: "Research Scope, Authors, & Technology Stack" },
  "/settings": { title: "Settings & System Status", subtitle: "Inference Engine Diagnostics & Config" },
};

export function Header({
  setMobileOpen,
  onOpenAssistant,
  isModelReady = false,
  modelStatusText,
  isDarkMode,
  toggleDarkMode,
}: HeaderProps) {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] || {
    title: "TomatoCare AI",
    subtitle: "Precision Agricultural Diagnosis",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden text-foreground hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-muted-foreground">{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Right: Actions & Indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Model Live Pill */}
        <div
          className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            isModelReady
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
          }`}
        >
          {isModelReady ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          )}
          <span>{isModelReady ? "Model Live (224×224)" : "Model Offline"}</span>
        </div>

        {/* Scan Leaf Shortcut */}
        {pathname !== "/detect" && (
          <Link href="/detect">
            <Button size="sm" className="hidden sm:inline-flex items-center gap-1.5 shadow-sm">
              <ScanLine className="h-4 w-4" />
              <span>Scan Leaf</span>
            </Button>
          </Link>
        )}

        {/* Plant Assistant Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 border-botanical-200 hover:bg-botanical-50 text-botanical-800 dark:border-botanical-800 dark:text-botanical-200 dark:hover:bg-botanical-950"
          title="Open Plant Health Assistant"
        >
          <Bot className="h-4 w-4 text-botanical-700 dark:text-botanical-400" />
          <span className="hidden md:inline">Plant Assistant</span>
        </Button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
