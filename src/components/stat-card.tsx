import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent?: "primary" | "leaf" | "earth" | "sun";
}

const accentMap = {
  primary: "from-primary/15 to-primary/5 text-primary",
  leaf: "from-[var(--leaf)]/20 to-[var(--leaf)]/5 text-[var(--leaf)]",
  earth: "from-[var(--earth)]/20 to-[var(--earth)]/5 text-[var(--earth)]",
  sun: "from-[var(--sun)]/25 to-[var(--sun)]/5 text-[oklch(0.55_0.13_75)]",
};

export function StatCard({ label, value, delta, trend = "up", icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {delta && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"} {delta}
            </p>
          )}
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
