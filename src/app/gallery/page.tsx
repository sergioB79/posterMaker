"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SavedPoster } from "@/lib/types";
import { artists } from "@/data/artists";
import { styles } from "@/data/styles";

export default function GalleryPage() {
  const router = useRouter();
  const [posters, setPosters] = useState<(SavedPoster & { imagePath: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoster, setSelectedPoster] = useState<(SavedPoster & { imagePath: string }) | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [folders, setFolders] = useState<string[]>([]);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPosters(data.posters || []);
        setFolders(data.folders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filterFolder === "all"
      ? posters
      : posters.filter((p) => p.folder === filterFolder);

  const getInfluenceNames = (ids: string[]) =>
    ids
      .map((id) => artists.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const getStyleName = (id: string) =>
    styles.find((s) => s.id === id)?.name || id;

  const buildFormState = (poster: SavedPoster) => ({
    brief: poster.brief || "",
    textFields: poster.textFields || [],
    styleId: poster.styleId || "auto",
    influenceIds: poster.influenceIds || [],
    formatId: poster.formatId || "a4-portrait",
    tones: poster.tones || [],
    colorMode: poster.colorMode || "auto",
    customColors: poster.customColors || [],
  });

  const handleLoadToEditor = (poster: SavedPoster) => {
    try {
      localStorage.setItem(
        "posterMaker:load",
        JSON.stringify({ form: buildFormState(poster) })
      );
    } catch {
      // If storage fails, still navigate
    }
    router.push("/create?load=1");
  };

  const handleShare = async (poster: SavedPoster & { imagePath: string }) => {
    setSharingId(poster.id);
    try {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: poster.imagePath,
          brief: poster.brief || "",
          styleId: poster.styleId || null,
          formatId: poster.formatId || null,
          influenceIds: poster.influenceIds || [],
          tones: poster.tones || [],
        }),
      });
      if (res.ok || res.status === 409) {
        setSharedIds((prev) => new Set(prev).add(poster.id));
      }
    } catch {
      // ignore
    } finally {
      setSharingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white tracking-tight">Poster Maker</span>
            </Link>
            <span className="text-neutral-600">|</span>
            <span className="text-sm text-neutral-400">Gallery</span>
          </div>
          <Link
            href="/"
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            + New Poster
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Folder filter */}
        {folders.length > 0 && (
          <div className="flex gap-1.5 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterFolder("all")}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filterFolder === "all"
                  ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                  : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              All ({posters.length})
            </button>
            {folders.map((f) => {
              const count = posters.filter((p) => p.folder === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterFolder(f)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filterFolder === f
                      ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                      : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  {f} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-neutral-500">Loading gallery...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-500">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-1">No saved posters yet</h3>
            <p className="text-sm text-neutral-500 mb-4">Generate some posters and save them to see them here.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 transition-colors"
            >
              Create a poster
            </Link>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((poster) => (
            <button
              key={poster.id}
              type="button"
              onClick={() => { setSelectedPoster(poster); setShowPrompt(false); }}
              className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all aspect-[3/4]"
            >
              <img
                src={poster.imagePath}
                alt={poster.brief || "Saved poster"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-white/80 line-clamp-2">{poster.brief}</p>
                <p className="text-[10px] text-white/50 mt-0.5">
                  {new Date(poster.createdAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Lightbox modal */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <img
                src={selectedPoster.imagePath}
                alt={selectedPoster.brief}
                className="max-w-full max-h-[80vh] rounded-lg object-contain"
              />
            </div>

            {/* Info panel */}
            <div className="lg:w-80 bg-neutral-900 rounded-xl border border-neutral-800 p-4 overflow-y-auto max-h-[80vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Poster Details</h3>
                <button
                  type="button"
                  onClick={() => setSelectedPoster(null)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Brief</span>
                  <span className="text-neutral-300">{selectedPoster.brief || "—"}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Style</span>
                  <span className="text-neutral-300">{getStyleName(selectedPoster.styleId)}</span>
                </div>
                {selectedPoster.influenceIds.length > 0 && (
                  <div>
                    <span className="text-neutral-500 block mb-0.5">Influences</span>
                    <span className="text-neutral-300">{getInfluenceNames(selectedPoster.influenceIds)}</span>
                  </div>
                )}
                {selectedPoster.tones.length > 0 && (
                  <div>
                    <span className="text-neutral-500 block mb-0.5">Tones</span>
                    <span className="text-neutral-300 capitalize">{selectedPoster.tones.join(", ")}</span>
                  </div>
                )}
                <div>
                  <span className="text-neutral-500 block mb-0.5">Created</span>
                  <span className="text-neutral-300">
                    {new Date(selectedPoster.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Show prompt toggle */}
              <button
                type="button"
                onClick={() => setShowPrompt(!showPrompt)}
                className="w-full mt-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
              >
                {showPrompt ? "Hide Prompt" : "Show Prompt"}
              </button>

              {showPrompt && (
                <div className="mt-2 rounded-lg bg-neutral-950 border border-neutral-700 p-2">
                  <div className="flex justify-end mb-1">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(selectedPoster.prompt)}
                      className="text-[10px] text-orange-400 hover:text-orange-300"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-[10px] text-neutral-500 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
                    {selectedPoster.prompt}
                  </pre>
                </div>
              )}

              {/* Download */}
              <a
                href={selectedPoster.imagePath}
                download={`${selectedPoster.id}.png`}
                className="w-full mt-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                Download PNG
              </a>

              {/* Load into editor */}
              <button
                type="button"
                onClick={() => handleLoadToEditor(selectedPoster)}
                className="w-full mt-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
              >
                Load in editor
              </button>

              {/* Share to showcase */}
              <button
                type="button"
                onClick={() => handleShare(selectedPoster)}
                disabled={sharingId === selectedPoster.id || sharedIds.has(selectedPoster.id)}
                className={`w-full mt-2 rounded-lg text-xs font-medium py-2 transition-colors border flex items-center justify-center gap-1.5 ${
                  sharedIds.has(selectedPoster.id)
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {sharedIds.has(selectedPoster.id) ? "Shared to Showcase" : sharingId === selectedPoster.id ? "Sharing..." : "Share to Showcase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
