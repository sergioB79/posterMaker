"use client";

import { styles } from "@/data/styles";

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Style Direction
        <span className="text-neutral-500 font-normal ml-1">(optional)</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
      >
        {styles.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {value !== "auto" && (
        <p className="mt-1 text-xs text-neutral-500">
          {styles.find((s) => s.id === value)?.description}
        </p>
      )}
    </div>
  );
}
