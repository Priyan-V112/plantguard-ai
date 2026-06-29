import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlantUploader } from "@/components/plant-uploader";
import { Sparkles, Cpu, Database } from "lucide-react";

export const Route = createFileRoute("/plant-health")({
  head: () => ({
    meta: [
      { title: "Plant Health Analysis — PlantGuard AI" },
      { name: "description", content: "Upload a leaf photo and detect plant disease using AI-powered image analysis." },
    ],
  }),
  component: PlantHealth,
});

const features = [
  { icon: Cpu, title: "CNN-powered", desc: "Trained on 80k+ labeled leaves across 38 disease classes." },
  { icon: Sparkles, title: "Treatment ready", desc: "Actionable recommendations tailored to severity & crop." },
  { icon: Database, title: "RAG assistant", desc: "Grounded answers from agronomy literature (coming soon)." },
];

function PlantHealth() {
  return (
    <AppShell title="Plant Health Analysis">
      <div className="space-y-6">
        <header className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Diagnostics</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Detect plant disease in seconds</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Upload a clear photo of a single leaf — daylight, neutral background, the whole leaf in frame works best.
          </p>
        </header>

        <PlantUploader />

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
