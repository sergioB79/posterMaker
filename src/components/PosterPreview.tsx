"use client";

import { useState, useEffect } from "react";
import type { GeneratedPoster, PosterFormState } from "@/lib/types";

interface PosterPreviewProps {
  posters: GeneratedPoster[];
  isLoading: boolean;
  error?: string;
  formState?: PosterFormState;
}

export default function PosterPreview({
  posters,
  isLoading,
  error,
  formState,
}: PosterPreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [showPrompt, setShowPrompt] = useState(false);
  const selected = posters[selectedIndex];

  // Reset selection when new posters arrive
  useEffect(() => {
    setSelectedIndex(0);
    setSaved({});
    setShowPrompt(false);
  }, [posters]);

  const handleDownload = async (poster: GeneratedPoster) => {
    try {
      if (poster.imageUrl.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = poster.imageUrl;
        a.download = `poster-${poster.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const response = await fetch(poster.imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `poster-${poster.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      window.open(poster.imageUrl, "_blank");
    }
  };

  const [saveError, setSaveError] = useState<string>();

  const handleSave = async (poster: GeneratedPoster) => {
    setSaving((prev) => ({ ...prev, [poster.id]: true }));
    setSaveError(undefined);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: poster.imageUrl,
          prompt: poster.prompt,
          metadata: formState
            ? {
                brief: formState.brief,
                styleId: formState.styleId,
                influenceIds: formState.influenceIds,
                tones: formState.tones,
                formatId: formState.formatId,
              }
            : {},
        }),
      });
      if (res.ok) {
        setSaved((prev) => ({ ...prev, [poster.id]: true }));
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving((prev) => ({ ...prev, [poster.id]: false }));
    }
  };

  const handleSaveAll = async () => {
    for (const poster of posters) {
      if (!saved[poster.id]) {
        await handleSave(poster);
      }
    }
  };

  // Empty state
  if (!isLoading && posters.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-500">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-300 mb-1">Your poster will appear here</h3>
        <p className="text-sm text-neutral-500 max-w-sm">
          Fill in the brief, add your text, pick a style and influences, then hit Generate.
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/20" />
          <div className="absolute inset-0 rounded-2xl border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-neutral-300 mb-1">Generating your poster...</h3>
        <p className="text-sm text-neutral-500">The AI is designing variations based on your brief.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-300 mb-1">Generation failed</h3>
        <p className="text-sm text-neutral-500 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main preview */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        {selected && (
          <img
            src={selected.imageUrl}
            alt={`Generated poster variation ${selectedIndex + 1}`}
            className="max-w-full max-h-[600px] rounded-lg shadow-2xl object-contain"
          />
        )}
      </div>

      {/* Thumbnails */}
      {posters.length > 1 && (
        <div className="flex gap-2 px-4 pb-2 justify-center">
          {posters.map((poster, idx) => (
            <button
              key={poster.id}
              type="button"
              onClick={() => { setSelectedIndex(idx); setShowPrompt(false); }}
              className={`relative rounded-lg overflow-hidden transition-all ${
                idx === selectedIndex
                  ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-neutral-900"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={poster.imageUrl} alt={`Variation ${idx + 1}`} className="w-16 h-20 object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center py-0.5">
                {saved[poster.id] ? "saved" : idx + 1}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Prompt viewer */}
      {showPrompt && selected && (
        <div className="mx-4 mb-2 rounded-lg bg-neutral-950 border border-neutral-700 p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-400">Prompt used</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(selected.prompt);
              }}
              className="text-[10px] text-orange-400 hover:text-orange-300"
            >
              Copy
            </button>
          </div>
          <pre className="text-[11px] text-neutral-500 whitespace-pre-wrap font-mono leading-relaxed">
            {selected.prompt}
          </pre>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <div className="mx-4 mb-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
          Save error: {saveError}
        </div>
      )}

      {/* Actions */}
      {selected && (
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDownload(selected)}
              className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
            <button
              type="button"
              onClick={() => handleSave(selected)}
              disabled={saving[selected.id] || saved[selected.id]}
              className={`rounded-lg text-sm font-medium py-2.5 px-4 transition-colors border flex items-center gap-1.5 ${
                saved[selected.id]
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
              }`}
            >
              {saved[selected.id] ? "Saved" : saving[selected.id] ? "..." : "Save"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPrompt(!showPrompt)}
              className="flex-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
            >
              {showPrompt ? "Hide Prompt" : "Show Prompt"}
            </button>
            {posters.length > 1 && (
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
              >
                Save All ({posters.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => selected && window.open(selected.imageUrl, "_blank")}
              className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 px-3 transition-colors border border-neutral-700"
            >
              Full Size
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
