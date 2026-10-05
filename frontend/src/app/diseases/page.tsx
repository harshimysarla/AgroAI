"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Filter,
  Columns,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Thermometer,
  CloudRain,
  Sprout,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { DiseaseProfile } from "@/types";
import { getCategoryBadgeClass, getSeverityBadgeClass } from "@/lib/utils";

const CATEGORIES = ["All", "Bacterial", "Fungal", "Oomycete / Fungal-like", "Pest", "Viral", "Healthy"];

export default function DiseaseLibraryPage() {
  const [diseases, setDiseases] = useState<DiseaseProfile[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Comparison State
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareItemA, setCompareItemA] = useState<string>("Tomato___Early_blight");
  const [compareItemB, setCompareItemB] = useState<string>("Tomato___Late_blight");

  useEffect(() => {
    api
      .getDiseases()
      .then((data) => setDiseases(data))
      .catch((err) => console.error("Failed to load diseases:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
      d.overview.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      d.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const profileA = diseases.find((d) => d.id === compareItemA);
  const profileB = diseases.find((d) => d.id === compareItemB);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Tomato Disease Encyclopedia
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated botanical pathology reference for the 10 supported tomato leaf conditions.
          </p>
        </div>
        <Button
          onClick={() => setCompareModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2 self-start sm:self-center border-botanical-300 dark:border-botanical-800"
        >
          <Columns className="h-4 w-4 text-botanical-700 dark:text-botanical-400" />
          <span>Compare Lookalikes</span>
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diseases by name, pathogen, or symptom keywords..."
            className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-600 placeholder:text-muted-foreground shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-botanical-700 text-white dark:bg-botanical-600 shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground">
          Loading curated pathology profiles...
        </div>
      ) : filteredDiseases.length === 0 ? (
        <div className="py-16 text-center text-xs text-muted-foreground">
          No matching disease profiles found for &quot;{search}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease) => (
            <Card
              key={disease.id}
              className="flex flex-col justify-between border-border overflow-hidden hover:border-botanical-400 transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                      disease.category
                    )}`}
                  >
                    {disease.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getSeverityBadgeClass(
                      disease.severity
                    )}`}
                  >
                    {disease.severity} Severity
                  </span>
                </div>
                <CardTitle className="text-lg font-bold leading-tight text-foreground">
                  {disease.name}
                </CardTitle>
                <p className="text-xs font-mono text-muted-foreground italic">
                  {disease.scientific_name}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {disease.overview}
                </p>

                <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1.5">
                  <span className="font-semibold text-foreground">Key Visual Symptoms:</span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {disease.symptoms.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="line-clamp-2">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    PlantVillage Class #{diseases.findIndex((d) => d.id === disease.id) + 1}
                  </span>
                  <Link href={`/diseases/${encodeURIComponent(disease.id)}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-botanical-700 hover:text-botanical-800">
                      View Profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 my-8 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-botanical-700 text-white dark:bg-botanical-600">
                  <Columns className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Side-by-Side Disease Comparison</h3>
                  <p className="text-xs text-muted-foreground">
                    Distinguish visual lookalikes and differing environmental vectors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Disease A</label>
                <select
                  value={compareItemA}
                  onChange={(e) => setCompareItemA(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-botanical-600"
                >
                  {diseases.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Disease B</label>
                <select
                  value={compareItemB}
                  onChange={(e) => setCompareItemB(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-botanical-600"
                >
                  {diseases.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Cards */}
            {profileA && profileB && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed divide-y sm:divide-y-0 sm:divide-x divide-border">
                {/* Column A */}
                <div className="space-y-4 sm:pr-4">
                  <div>
                    <h4 className="text-base font-bold text-foreground">{profileA.name}</h4>
                    <p className="font-mono text-muted-foreground italic text-[11px]">
                      {profileA.scientific_name}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{profileA.overview}</p>

                  <div className="space-y-1">
                    <span className="font-bold text-foreground">Symptoms:</span>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {profileA.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-foreground">Environmental Trigger:</span>
                    <p className="text-muted-foreground">
                      {profileA.environmental_conditions.optimal_temp} •{" "}
                      {profileA.environmental_conditions.humidity}
                    </p>
                  </div>
                </div>

                {/* Column B */}
                <div className="space-y-4 pt-4 sm:pt-0 sm:pl-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground">{profileB.name}</h4>
                    <p className="font-mono text-muted-foreground italic text-[11px]">
                      {profileB.scientific_name}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{profileB.overview}</p>

                  <div className="space-y-1">
                    <span className="font-bold text-foreground">Symptoms:</span>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {profileB.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-foreground">Environmental Trigger:</span>
                    <p className="text-muted-foreground">
                      {profileB.environmental_conditions.optimal_temp} •{" "}
                      {profileB.environmental_conditions.humidity}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
