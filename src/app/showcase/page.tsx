"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type SharedPoster = {
  id: string;
  imageUrl: string;
  brief: string;
  styleId: string | null;
  formatId: string | null;
  influenceIds: string[];
  tones: string[];
  authorName: string | null;
  createdAt: string;
};

export default function ShowcasePage() {
  const [posters, setPosters] = useState<SharedPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState<SharedPoster | null>(null);

  const fetchPosters = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/showcase?page=${p}&limit=24`);
      const data = await res.json();
      if (data.posters) {
        setPosters(data.posters);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosters(page);
  }, [page, fetchPosters]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <span className="font-semibold text-sm">Poster Maker</span>
            </Link>
            <span className="text-neutral-600 text-sm">/</span>
            <h1 className="text-sm font-medium text-neutral-300">Community Showcase</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{total} poster{total !== 1 ? "s" : ""} shared</span>
            <Link
              href="/create"
              className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create yours
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && posters.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posters.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-neutral-400 text-lg mb-2">No posters shared yet</p>
            <p className="text-neutral-600 text-sm mb-6">Be the first to share your creation!</p>
            <Link
              href="/create"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Create a poster
            </Link>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
              {posters.map((poster) => (
                <div
                  key={poster.id}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setSelectedPoster(poster)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors">
                    <img
                      src={poster.imageUrl}
                      alt={poster.brief}
                      className="w-full block"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs text-white line-clamp-2">{poster.brief}</p>
                        {poster.authorName && (
                          <p className="text-xs text-neutral-400 mt-1">by {poster.authorName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row gap-4 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-2/3 bg-black flex items-center justify-center">
              <img
                src={selectedPoster.imageUrl}
                alt={selectedPoster.brief}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
            <div className="md:w-1/3 p-5 flex flex-col gap-3 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white">About this poster</h3>
              <p className="text-sm text-neutral-300">{selectedPoster.brief}</p>

              {selectedPoster.authorName && (
                <div>
                  <span className="text-xs text-neutral-500">Created by</span>
                  <p className="text-sm text-neutral-300">{selectedPoster.authorName}</p>
                </div>
              )}

              {selectedPoster.tones.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-500">Tone</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPoster.tones.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPoster.styleId && (
                <div>
                  <span className="text-xs text-neutral-500">Style</span>
                  <p className="text-sm text-neutral-300">{selectedPoster.styleId}</p>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-600">
                  {new Date(selectedPoster.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <button
                onClick={() => setSelectedPoster(null)}
                className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm text-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
