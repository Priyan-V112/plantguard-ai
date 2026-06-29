import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Cloud, Droplets, Sprout, Sun, ThermometerSun, Wind, Wheat, TreePine } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Farming Insights — PlantGuard AI" },
      { name: "description", content: "Weather-aware farming suggestions, crop recommendations, and soil insights." },
    ],
  }),
  component: Insights,
});

const weather = [
  { label: "Temperature", value: "28°C", sub: "Feels like 31°", icon: ThermometerSun },
  { label: "Humidity", value: "62%", sub: "Comfortable", icon: Droplets },
  { label: "Wind", value: "12 km/h", sub: "NE breeze", icon: Wind },
  { label: "UV Index", value: "6", sub: "High — protect young plants", icon: Sun },
];

const suggestions = [
  { title: "Water early", body: "Irrigate before 8 AM to reduce evaporation loss by ~30%.", icon: Droplets },
  { title: "Apply mulch", body: "Add straw mulch around tomatoes; soil temps trending high this week.", icon: Sprout },
  { title: "Skip spraying", body: "Wind gusts forecast tomorrow — postpone foliar sprays to Thursday.", icon: Wind },
];

const crops = [
  { name: "Tomato (Roma)", fit: 94, note: "Ideal soil pH and current rainfall window." },
  { name: "Sweet Corn", fit: 88, note: "Strong nitrogen profile in selected plot." },
  { name: "Capsicum", fit: 81, note: "Watch for aphids — monitor weekly." },
  { name: "Spinach", fit: 76, note: "Better suited to cooler microclimate zones." },
];

const soil = [
  { label: "pH", value: "6.4", tone: "success" },
  { label: "Nitrogen (N)", value: "Medium", tone: "warning" },
  { label: "Phosphorus (P)", value: "High", tone: "success" },
  { label: "Potassium (K)", value: "Low", tone: "destructive" },
  { label: "Moisture", value: "38%", tone: "warning" },
  { label: "Organic Matter", value: "3.2%", tone: "success" },
];

const toneClass: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  destructive: "bg-destructive/15 text-destructive",
};

function Insights() {
  return (
    <AppShell title="Farming Insights">
      <div className="space-y-6">
        <header className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Today's outlook</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Smart Farming Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Live weather, crop recommendations and soil intelligence — designed to plug into your local weather and agri APIs.
          </p>
        </header>

        {/* Weather */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weather.map((w) => (
            <div key={w.label} className="rounded-2xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{w.label}</p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <w.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold">{w.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{w.sub}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Suggestions */}
          <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Weather-based suggestions</h2>
            </div>
            <ul className="space-y-3">
              {suggestions.map((s) => (
                <li key={s.title} className="flex gap-3 rounded-xl border border-border bg-background/60 p-4 transition-all hover:border-primary/40">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Soil */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 mb-4">
              <TreePine className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Soil health</h2>
            </div>
            <ul className="space-y-2.5">
              {soil.map((s) => (
                <li key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + toneClass[s.tone]}>
                    {s.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Crop recommendations */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 mb-4">
            <Wheat className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Crop recommendations</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {crops.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-[var(--gradient-card)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm truncate">{c.name}</p>
                  <span className="shrink-0 text-xs font-semibold text-primary">{c.fit}% fit</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[var(--gradient-hero)] transition-all"
                    style={{ width: `${c.fit}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
