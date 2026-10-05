"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PlantAssistantModal } from "@/components/assistant/PlantAssistantModal";
import { api } from "@/lib/api";
import { ModelStatusResponse } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);

  // Load theme preference
  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Poll model status once at startup
  useEffect(() => {
    api
      .getModelStatus()
      .then((res) => setModelStatus(res))
      .catch((err) => {
        console.warn("Could not connect to model status endpoint:", err);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isModelReady={modelStatus?.is_ready}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Header
          setMobileOpen={setMobileOpen}
          onOpenAssistant={() => setAssistantOpen(true)}
          isModelReady={modelStatus?.is_ready}
          modelStatusText={modelStatus?.message}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* Global Footer */}
        <footer className="no-print border-t border-border bg-card/50 py-6 px-4 sm:px-8 text-center text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              TomatoCare AI — Tomato Leaf Disease Detection and Classification Using EfficientNetB0
            </span>
            <span>PlantVillage Tomato Benchmark Dataset (10 Classes)</span>
          </div>
        </footer>
      </div>

      {/* Plant Assistant Modal */}
      <PlantAssistantModal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
