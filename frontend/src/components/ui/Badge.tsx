import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "botanical" | "amber";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground border-border",
    botanical: "border-emerald-300 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800",
    amber: "border-amber-300 bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800",
  };

  return <div className={cn(base, variants[variant], className)} {...props} />;
}
