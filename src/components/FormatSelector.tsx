"use client";

import { formats } from "@/data/styles";

interface FormatSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FormatSelector({
  value,
  onChange,
}: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Format
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {formats.map((f) => (
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
}
