"use client";

import { useState, useRef, useEffect } from "react";

interface BriefInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BriefInput({ value, onChange }: BriefInputProps) {
  const [showInfo, setShowInfo] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showInfo) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showInfo]);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-sm font-medium text-neutral-300">
          General Brief
        </label>
        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="w-4 h-4 rounded-full border border-neutral-600 text-neutral-500 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center justify-center text-[10px] font-medium leading-none"
            title="Content policy info"
          >
            i
          </button>
          {showInfo && (
            <div
              ref={popoverRef}
              className="absolute left-0 top-6 z-50 w-72 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl p-3 space-y-2 text-[11px] text-neutral-400 leading-relaxed"
            >
              <p className="text-amber-400 font-medium text-xs">
                Content Restrictions & Generations
              </p>
              <p>
                Some prompts may be declined or automatically blocked due to content safety rules.
              </p>
              <p>
                The image engine applies internal moderation based on broad content categories (e.g., violence, explicit material, hate symbols, illegal activity, etc.). These restrictions are not based on a public &ldquo;banned word&rdquo; list — the system evaluates the overall meaning and context of each request.
              </p>
              <p>
                Because each generation request is processed immediately and incurs a real cost on our side, <strong className="text-amber-400/80">we are unable to refund or undo a generation once it has been submitted</strong>, even if the result is blocked or declined.
              </p>
              <p>
                We understand this can be frustrating, and we truly appreciate your understanding.
              </p>
              <p>
                If your prompt is rejected, we recommend rephrasing it with neutral, artistic, or symbolic language while avoiding sensitive themes.
              </p>
              <p className="text-amber-400/70">
                Thank you for helping us keep the platform creative, safe, and sustainable.
              </p>
            </div>
          )}
        </div>
      </div>
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
