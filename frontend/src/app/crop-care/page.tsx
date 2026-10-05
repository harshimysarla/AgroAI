"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  Droplets,
  Wind,
  Scissors,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ScanLine,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SCOUTING_CHECKLIST = [
  { id: "c1", text: "Inspect bottom 12-18 inches of foliage for early blight target spots or chlorosis." },
  { id: "c2", text: "Turn leaves over to examine undersides for downy white sporulation or olive mold." },
  { id: "c3", text: "Inspect growing tips and new terminal leaves for TYLCV spoon-shaped upward cupping." },
  { id: "c4", text: "Check stems and petiole junctions for dark water-soaked greasy cankers." },
  { id: "c5", text: "Tap suspect foliage over white paper to detect microscopic two-spotted spider mites." },
  { id: "c6", text: "Inspect developing green fruit for bacterial scabs or target spot crater lesions." },
];

export default function CropCareCenterPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Tomato Crop Care & Prevention Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Standard agronomic best management practices, canopy hygiene, and scouting protocols.
          </p>
        </div>
        <Link href="/detect">
          <Button size="lg" className="self-start sm:self-center shadow-sm">
            <ScanLine className="mr-2 h-5 w-5" />
            Analyze Symptomatic Leaf
          </Button>
        </Link>
      </div>

      {/* Core Agronomic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 mb-2">
              <Droplets className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">Precision Irrigation</CardTitle>
            <CardDescription className="text-xs">
              Preventing fungal and bacterial water-splashes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              • <strong>Drip Irrigation Only:</strong> Apply water directly to the root zone at the soil
              surface. Avoid overhead sprinklers which keep leaves wet for hours.
            </p>
            <p>
              • <strong>Morning Watering:</strong> Water early in the day so accidental surface splashes
              dry rapidly under morning sun.
            </p>
            <p>
              • <strong>Clean Mulching:</strong> Lay 2-3 inches of straw, bark, or plastic mulch to stop
              soil-dwelling spores from splashing onto bottom leaves.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-botanical-100 dark:bg-botanical-950 text-botanical-800 dark:text-botanical-300 mb-2">
              <Wind className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">Canopy Aeration & Spacing</CardTitle>
            <CardDescription className="text-xs">
              Reducing relative humidity microclimates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              • <strong>24-36 Inch Plant Spacing:</strong> Maintain generous row intervals to allow
              cross-ventilation throughout the canopy.
            </p>
            <p>
              • <strong>Lower Foliage Pruning:</strong> Prune off the lowest 12 to 18 inches of leaves
              once vines are established to increase ground clearance.
            </p>
            <p>
              • <strong>Greenhouse Airflow:</strong> Operate horizontal airflow fans and roof ridge vents
              to keep relative humidity below 80%.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
              <Scissors className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">Crop Sanitation & Hygiene</CardTitle>
            <CardDescription className="text-xs">
              Halting mechanical viral and bacterial vectors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              • <strong>Tool Disinfection:</strong> Sanitize pruning shears between rows using 70%
              isopropyl alcohol or 10% trisodium phosphate.
            </p>
            <p>
              • <strong>No Tobacco Handling:</strong> Prohibit smoking or handling dry tobacco before
              working on vines to prevent Tomato Mosaic Virus (ToMV).
            </p>
            <p>
              • <strong>Safe Debris Disposal:</strong> Bag and discard diseased vines away from the field.
              Never compost Late Blight-infected tissue.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Interactive Field Scouting Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                    <span>Weekly Field Scouting Checklist</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Systematic inspection workflow to catch emerging outbreaks early
                  </CardDescription>
                </div>
                <span className="text-xs font-bold text-botanical-700 dark:text-botanical-400 bg-botanical-50 dark:bg-botanical-950 px-2.5 py-1 rounded-full border border-botanical-200 dark:border-botanical-800">
                  {completedCount}/{SCOUTING_CHECKLIST.length} Completed
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {SCOUTING_CHECKLIST.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                      isChecked
                        ? "border-botanical-400 bg-botanical-50/60 dark:bg-botanical-950/30"
                        : "border-border bg-muted/30 hover:bg-muted/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-border text-botanical-700 focus:ring-botanical-600 mt-0.5 cursor-pointer"
                    />
                    <span
                      className={`text-xs leading-relaxed ${
                        isChecked ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Cols: When to Consult Agricultural Extension */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-botanical-700 dark:text-botanical-400" />
                <span>When to Consult Local Experts</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Protocol for seeking county or university extension assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-semibold text-foreground">1. Rapid Late Blight Spread:</span>
                <p>
                  If large water-soaked lesions spread to more than 10% of field plants within 48 hours,
                  notify your regional extension office for active spore alerts.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-semibold text-foreground">2. Suspected Viral Incursion:</span>
                <p>
                  For widespread terminal stunting or mosaic mottling, send tissue samples to a certified
                  plant diagnostic clinic for ELISA or PCR testing.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
                <span className="font-semibold text-foreground">3. Pesticide & Spray Calibration:</span>
                <p>
                  Always consult local registered product schedules before applying chemical fungicides
                  or miticides. Laws and resistance patterns vary by region.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Educational Disclaimer */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30 p-4 space-y-1 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" /> Advisory
              Notice:
            </span>
            <p className="leading-relaxed">
              TomatoCare AI provides educational cultural guidance. It does not prescribe commercial
              pesticide dosages or chemical treatment schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
