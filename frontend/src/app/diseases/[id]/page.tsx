"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ScanLine,
  AlertTriangle,
  Thermometer,
  CloudRain,
  Wind,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Sprout,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { DiseaseProfile } from "@/types";
import { getCategoryBadgeClass, getSeverityBadgeClass } from "@/lib/utils";

export default function DiseaseDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [profile, setProfile] = useState<DiseaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getDiseaseById(id)
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message || "Failed to load disease details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-muted-foreground">
        Loading botanical pathology profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h2 className="text-xl font-bold text-foreground">Disease Profile Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || "Requested profile is unavailable."}</p>
        <Link href="/diseases">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Encyclopedia
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back Link */}
      <div>
        <Link
          href="/diseases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Disease Encyclopedia
        </Link>
      </div>

      {/* Header Profile Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                  profile.category
                )}`}
              >
                {profile.category}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getSeverityBadgeClass(
                  profile.severity
                )}`}
              >
                {profile.severity} Severity
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground">{profile.name}</h1>
            <p className="text-sm font-mono text-muted-foreground italic mt-1">
              Pathogen: {profile.scientific_name}
            </p>
          </div>

          <Link href="/detect">
            <Button size="lg" className="shadow-sm">
              <ScanLine className="mr-2 h-5 w-5" />
              Analyze Leaf for This
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Overview, Symptoms, Management */}
        <div className="lg:col-span-8 space-y-6">
          {/* Overview */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Botanical & Agronomic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.overview}</p>
            </CardContent>
          </Card>

          {/* Symptoms List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Diagnostic Symptoms & Visual Markers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {profile.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-botanical-100 dark:bg-botanical-950 text-botanical-800 dark:text-botanical-300 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cultural Prevention & Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>Preventive Cultural Practices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {profile.prevention.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-botanical-700" />
                  <span>Cultural Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {profile.management.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right 4 Cols: Environmental Triggers & Lookalikes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Environmental Vectors */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Contributing Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Thermometer className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Optimal Temperature:</span>
                  <p className="text-muted-foreground mt-0.5">
                    {profile.environmental_conditions.optimal_temp}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CloudRain className="h-4 w-4 shrink-0 text-sky-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Moisture & Humidity:</span>
                  <p className="text-muted-foreground mt-0.5">
                    {profile.environmental_conditions.humidity}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Wind className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Spread Mechanism:</span>
                  <p className="text-muted-foreground mt-0.5">
                    {profile.environmental_conditions.spread_mechanism}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lookalikes / Differential Diagnosis */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-600" />
                <span>Differential Lookalikes</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Distinguishing visual markers from similar pathologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                {profile.lookalike_diseases.map((l, idx) => (
                  <li key={idx} className="rounded-xl border border-border bg-muted/40 p-3">
                    {l}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Crop Danger Assessment */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/30 p-4 space-y-1 text-xs text-rose-950 dark:text-rose-200">
            <span className="font-bold flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4 text-rose-600" /> Potential Economic Impact:
            </span>
            <p className="leading-relaxed">{profile.danger_to_crop}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
