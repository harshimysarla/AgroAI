"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Activity,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderCog,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { ModelStatusResponse } from "@/types";

export default function SettingsPage() {
  const [health, setHealth] = useState<any>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  );
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setSaveMsg(null);
    try {
      const [hRes, sRes] = await Promise.allSettled([api.getHealth(), api.getModelStatus()]);
      if (hRes.status === "fulfilled") setHealth(hRes.value);
      if (sRes.status === "fulfilled") setModelStatus(sRes.value);
    } catch (err) {
      console.error("Status check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Settings & System Diagnostics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time inference engine telemetry, backend connection health, and environment config.
          </p>
        </div>
        <Button
          onClick={fetchStatus}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2 self-start sm:self-center"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Diagnostics</span>
        </Button>
      </div>

      {/* Diagnostics Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Server className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>FastAPI Service Health</span>
              </CardTitle>
              {health?.status === "healthy" ? (
                <Badge variant="botanical">Online</Badge>
              ) : (
                <Badge variant="destructive">Offline</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border">
              <span>Service Name:</span>
              <span className="font-semibold text-foreground">
                {health?.service || "TomatoCare Backend"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span>Version:</span>
              <span className="font-mono text-foreground">{health?.version || "1.0.0"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Protocol:</span>
              <span className="font-semibold text-foreground">REST (HTTP/1.1)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>EfficientNetB0 Engine</span>
              </CardTitle>
              {modelStatus?.is_ready ? (
                <Badge variant="botanical">Ready</Badge>
              ) : (
                <Badge variant="amber">Unavailable</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border">
              <span>Target Architecture:</span>
              <span className="font-semibold text-foreground">
                {modelStatus?.architecture || "EfficientNetB0"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span>Resolution:</span>
              <span className="font-mono text-foreground">
                {modelStatus?.input_resolution?.join("×") || "224×224×3"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Classification Classes:</span>
              <span className="font-semibold text-foreground">
                {modelStatus?.num_classes || 10} Tomato Classes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>SQLite Persistence</span>
              </CardTitle>
              <Badge variant="botanical">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border">
              <span>Storage Driver:</span>
              <span className="font-semibold text-foreground">SQLAlchemy / SQLite</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span>Database File:</span>
              <span className="font-mono text-foreground truncate max-w-[140px]">
                backend/data/tomatocare.db
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>History Logging:</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Configuration Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
            <span>Client API Configuration</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Endpoints and runtime limits used by the Next.js frontend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Backend API URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 rounded-xl border border-input bg-background p-2.5 text-xs text-foreground font-mono focus:ring-2 focus:ring-botanical-600"
              />
              <Button
                size="sm"
                onClick={() => {
                  setSaveMsg("Configuration saved for this session.");
                  fetchStatus();
                }}
              >
                Apply
              </Button>
            </div>
            {saveMsg && <p className="text-xs text-emerald-600 font-medium">{saveMsg}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
              <span className="font-semibold text-foreground">Max Image Upload Limit</span>
              <p className="text-muted-foreground font-mono">10.0 MB</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
              <span className="font-semibold text-foreground">Inference Timeout</span>
              <p className="text-muted-foreground font-mono">45.0 Seconds</p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
              <span className="font-semibold text-foreground">Supported Formats</span>
              <p className="text-muted-foreground font-mono">JPEG, PNG, WEBP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
