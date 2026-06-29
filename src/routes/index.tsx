import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { PlantUploader } from "@/components/plant-uploader";
import { Leaf, ShieldCheck, AlertTriangle, Activity, ArrowRight, Droplets, Sun, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlantGuard AI — Smart Farming Dashboard" },
      { name: "description", content: "AI-powered plant disease detection and smart farming insights for modern growers." },
      { property: "og:title", content: "PlantGuard AI — Smart Farming Dashboard" },
      { property: "og:description", content: "AI-powered plant disease detection and smart farming insights for modern growers." },
    ],
  }),
  component: Dashboard,
});

const recent = [
  { plant: "Tomato leaf #2381", status: "Healthy", time: "12 min ago", tone: "success" as const },
  { plant: "Potato leaf #2380", status: "Early Blight", time: "1 hr ago", tone: "warning" as const },
  { plant: "Maize leaf #2379", status: "Healthy", time: "3 hr ago", tone: "success" as const },
  { plant: "Grape leaf #2378", status: "Leaf Spot", time: "Yesterday", tone: "warning" as const },
];

const weather = [
  { label: "Humidity", value: "62%", icon: Droplets },
  { label: "UV Index", value: "6 / High", icon: Sun },
  { label: "Wind", value: "12 km/h", icon: Wind },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[var(--gradient-hero)] p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-[var(--sun)]/30 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium  text-black backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--sun)] animate-pulse-soft" /> AI Online
              </span>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-black">
                PlantGuard AI
              </h1>
              <p className="mt-2 max-w-xl text-sm md:text-base text-gray-900">
                Diagnose plant disease in seconds, get tailored treatment plans, and grow healthier crops with intelligent farming insights.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="lg" variant="secondary" className="text-black">
                  <Link to="/plant-health">
                    Scan a Plant <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-black hover:bg-white/15">
                  <Link to="/insights">View Insights</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {weather.map((w) => (
                <div key={w.label} className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15">
                  <w.icon className="h-5 w-5 text-[var(--sun)]" />
                  <p className="mt-3 text-xs uppercase tracking-wider opacity-80 text-black">{w.label}</p>
                  <p className="text-base font-semibold text-gray-900">{w.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Scans" value="1,284" delta="12.4% this week" icon={Activity} accent="primary" />
          <StatCard label="Healthy Plants" value="942" delta="73% of scans" trend="up" icon={ShieldCheck} accent="leaf" />
          <StatCard label="Diseased Plants" value="342" delta="3.1% vs last week" trend="down" icon={AlertTriangle} accent="sun" />
          <StatCard label="Model Accuracy" value="96.2%" delta="ResNet-50 v3" trend="neutral" icon={Leaf} accent="earth" />
        </section>

        {/* Quick scan */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Quick Plant Analysis</h2>
              <p className="text-sm text-muted-foreground">Upload a leaf photo to detect disease with our CNN model.</p>
            </div>
          </div>
          <PlantUploader />
        </section>

        {/* Recent activity */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/analytics">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((r) => (
              <li key={r.plant} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.plant}</p>
                  <p className="text-xs text-muted-foreground">{r.time}</p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    (r.tone === "success"
                      ? "bg-success/15 text-success"
                      : "bg-warning/20 text-warning-foreground")
                  }
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
