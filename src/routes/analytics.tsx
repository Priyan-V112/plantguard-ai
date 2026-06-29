import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Activity, ShieldCheck, AlertTriangle, Target } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — PlantGuard AI" },
      { name: "description", content: "Track scan volume, disease distribution and model accuracy over time." },
    ],
  }),
  component: Analytics,
});

const scansData = [
  { day: "Mon", scans: 142, healthy: 102 },
  { day: "Tue", scans: 168, healthy: 121 },
  { day: "Wed", scans: 190, healthy: 138 },
  { day: "Thu", scans: 174, healthy: 130 },
  { day: "Fri", scans: 221, healthy: 168 },
  { day: "Sat", scans: 198, healthy: 152 },
  { day: "Sun", scans: 191, healthy: 144 },
];

const diseaseData = [
  { name: "Healthy", value: 942, color: "var(--leaf)" },
  { name: "Early Blight", value: 168, color: "var(--sun)" },
  { name: "Leaf Spot", value: 92, color: "var(--earth)" },
  { name: "Rust", value: 54, color: "oklch(0.6 0.18 30)" },
  { name: "Other", value: 28, color: "oklch(0.55 0.05 200)" },
];

const cropData = [
  { crop: "Tomato", scans: 412 },
  { crop: "Potato", scans: 318 },
  { crop: "Maize", scans: 224 },
  { crop: "Grape", scans: 176 },
  { crop: "Apple", scans: 154 },
];

function Analytics() {
  return (
    <AppShell title="Analytics">
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">Last 7 days of activity across all monitored plots.</p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Scans" value="1,284" delta="12.4%" icon={Activity} accent="primary" />
          <StatCard label="Healthy" value="942" delta="73% rate" icon={ShieldCheck} accent="leaf" />
          <StatCard label="Diseased" value="342" delta="3.1%" trend="down" icon={AlertTriangle} accent="sun" />
          <StatCard label="Accuracy" value="96.2%" delta="+0.8% v2 → v3" icon={Target} accent="earth" />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold mb-1">Scans over time</h2>
            <p className="text-xs text-muted-foreground mb-4">Total scans vs healthy detections</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scansData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gHealthy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--leaf)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--leaf)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="var(--primary)" strokeWidth={2} fill="url(#gScans)" />
                  <Area type="monotone" dataKey="healthy" stroke="var(--leaf)" strokeWidth={2} fill="url(#gHealthy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold mb-1">Disease distribution</h2>
            <p className="text-xs text-muted-foreground mb-4">Across all scans</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={diseaseData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {diseaseData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="var(--card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5">
              {diseaseData.map((d) => (
                <li key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium">{d.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-base font-semibold mb-1">Top crops scanned</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribution by crop category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="crop" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="scans" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
