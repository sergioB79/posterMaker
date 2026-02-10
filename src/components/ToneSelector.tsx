"use client";

import { designTones } from "@/data/styles";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Tone
        <span className="text-neutral-500 font-normal ml-1">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            value === ""
              ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
              : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
          }`}
        >
          Auto
        </button>
        {designTones.map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => onChange(tone)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              value === tone
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
