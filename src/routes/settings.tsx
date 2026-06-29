import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PlantGuard AI" },
      { name: "description", content: "Manage your profile, model preferences and notification settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and AI preferences.</p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] space-y-5">
          <div>
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="text-xs text-muted-foreground">This information is shown on reports and exports.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue="Avery Kessler" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="farm">Farm name</Label>
              <Input id="farm" defaultValue="Greenfield Acres" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="avery@greenfield.farm" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] space-y-5">
          <div>
            <h2 className="text-base font-semibold">AI & Model</h2>
            <p className="text-xs text-muted-foreground">Connection points for the upcoming CNN and RAG integrations.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="api">Model API endpoint</Label>
            <Input id="api" placeholder="https://api.your-model.ai/v1/predict" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weather">Weather API key</Label>
            <Input id="weather" type="password" placeholder="••••••••••••" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Use high-accuracy mode</p>
              <p className="text-xs text-muted-foreground">Runs the larger ResNet-50 variant — slower but more accurate.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Save scans to history</p>
              <p className="text-xs text-muted-foreground">Stores anonymized scans for analytics.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
          <div>
            <h2 className="text-base font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">Stay informed about disease outbreaks and weather changes.</p>
          </div>
          {[
            { title: "Daily farming digest", desc: "Morning summary at 7 AM local time." },
            { title: "Disease alerts", desc: "Notify when high-severity disease is detected." },
            { title: "Weather warnings", desc: "Storm, frost or heat warnings for your region." },
          ].map((n) => (
            <div key={n.title} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </section>

        <div className="flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button className="bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95">
            Save changes
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
