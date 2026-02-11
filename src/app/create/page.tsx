"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BriefInput from "@/components/BriefInput";
import TextFieldsEditor from "@/components/TextFieldsEditor";
import StyleSelector from "@/components/StyleSelector";
import InfluenceSelector from "@/components/InfluenceSelector";
import FormatSelector from "@/components/FormatSelector";
import ToneSelector from "@/components/ToneSelector";
import PosterPreview from "@/components/PosterPreview";
import type { PosterFormState, GeneratedPoster } from "@/lib/types";
import { buildPrompt, type TextField } from "@/lib/prompt-builder";

const initialState: PosterFormState = {
  brief: "",
  textFields: [],
  styleId: "auto",
  influenceIds: [],
  formatId: "a4-portrait",
  tones: [],
  colorMode: "auto",
  customColors: [],
};

type SavedConfig = {
  id: string;
  savedAt: string;
  form: PosterFormState;
  prompt: { system: string; user: string };
};

const SAVED_CONFIGS_KEY = "posterMaker:saved-configs";

function CreateContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<PosterFormState>(initialState);
  const [posters, setPosters] = useState<GeneratedPoster[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [variations, setVariations] = useState(4);
  const [credits, setCredits] = useState<number | null>(null);
  const [purchaseNotice, setPurchaseNotice] = useState<string>();
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [saveNotice, setSaveNotice] = useState<string>("");

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch credits
  useEffect(() => {
    if (session?.user) {
      setCredits(session.user.credits ?? null);
    }
  }, [session]);

  // Purchase success notice
  useEffect(() => {
    const purchased = searchParams.get("purchased");
    if (purchased) {
      setPurchaseNotice(`${purchased} credits added to your account!`);
      fetch("/api/credits")
        .then((r) => r.json())
        .then((d) => setCredits(d.credits))
        .catch(() => {});
      router.replace("/create");
      setTimeout(() => setPurchaseNotice(undefined), 5000);
    }
  }, [searchParams, router]);

  // Load saved configs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_CONFIGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedConfig[];
        if (Array.isArray(parsed)) setSavedConfigs(parsed);
      }
    } catch {
      // ignore
    }

    const shouldLoad = searchParams.get("load") === "1";
    if (!shouldLoad) return;

    try {
      const raw = localStorage.getItem("posterMaker:load");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.form) {
        setForm((prev) => ({ ...prev, ...parsed.form }));
        setPosters([]);
        setError(undefined);
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("posterMaker:load");
    }
  }, [searchParams]);

  const updateForm = useCallback(
    <K extends keyof PosterFormState>(key: K, value: PosterFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const refreshCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      setCredits(data.credits);
    } catch {
      // ignore
    }
  };

  const handleGenerate = async () => {
    if (!form.brief.trim()) {
      setError("Write a brief first — describe what you want.");
      return;
    }

    if (credits !== null && credits < variations) {
      if (credits === 0) {
        setError("No credits remaining. Buy more credits to continue creating.");
        return;
      }
      setError(`You have ${credits} credit${credits !== 1 ? "s" : ""} but requested ${variations} variations. Reduce variations or buy more credits.`);
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setPosters([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variations }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes("Insufficient credits")) {
          setError("Not enough credits. Buy more to continue creating.");
        } else {
          setError(data.error || "Generation failed. Try again.");
        }
        return;
      }

      setPosters(data.posters || []);
      await refreshCredits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = () => {
    if (!form.brief.trim()) {
      setError("Write a brief first — describe what you want.");
      return;
    }

    const prompt = buildPrompt(form);
    const entry: SavedConfig = {
      id: `cfg-${Date.now()}`,
      savedAt: new Date().toISOString(),
      form: { ...form },
      prompt,
    };

    const next = [entry, ...savedConfigs].slice(0, 20);
    setSavedConfigs(next);
    setSelectedConfigId(entry.id);
    setSaveNotice("Saved config");
    try {
      localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    window.setTimeout(() => setSaveNotice(""), 2000);
  };

  const handleLoadConfig = (id: string) => {
    const found = savedConfigs.find((c) => c.id === id);
    if (!found) return;
    setForm(found.form);
    setPosters([]);
    setError(undefined);
  };

  const handleReset = () => {
    setForm(initialState);
    setPosters([]);
    setError(undefined);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h1 className="text-base font-semibold text-white tracking-tight">Poster Maker</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {credits !== null && (
              <Link
                href="/pricing"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  credits > 0
                    ? "bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/15"
                    : "bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/15"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
                {credits} credit{credits !== 1 ? "s" : ""}
              </Link>
            )}
            <Link href="/gallery" className="text-xs text-neutral-400 hover:text-orange-300 transition-colors">Gallery</Link>
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full border border-neutral-700" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-neutral-400">
                  {session.user.name?.[0] || session.user.email?.[0] || "?"}
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Purchase success */}
      {purchaseNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-300 flex items-center justify-between">
            <span>{purchaseNotice}</span>
            <button onClick={() => setPurchaseNotice(undefined)} className="text-green-500 hover:text-green-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* Left column */}
          <div className="space-y-5">
            <BriefInput value={form.brief} onChange={(v) => updateForm("brief", v)} />
            <TextFieldsEditor fields={form.textFields} onChange={(v: TextField[]) => updateForm("textFields", v)} />
            <StyleSelector value={form.styleId} onChange={(v) => updateForm("styleId", v)} />
            <InfluenceSelector selected={form.influenceIds} onChange={(v) => updateForm("influenceIds", v)} />
            <FormatSelector value={form.formatId} onChange={(v) => updateForm("formatId", v)} />
            <ToneSelector selected={form.tones} onChange={(v) => updateForm("tones", v)} />

            {/* Variations */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Variations</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setVariations(n)}
                    className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      variations === n
                        ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                        : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {credits !== null && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Uses {variations} credit{variations !== 1 ? "s" : ""} ({credits} remaining)
                </p>
              )}
            </div>

            {/* Generate */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !form.brief.trim() || (credits !== null && credits < 1)}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    Generating...
                  </span>
                ) : credits !== null && credits < 1 ? (
                  "No Credits — Buy More"
                ) : (
                  `Generate Poster (${variations} credit${variations !== 1 ? "s" : ""})`
                )}
              </button>

              {/* Save / Load config */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="flex-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2.5 transition-colors border border-neutral-700"
                >
                  Save Config
                </button>
                <select
                  value={selectedConfigId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedConfigId(id);
                    handleLoadConfig(id);
                  }}
                  className="flex-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium py-2.5 px-3 border border-neutral-700 focus:outline-none"
                >
                  <option value="">Load saved...</option>
                  {savedConfigs.map((cfg) => (
                    <option key={cfg.id} value={cfg.id}>
                      {cfg.form.brief?.slice(0, 28) || "Untitled"} • {new Date(cfg.savedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              {saveNotice && <div className="text-[11px] text-green-400">{saveNotice}</div>}
            </div>

            {/* Buy more when low */}
            {credits !== null && credits < 5 && (
              <Link
                href="/pricing"
                className="block text-center text-xs text-orange-400 hover:text-orange-300 transition-colors py-1"
              >
                {credits === 0 ? "Buy credits to continue creating" : `Only ${credits} credits left — get more`}
              </Link>
            )}

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition-colors py-2"
            >
              Reset all fields
            </button>
          </div>

          {/* Right column */}
          <div className="lg:sticky lg:top-20 lg:self-start rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden min-h-[500px]">
            <PosterPreview posters={posters} isLoading={isLoading} error={error} formState={form} />
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-neutral-600">
          <span>Poster Maker</span>
          <span>AI-powered poster design tool</span>
        </div>
      </footer>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CreateContent />
    </Suspense>
  );
}
