"use client";

import { useState } from "react";
import { remixes } from "@/data/remixes";

interface RemixSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export default function RemixSelector({ value, onChange }: RemixSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = value ? remixes.find((r) => r.id === value) : null;

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Artistic Remix
        <span className="text-neutral-500 font-normal ml-1">(optional hybrid style)</span>
      </label>

      {/* Selected chip */}
      {selected && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/30 px-2.5 py-1 text-xs text-orange-300">
            {selected.name}
            <button
              type="button"
              onClick={() => onChange("")}
              className="hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-left text-neutral-400 hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
      >
        {selected
          ? `Change remix — click to ${isOpen ? "close" : "browse"}`
          : "Browse artistic remixes..."}
      </button>

      {isOpen && (
        <div className="mt-1 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden shadow-xl">
          {/* None option */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors border-b border-neutral-700 ${
              !value
                ? "bg-orange-500/10 text-orange-300"
                : "text-neutral-400 hover:bg-neutral-700/50"
            }`}
          >
            None (pure era style)
          </button>

          <div className="max-h-64 overflow-y-auto">
            {remixes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onChange(r.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  value === r.id
                    ? "bg-orange-500/10 text-orange-300"
                    : "text-neutral-300 hover:bg-neutral-700/50"
                }`}
              >
                <div className="font-medium">{r.name}</div>
                <div className="text-[11px] text-neutral-500">{r.shortDesc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
