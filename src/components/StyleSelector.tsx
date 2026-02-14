"use client";

import { useState } from "react";
import { styles } from "@/data/styles";

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = styles.find((s) => s.id === value);

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Design Era / Movement
        <span className="text-neutral-500 font-normal ml-1">(optional)</span>
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-left hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={value === "auto" ? "text-neutral-400" : "text-white"}>
              {selected?.name || "Auto (AI decides)"}
            </span>
            {selected && value !== "auto" && (
              <p className="text-[11px] text-neutral-500 mt-0.5">{selected.description}</p>
            )}
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="mt-1 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden shadow-xl max-h-72 overflow-y-auto">
          {styles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === s.id
                  ? "bg-orange-500/10 text-orange-300"
                  : "text-neutral-300 hover:bg-neutral-700/50"
              }`}
            >
              <div className="font-medium">{s.name}</div>
              {s.id !== "auto" && (
                <div className="text-[11px] text-neutral-500">{s.description}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
