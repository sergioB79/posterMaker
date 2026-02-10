"use client";

interface BriefInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BriefInput({ value, onChange }: BriefInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
        General Brief
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what you want — the vibe, the purpose, the context. E.g.: 'A poster for an electronic music festival in Lisbon, underground feel, night atmosphere, bold and modern.'"
        rows={4}
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-vertical"
      />
    </div>
  );
}
