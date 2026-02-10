"use client";

import { useState } from "react";
import { artists, categoryLabels, type ArtistInfluence } from "@/data/artists";

interface InfluenceSelectorProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function InfluenceSelector({
  selected,
  onChange,
}: InfluenceSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = search
    ? artists.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.shortDesc.toLowerCase().includes(search.toLowerCase())
      )
    : artists;

  const grouped = (["designer", "movement", "look"] as const).map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: filtered.filter((a) => a.category === cat),
  }));

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };

  const selectedArtists = selected
    .map((id) => artists.find((a) => a.id === id))
    .filter(Boolean) as ArtistInfluence[];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Artistic Influences
        <span className="text-neutral-500 font-normal ml-1">
          ({selected.length}/5)
        </span>
      </label>

      {/* Selected chips */}
      {selectedArtists.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedArtists.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/30 px-2.5 py-1 text-xs text-orange-300 hover:bg-orange-500/30 transition-colors"
            >
              {a.name}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-left text-neutral-400 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
      >
        {selected.length === 0
          ? "Search and select influences..."
          : `${selected.length} selected — click to ${isOpen ? "close" : "add more"}`}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="mt-1 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden shadow-xl">
          <div className="p-2 border-b border-neutral-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artists, movements..."
              autoFocus
              className="w-full rounded bg-neutral-900 border border-neutral-700 px-2.5 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {grouped.map(
              (group) =>
                group.items.length > 0 && (
                  <div key={group.category}>
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-500 bg-neutral-900/50 sticky top-0">
                      {group.label}
                    </div>
                    {group.items.map((a) => {
                      const isSelected = selected.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggle(a.id)}
                          disabled={!isSelected && selected.length >= 5}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-orange-500/10 text-orange-300"
                              : "text-neutral-300 hover:bg-neutral-700/50"
                          } ${
                            !isSelected && selected.length >= 5
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div>
                            <div className="font-medium">{a.name}</div>
                            <div className="text-[11px] text-neutral-500">
                              {a.shortDesc}
                            </div>
                          </div>
                          {isSelected && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )
            )}
            {filtered.length === 0 && (
              <div className="p-4 text-sm text-neutral-500 text-center">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
