"use client";

import { vibes } from "@/data/styles";

interface VibeSelectorProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function VibeSelector({ selected, onChange }: VibeSelectorProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
    } else if (selected.length < 2) {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Vibe
        <span className="text-neutral-500 font-normal ml-1">
          (max 2, {selected.length} chosen)
        </span>
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {vibes.map((v) => {
          const isSelected = selected.includes(v.id);
          const isDisabled = !isSelected && selected.length >= 2;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => toggle(v.id)}
              disabled={isDisabled}
              className={`rounded-lg border px-2.5 py-2 text-xs text-left transition-colors ${
                isSelected
                  ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                  : isDisabled
                  ? "bg-neutral-800/30 border-neutral-700/30 text-neutral-600 cursor-not-allowed"
                  : "bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              <div className="font-medium">{v.name}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{v.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
