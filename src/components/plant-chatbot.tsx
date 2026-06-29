import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Leaf, Send, X, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text:
    "Hello! I'm PlantCare AI 🌱\n\nI can help you with plant diseases, crop health, pests, soil care, farming, and gardening.\n\nHow can I assist you today?",
};

const PLACEHOLDER_REPLY =
  "Thank you for your question. AI response will appear here once backend is connected.";

export function PlantChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
  const saved = localStorage.getItem("plantcare-chat");
  return saved ? JSON.parse(saved) : [WELCOME];
});
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
 useEffect(() => {
  console.log("Saving to localStorage:", messages);
  localStorage.setItem("plantcare-chat", JSON.stringify(messages));
}, [messages]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    
    try {
  const response = await fetch("http://127.0.0.1:5000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: text
  }),
});

const data = await response.json();
console.log(data.response);

  setMessages((m) => [
    ...m,
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: data.response,
    },
  ]);
} catch (error) {
  console.error(error);
  setTyping(false);

  setMessages((m) => [
    ...m,
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "⚠️ Unable to contact PlantCare AI. Please try again.",
    },
  ]);
} finally {
  setTyping(false);
}
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat window */}
      <div
        className={cn(
          "origin-bottom-right transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0",
        )}
      >
        <div
          className={cn(
            "flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden",
            "rounded-2xl border border-border bg-card shadow-[0_20px_50px_-15px_rgba(20,83,45,0.35)]",
          )}
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 bg-[linear-gradient(135deg,oklch(0.55_0.13_150),oklch(0.68_0.14_145))] px-4 py-3 text-white">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur ring-1 ring-white/30">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">PlantCare AI</p>
              <p className="text-[11px] text-white/85 leading-tight">Plant Disease Assistant</p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Online
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full text-white/90 transition hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,oklch(0.98_0.01_150),oklch(0.99_0.005_150))] px-3 py-4"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about plant diseases, pests, soil, or crop care..."
              className="h-10 flex-1 rounded-full bg-muted/60 px-4 text-sm outline-none ring-1 ring-transparent transition focus:bg-background focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(0.55_0.13_150),oklch(0.68_0.14_145))] text-white shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close PlantCare AI" : "Open PlantCare AI"}
        className={cn(
          "group relative grid h-14 w-14 place-items-center rounded-full text-white",
          "bg-[linear-gradient(135deg,oklch(0.55_0.13_150),oklch(0.68_0.14_145))]",
          "shadow-[0_10px_30px_-8px_rgba(20,83,45,0.55)] transition-all duration-300 hover:scale-110 active:scale-95",
        )}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-emerald-400/40 blur-xl opacity-70 group-hover:opacity-100 transition" />
        {!open && (
          <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/40" />
        )}
        <div className="transition-transform duration-300" style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}>
          {open ? <X className="h-6 w-6" /> : <Leaf className="h-6 w-6" />}
        </div>
      </button>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in items-end gap-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
          <Sprout className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-sm bg-[linear-gradient(135deg,oklch(0.55_0.13_150),oklch(0.68_0.14_145))] text-white"
            : "rounded-bl-sm bg-white text-foreground ring-1 ring-border",
        )}
      >
        {message.text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex animate-fade-in items-end gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
        <Sprout className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-border">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70"
      style={{ animationDelay: delay }}
    />
  );
}