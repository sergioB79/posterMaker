"use client";

import { textures } from "@/data/styles";

interface TextureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextureSelector({ value, onChange }: TextureSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Finish / Texture
        <span className="text-neutral-500 font-normal ml-1">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {textures.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              value === t.id
                ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
            }`}
            title={t.description}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
