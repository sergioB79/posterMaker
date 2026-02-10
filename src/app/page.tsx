"use client";

import { useState, useCallback } from "react";
import BriefInput from "@/components/BriefInput";
import TextFieldsEditor from "@/components/TextFieldsEditor";
import StyleSelector from "@/components/StyleSelector";
import InfluenceSelector from "@/components/InfluenceSelector";
import FormatSelector from "@/components/FormatSelector";
import ToneSelector from "@/components/ToneSelector";
import PosterPreview from "@/components/PosterPreview";
import type { PosterFormState } from "@/lib/types";
import type { TextField } from "@/lib/prompt-builder";

const initialState: PosterFormState = {
  brief: "",
  textFields: [],
  styleId: "auto",
  influenceIds: [],
  formatId: "a4-portrait",
  tone: "",
  colorMode: "auto",
  customColors: [],
};

export default function Home() {
  const [form, setForm] = useState<PosterFormState>(initialState);
  const [posters, setPosters] = useState<GeneratedPoster[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [variations, setVariations] = useState(4);

  const updateForm = useCallback(
    <K extends keyof PosterFormState>(key: K, value: PosterFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleGenerate = async () => {
    if (!form.brief.trim()) {
      setError("Write a brief first — describe what you want.");
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setPosters([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed. Try again.");
        return;
      }

      setPosters(data.posters || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setPosters([]);
    setError(undefined);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Poster Maker
            </h1>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Reset all
          </button>
        </div>
      </header>

      {/* Main content — two columns */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
          {/* Left column — Inputs */}
          <div className="space-y-5">
            <BriefInput
              value={form.brief}
              onChange={(v) => updateForm("brief", v)}
            />

            <TextFieldsEditor
              fields={form.textFields}
              onChange={(v: TextField[]) => updateForm("textFields", v)}
            />

            <StyleSelector
              value={form.styleId}
              onChange={(v) => updateForm("styleId", v)}
            />

            <InfluenceSelector
              selected={form.influenceIds}
              onChange={(v) => updateForm("influenceIds", v)}
            />

            <FormatSelector
              value={form.formatId}
              onChange={(v) => updateForm("formatId", v)}
            />

            <ToneSelector
              value={form.tone}
              onChange={(v) => updateForm("tone", v)}
            />

            {/* Variations count */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Variations
              </label>
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
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !form.brief.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Poster"
              )}
            </button>
          </div>

          {/* Right column — Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden min-h-[500px]">
            <PosterPreview
              posters={posters}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-neutral-600">
          <span>Poster Maker</span>
          <span>AI-powered poster design tool</span>
        </div>
      </footer>
    </div>
  );
}
