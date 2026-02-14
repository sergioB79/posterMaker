"use client";

import { formats, formatCategories, type FormatPreset } from "@/data/styles";

interface FormatSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const categories: FormatPreset["category"][] = ["print", "social", "digital"];

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Format
      </label>
      <div className="space-y-2">
        {categories.map((cat) => {
          const items = formats.filter((f) => f.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                {formatCategories[cat]}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {items.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange(f.id)}
                    className={`rounded-lg border px-2.5 py-2 text-xs text-left transition-colors ${
                      value === f.id
                        ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                        : "bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600"
                    }`}
                  >
                    <div className="font-medium">{f.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      {f.width}×{f.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
