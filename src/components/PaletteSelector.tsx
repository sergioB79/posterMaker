"use client";

import { useState } from "react";
import { palettes } from "@/data/styles";

interface PaletteSelectorProps {
  value: string;
  customColors: string[];
  onPaletteChange: (id: string) => void;
  onCustomColorsChange: (colors: string[]) => void;
}

export default function PaletteSelector({
  value,
  customColors,
  onPaletteChange,
  onCustomColorsChange,
}: PaletteSelectorProps) {
  const [newColor, setNewColor] = useState("#ffffff");

  const addColor = () => {
    if (customColors.length < 6) {
      onCustomColorsChange([...customColors, newColor]);
    }
  };

  const removeColor = (index: number) => {
    onCustomColorsChange(customColors.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        Color Palette
      </label>
      <div className="flex flex-wrap gap-1.5">
        {palettes.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPaletteChange(p.id)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              value === p.id
                ? "bg-orange-500/15 border border-orange-500/40 text-orange-300"
                : "bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-neutral-600"
            }`}
            title={p.description}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Custom color picker */}
      {value === "custom" && (
        <div className="mt-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50 p-3 space-y-2">
          {customColors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customColors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeColor(i)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:border-red-500/50 transition-colors"
                  title="Click to remove"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-neutral-600"
                    style={{ backgroundColor: c }}
                  />
                  {c}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-7 w-9 rounded border border-neutral-700 bg-neutral-800 p-0.5"
            />
            <span className="text-[11px] text-neutral-500">{newColor}</span>
            <button
              type="button"
              onClick={addColor}
              disabled={customColors.length >= 6}
              className="text-xs text-orange-400 hover:text-orange-300 disabled:text-neutral-600 transition-colors"
            >
              + Add
            </button>
            <span className="text-[10px] text-neutral-600">{customColors.length}/6</span>
          </div>
        </div>
      )}
    </div>
  );
}
