"use client";

import { useState, useEffect, useCallback } from "react";
import type { GeneratedPoster, PosterFormState } from "@/lib/types";

const waitingJokes = [
  "I'm on a whiskey diet; I've lost three days already.",
  "My bed is a magical place where I suddenly remember everything I forgot to do.",
  "I have a lot of jokes about unemployed people, but it doesn't matter none of them work.",
  "I'm not lazy, I'm just on energy-saving mode.",
  "My vacuum cleaner sucks, which is actually the only thing it's good at.",
  "I used to think I was indecisive, but now I'm not so sure.",
  "Common sense is like deodorant\u2014the people who need it most never use it.",
  "My bank account is basically a \"404 Error\" at this point.",
  "I finally got my eight hours of sleep; it took me three days, but I did it.",
  "I don't need a hair stylist; my pillow gives me a new look every morning.",
  "My doctor told me to watch my drinking, so now I do it in front of a mirror.",
  "I don't trip; I do random gravity checks.",
  "I'm not arguing, I'm just explaining why I'm right.",
  "I'm great at multitasking: I can waste time, be unproductive, and procrastinate all at once.",
  "People say \"nothing is impossible,\" but I do nothing every day.",
  "I don't suffer from insanity; I enjoy every minute of it.",
  "Why is \"abbreviated\" such a long word?",
  "I told my wife she was drawing her eyebrows too high; she looked surprised.",
  "The first 40 years of childhood are always the hardest.",
  "I'm reading a book on anti-gravity; it's impossible to put down.",
  "Life is short\u2014smile while you still have teeth.",
  "Being an artist is just a fancy way of saying you have a very expensive hobby and a very cheap diet.",
  "I'm a \"starving artist,\" but mostly because I spent my grocery money on a specific shade of \"Midnight Teal.\"",
  "I don't make mistakes, I just create \"unexpected textures.\"",
  "My sketchbook is 10% actual drawings and 90% \"I'll finish this later\" lies.",
  "I'm not messy; I'm just constantly covered in the evidence of my creativity.",
  "Modern art is basically just a competition to see who can get away with the least amount of effort for the most amount of money.",
  "Abstract art: a product of the untalented, sold by the unprincipled to the utterly bewildered.",
  "I like my art like I like my people: framed and hanging on a wall where they can't talk back.",
  "Sculpture is what you bump into when you back up to look at a painting.",
  "My favorite medium is \"rarely finished.\"",
  "I'm an expert at \"minimalism\"\u2014at least that's what I tell people when I forget to draw the background.",
  "Earth without \"art\" is just \"eh.\"",
  "Color theory is just a sophisticated way of arguing about whether something is \"eggshell\" or \"cream.\"",
  "A true masterpiece is any painting sold for more than the cost of the frame.",
  "I'm currently working on a \"limited edition\" series; I'm limiting it to the one I actually finished.",
  "\"Mixed media\" is just Latin for \"I found a bunch of stuff in the junk drawer and glued it together.\"",
];

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
  const [sharing, setSharing] = useState<Record<string, boolean>>({});
  const [shared, setShared] = useState<Record<string, boolean>>({});
  const [unsharing, setUnsharing] = useState<Record<string, boolean>>({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [joke, setJoke] = useState<string | null>(null);
  const [usedJokes, setUsedJokes] = useState<Set<number>>(new Set());
  const selected = posters[selectedIndex];

  const getRandomJoke = useCallback(() => {
    let available = waitingJokes.map((_, i) => i).filter((i) => !usedJokes.has(i));
    if (available.length === 0) {
      setUsedJokes(new Set());
      available = waitingJokes.map((_, i) => i);
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    setUsedJokes((prev) => new Set(prev).add(idx));
    setJoke(waitingJokes[idx]);
  }, [usedJokes]);

  // Reset selection when new posters arrive
  useEffect(() => {
    setSelectedIndex(0);
    setShared({});
    setShowPrompt(false);
    setJoke(null);
    setUsedJokes(new Set());
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

  const handleShare = async (poster: GeneratedPoster) => {
    setSharing((prev) => ({ ...prev, [poster.id]: true }));
    try {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: poster.imageUrl,
          brief: formState?.brief || "",
          styleId: formState?.styleId || null,
          formatId: formState?.formatId || null,
          influenceIds: [],
          tones: formState?.tones || [],
        }),
      });
      if (res.ok || res.status === 409) {
        setShared((prev) => ({ ...prev, [poster.id]: true }));
      }
    } catch {
      // ignore
    } finally {
      setSharing((prev) => ({ ...prev, [poster.id]: false }));
    }
  };

  const handleUnshare = async (poster: GeneratedPoster) => {
    setUnsharing((prev) => ({ ...prev, [poster.id]: true }));
    try {
      const res = await fetch("/api/showcase", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: poster.imageUrl }),
      });
      if (res.ok) {
        setShared((prev) => {
          const next = { ...prev };
          delete next[poster.id];
          return next;
        });
      }
    } catch {
      // ignore
    } finally {
      setUnsharing((prev) => ({ ...prev, [poster.id]: false }));
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
        <p className="text-sm text-neutral-500 mb-4">This can take a little while. Be patient, great art takes time.</p>

        {joke ? (
          <div className="max-w-sm space-y-3">
            <p className="text-sm text-orange-200 italic">&ldquo;{joke}&rdquo;</p>
            <button
              type="button"
              onClick={getRandomJoke}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Another one?
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={getRandomJoke}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Want to hear a joke while you wait?
          </button>
        )}
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
                {idx + 1}
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

      {/* Actions */}
      {selected && (
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            type="button"
            onClick={() => handleDownload(selected)}
            className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <div className="flex gap-2">
            {shared[selected.id] ? (
              <button
                type="button"
                onClick={() => handleUnshare(selected)}
                disabled={unsharing[selected.id]}
                className="flex-1 rounded-lg text-xs font-medium py-2 transition-colors border flex items-center justify-center gap-1.5 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {unsharing[selected.id] ? "Removing..." : "Remove from Showcase"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleShare(selected)}
                disabled={sharing[selected.id]}
                className="flex-1 rounded-lg text-xs font-medium py-2 transition-colors border flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {sharing[selected.id] ? "Sharing..." : "Share to Showcase"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPrompt(!showPrompt)}
              className="flex-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
            >
              {showPrompt ? "Hide Prompt" : "Show Prompt"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => selected && window.open(selected.imageUrl, "_blank")}
            className="w-full rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium py-2 transition-colors border border-neutral-700"
          >
            Full Size
          </button>
        </div>
      )}
    </div>
  );
}
