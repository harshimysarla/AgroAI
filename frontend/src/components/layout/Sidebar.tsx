"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  BookOpen,
  Sprout,
  BookHeart,
  BarChart3,
  Cpu,
  FileCode2,
  Info,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  isModelReady?: boolean;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Leaf Detection", href: "/detect", icon: ScanLine, highlight: true },
  { label: "Disease Library", href: "/diseases", icon: BookOpen },
  { label: "Crop Care", href: "/crop-care", icon: Sprout },
  { label: "Health Journal", href: "/journal", icon: BookHeart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Model Performance", href: "/model-performance", icon: Cpu },
  { label: "Methodology", href: "/methodology", icon: FileCode2 },
  { label: "About Project", href: "/about", icon: Info },
  { label: "Settings & Status", href: "/settings", icon: Settings },
];

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  isModelReady = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out lg:static",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-botanical-700 text-white shadow-md shadow-botanical-800/20 dark:bg-botanical-600">
              <Leaf className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground">
                  Tomato<span className="text-botanical-700 dark:text-botanical-400">Care AI</span>
                </span>
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  EfficientNetB0
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted lg:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-botanical-700 text-white shadow-sm dark:bg-botanical-600"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.highlight && !isActive && "text-botanical-700 dark:text-botanical-400 font-semibold"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground",
                    item.highlight && !isActive && "text-botanical-700 dark:text-botanical-400"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Model Live Indicator Footer */}
        {!collapsed ? (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 rounded-xl bg-botanical-50/70 p-2.5 dark:bg-botanical-950/40 border border-botanical-200 dark:border-botanical-900">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  isModelReady ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                )}
              />
              <div className="flex flex-col text-xs">
                <span className="font-medium text-foreground">
                  {isModelReady ? "EfficientNetB0 Active" : "Model Standby"}
                </span>
                <span className="text-[10px] text-muted-foreground">10 Tomato Classes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-border flex justify-center">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                isModelReady ? "bg-emerald-500" : "bg-amber-500"
              )}
              title={isModelReady ? "Model Loaded & Ready" : "Model Offline"}
            />
          </div>
        )}
      </aside>
    </>
  );
}
