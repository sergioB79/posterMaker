"use client";

import { useState } from "react";
import type { TextField } from "@/lib/prompt-builder";

interface TextFieldsEditorProps {
  fields: TextField[];
  onChange: (fields: TextField[]) => void;
}

const priorities: TextField["priority"][] = ["H1", "H2", "body", "small"];

const priorityLabels: Record<TextField["priority"], string> = {
  H1: "H1 — Main",
  H2: "H2 — Secondary",
  body: "Body",
  small: "Small",
};

export default function TextFieldsEditor({
  fields,
  onChange,
}: TextFieldsEditorProps) {
  const [bulkRandom, setBulkRandom] = useState(true);
  const [bulkColor, setBulkColor] = useState("#ffffff");
  const addField = () => {
    onChange([
      ...fields,
      {
        id: crypto.randomUUID(),
        label: "",
        content: "",
        priority: "body",
        color: "random",
      },
    ]);
  };

  const updateField = (id: string, updates: Partial<TextField>) => {
    onChange(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const setAllColors = (nextColor: TextField["color"]) => {
    onChange(
      fields.map((f) => ({
        ...f,
        color: nextColor,
      }))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-neutral-300">
          Text Fields
        </label>
        <button
          type="button"
          onClick={addField}
          className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
        >
          + Add field
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, idx) => {
          const colorMode =
            field.color && field.color !== "random" ? "custom" : "random";
          const colorValue =
            field.color && field.color !== "random" ? field.color : "#ffffff";

          return (
            <div
              key={field.id}
              className="rounded-lg bg-neutral-800/50 border border-neutral-700/50 p-3 space-y-2"
            >
              {/* Row 1: label + priority + remove */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(field.id, { label: e.target.value })
                }
                placeholder={`Label (e.g. ${
                  idx === 0
                    ? "Title"
                    : idx === 1
                    ? "Date"
                    : idx === 2
                    ? "Venue"
                    : "Info"
                })`}
                className="flex-1 rounded bg-neutral-800 border border-neutral-700 px-2.5 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
              />
                <select
                  value={field.priority}
                  onChange={(e) =>
                    updateField(field.id, {
                      priority: e.target.value as TextField["priority"],
                    })
                  }
                  className="rounded bg-neutral-800 border border-neutral-700 px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {priorityLabels[p]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                  title="Remove field"
                >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Row 2: content */}
            <input
              type="text"
              value={field.content}
              onChange={(e) =>
                updateField(field.id, { content: e.target.value })
              }
              placeholder="Text content..."
              className="w-full rounded bg-neutral-800 border border-neutral-700 px-2.5 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            />
            {/* Row 3: color */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
                <input
                  type="checkbox"
                  checked={colorMode === "random"}
                  onChange={(e) =>
                    updateField(field.id, {
                      color: e.target.checked ? "random" : colorValue,
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-neutral-600 bg-neutral-800"
                />
                Random color
              </label>
              <input
                type="color"
                value={colorValue}
                onChange={(e) =>
                  updateField(field.id, { color: e.target.value })
                }
                disabled={colorMode === "random"}
                className="h-7 w-9 rounded border border-neutral-700 bg-neutral-800 p-0.5 disabled:opacity-50"
                title="Pick color"
              />
              <span className="text-[11px] text-neutral-500">
                {colorMode === "random" ? "Random" : colorValue}
              </span>
            </div>
            </div>
          );
        })}

        {fields.length > 0 && (
          <div className="rounded-lg bg-neutral-900/60 border border-neutral-800 px-3 py-2 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="text-neutral-300">Override all colors:</span>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bulkRandom}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setBulkRandom(next);
                    setAllColors(next ? "random" : bulkColor);
                  }}
                  className="h-3.5 w-3.5 rounded border-neutral-600 bg-neutral-800"
                />
                Random
              </label>
              <input
                type="color"
                value={bulkColor}
                onChange={(e) => {
                  const next = e.target.value;
                  setBulkColor(next);
                  setBulkRandom(false);
                  setAllColors(next);
                }}
                className="h-6 w-8 rounded border border-neutral-700 bg-neutral-800 p-0.5"
                title="Pick one color for all"
              />
              <span className="text-[11px] text-neutral-500">
                {bulkRandom ? "Random" : bulkColor}
              </span>
            </div>
          </div>
        )}

        {fields.length === 0 && (
          <button
            type="button"
            onClick={() => {
              // Add default fields
              onChange([
                {
                  id: crypto.randomUUID(),
                  label: "Title",
                  content: "",
                  priority: "H1",
                  color: "random",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Subtitle",
                  content: "",
                  priority: "H2",
                  color: "random",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Date & Location",
                  content: "",
                  priority: "body",
                  color: "random",
                },
                {
                  id: crypto.randomUUID(),
                  label: "Additional Info",
                  content: "",
                  priority: "small",
                  color: "random",
                },
              ]);
            }}
            className="w-full rounded-lg border border-dashed border-neutral-700 py-3 text-sm text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 transition-colors"
          >
            Click to add default fields (Title, Subtitle, Date, Info)
          </button>
        )}
      </div>
    </div>
  );
}
