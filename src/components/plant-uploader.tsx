import { useCallback, useRef, useState } from "react";
import { UploadCloud, ImageIcon, Loader2, Sparkles, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Phase = "idle" | "ready" | "analyzing" | "result";

interface MockResult {
  disease: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  treatment: string;
}

const SAMPLE_RESULT: MockResult = {
  disease: "Early Blight (Alternaria solani)",
  confidence: 94,
  severity: "Moderate",
  treatment:
    "Remove affected lower leaves and apply a copper-based fungicide every 7–10 days. Improve airflow by spacing plants and water at the soil line to keep foliage dry.",
};

export function PlantUploader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
  const url = URL.createObjectURL(file);
  setPreview(url);
  setSelectedFile(file);
  setPhase("ready");
  setProgress(0);
}, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const analyze = async () => {
  if (!selectedFile) return;

  setPhase("analyzing");

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const img = new Image();

      img.src = reader.result as string;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 128, 128);

        const imageData = ctx.getImageData(0, 0, 128, 128).data;

        const pixels = [];
        for (let i = 0; i < imageData.length; i += 4) {
          pixels.push([
            imageData[i],
            imageData[i + 1],
            imageData[i + 2],
          ]);
        }

        const reshaped = [];
        for (let i = 0; i < 128; i++) {
          reshaped.push(pixels.slice(i * 128, (i + 1) * 128));
        }

        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: reshaped,
          }),
        });

        const data = await response.json();

        setResult(data);
        setProgress(data.confidence * 100);
        setPhase("result");
      };
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsDataURL(selectedFile);
};

  const reset = () => {
    setPreview(null);
    setPhase("idle");
    setProgress(0);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Upload zone */}
      <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Plant Image</h3>
            <p className="text-xs text-muted-foreground">JPG, PNG up to 10 MB</p>
          </div>
          {preview && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        {!preview ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              "flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-medium">Drag & drop a leaf photo here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse from your device</p>
          </label>
        ) : (
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
            <img src={preview} alt="Plant preview" className="h-full w-full object-cover" />
            {phase === "analyzing" && (
              <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm animate-fade-in">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Analyzing plant image…</p>
                  <p className="text-xs text-muted-foreground">CNN inference in progress</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Images are processed securely & never stored.
          </p>
          <Button
            size="lg"
            onClick={analyze}
            disabled={phase !== "ready"}
            className="bg-green-600 text-white shadow-[var(--shadow-elegant)] hover:bg-green-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze Plant Health
          </Button>
        </div>
      </div>

      {/* Result panel */}
      <div className="lg:col-span-2 rounded-2xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Diagnosis</h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-accent text-accent-foreground px-2 py-0.5">
            CNN model
          </span>
        </div>

        {phase !== "result" ? (
          <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No analysis yet</p>
            <p className="text-xs max-w-[24ch] mt-1">
              Upload a leaf image and run analysis to see disease detection results here.
            </p>
          </div>
        ) : (
          <div className="space-y-5 animate-slide-up">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Detected Disease</p>
              <p className="mt-1 text-lg font-semibold leading-tight">{result?.disease}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-warning/15 text-warning-foreground px-2.5 py-0.5 text-xs font-medium">
                Confidence: {Math.round(progress)}%
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Confidence</p>
                <p className="text-sm font-semibold text-primary">{Math.round(progress)}%</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Recommended Treatment</p>
              <div className="rounded-xl border border-border bg-background/60 p-3 text-sm leading-relaxed">
                {result?.treatment}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
