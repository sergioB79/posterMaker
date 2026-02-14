"use client";

import { compositions } from "@/data/styles";

interface CompositionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CompositionSelector({ value, onChange }: CompositionSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Composition
        <span className="text-neutral-500 font-normal ml-1">(optional)</span>
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {compositions.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`rounded-lg border px-2.5 py-2 text-xs text-left transition-colors ${
              value === c.id
                ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                : "bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">{c.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
