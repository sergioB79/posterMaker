"use client";

import { designTones } from "@/data/styles";

interface ToneSelectorProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function ToneSelector({ selected, onChange }: ToneSelectorProps) {
  const toggle = (tone: string) => {
    if (selected.includes(tone)) {
      onChange(selected.filter((t) => t !== tone));
    } else {
      onChange([...selected, tone]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Tone
        <span className="text-neutral-500 font-normal ml-1">
          (multi-select, {selected.length} chosen)
        </span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {designTones.map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => toggle(tone)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              selected.includes(tone)
                ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
}
