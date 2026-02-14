import { remixes } from "@/data/remixes";
import { styles, formats, compositions, palettes, textures, vibes as vibePresets } from "@/data/styles";

export interface TextField {
  id: string;
  label: string;
  content: string;
  priority: "H1" | "H2" | "body" | "small";
  color?: string;
}

export interface PosterRequest {
  brief: string;
  textFields: TextField[];
  styleId: string;
  remixId?: string;
  formatId: string;
  tones?: string[];
  vibes?: string[];
  compositionId?: string;
  textureId?: string;
  paletteId?: string;
  customColors?: string[];
}

/* ─── Helper builders ─── */

function buildTextFieldsBlock(fields: TextField[]): string {
  if (fields.length === 0)
    return "No specific text provided — generate appropriate placeholder text.";

  return fields
    .map((f) => {
      const color = f.color && f.color !== "random" ? f.color : "random";
      return `- [${f.priority}] ${f.label}: "${f.content}" (color: ${color})`;
    })
    .join("\n");
}

function buildTextSpellingBlock(fields: TextField[]): string {
  const filled = fields.filter((f) => f.content.trim());
  if (filled.length === 0) return "";

  const lines = filled.map((f) => {
    const chars = f.content.split("").join(" · ");
    return `  "${f.content}" → ${chars}`;
  });

  return `\n\nEXACT TEXT REFERENCE (spell-check against this — every character matters):\n${lines.join("\n")}`;
}

function buildStyleSection(request: PosterRequest): string {
  const style = styles.find((s) => s.id === request.styleId);
  const remix = request.remixId
    ? remixes.find((r) => r.id === request.remixId)
    : null;

  if (request.styleId === "auto" && !remix) {
    return "Auto — choose the most appropriate visual style based on the brief and mood.";
  }

  let result = "";

  if (style && request.styleId !== "auto") {
    result = style.promptDescription;
  }

  if (remix) {
    if (result) {
      result += `\nInfused with ${remix.name}: ${remix.promptDescription}`;
    } else {
      result = remix.promptDescription;
    }
  }

  return result || "Auto — choose the most appropriate visual style.";
}

function buildCompositionSection(request: PosterRequest): string {
  const comp = request.compositionId
    ? compositions.find((c) => c.id === request.compositionId)
    : null;

  if (!comp || comp.id === "auto") {
    return "Auto — choose the best composition for the content and style.";
  }

  return comp.promptDescription;
}

function buildVibeAndToneSection(request: PosterRequest): string {
  const parts: string[] = [];

  if (request.vibes && request.vibes.length > 0) {
    const vibeNames = request.vibes
      .map((id) => vibePresets.find((v) => v.id === id)?.name)
      .filter(Boolean);
    if (vibeNames.length > 0) {
      parts.push(`Overall vibe: ${vibeNames.join(" + ")}`);
    }
  }

  if (request.tones && request.tones.length > 0) {
    parts.push(`Design tone: ${request.tones.join(" + ")}`);
  }

  return parts.length > 0 ? parts.join(". ") : "";
}

function buildPaletteSection(request: PosterRequest): string {
  if (request.paletteId === "custom" && request.customColors?.length) {
    return `Use these colors as the foundation: ${request.customColors.join(", ")}`;
  }

  const palette = request.paletteId
    ? palettes.find((p) => p.id === request.paletteId)
    : null;

  if (!palette || palette.id === "auto") {
    return "Auto — choose a cohesive palette that fits the style and mood.";
  }

  return palette.promptDescription;
}

function buildTextureSection(request: PosterRequest): string {
  const texture = request.textureId
    ? textures.find((t) => t.id === request.textureId)
    : null;

  if (!texture || texture.id === "none") return "";

  return texture.promptDescription;
}

/* ─── Main prompt builder ─── */

export function buildPrompt(request: PosterRequest): {
  system: string;
  user: string;
} {
  const format = formats.find((f) => f.id === request.formatId);
  const formatStr = format
    ? `${format.name} (${format.width}×${format.height}px)`
    : "A4 Portrait";

  const styleSection = buildStyleSection(request);
  const compositionSection = buildCompositionSection(request);
  const vibeAndTone = buildVibeAndToneSection(request);
  const paletteSection = buildPaletteSection(request);
  const textureSection = buildTextureSection(request);

  const system = `You are a senior art director and poster designer with decades of experience in typography, visual hierarchy, print composition, and contemporary graphic design.

You think in terms of layout systems, grids, contrast, rhythm, negative space, and legibility.
You do not imitate artists literally — you abstract visual language into compositional rules.

Your goal is to design striking, professional posters that could realistically be printed or published.

ABSOLUTE TEXT RULES — VIOLATING THESE IS A FAILURE:
1. ONLY use the text provided in TEXT CONTENT. Do NOT invent, add, or improvise ANY extra words, labels, dates, taglines, or phrases.
2. Every text element MUST appear EXACTLY as written — same spelling, same capitalization, same punctuation, same language.
3. Do NOT rephrase, abbreviate, translate, correct, or "improve" any text.
4. Do NOT add words like "presents", "live", "featuring", "tickets at", or any other text not explicitly provided.
5. Do NOT split words across lines mid-word.
6. If TEXT CONTENT has 3 items, the poster must have exactly 3 text elements — no more, no less.
7. Text must be LEGIBLE — clear typefaces, sufficient contrast, appropriate sizing.
8. H1 = largest/most prominent. H2 = secondary. body = supporting. small = fine print.

When generating a poster image:
- Create the actual poster artwork, not a description
- Ensure the composition works both at a distance and up close
- Do NOT include mockup frames, device frames, or presentation contexts
- Do NOT add watermarks or signatures
- The output should be a single poster image, ready for print`;

  const vibeBlock = vibeAndTone
    ? `\nMOOD & TONE\n${vibeAndTone}`
    : "";

  const textureBlock = textureSection
    ? `\nFINISH / TEXTURE\n${textureSection}`
    : "";

  const user = `DESIGN TASK
Create a professional ${formatStr} poster design.

SUBJECT / BRIEF
${request.brief}

TEXT CONTENT — use ONLY these texts, nothing more, nothing less:
${buildTextFieldsBlock(request.textFields)}
${buildTextSpellingBlock(request.textFields)}

VISUAL STYLE
${styleSection}

COMPOSITION
${compositionSection}
${vibeBlock}

COLOR PALETTE
${paletteSection}
${textureBlock}

DESIGN RULES
- Strong visual hierarchy: H1 text must dominate, H2 secondary, body smaller, small at the bottom
- Professional typography: clean, intentional, legible at all sizes
- Clear focal point that draws the eye immediately
- Balanced use of negative space — let the design breathe
- No decorative clutter — every element must earn its place
- ONLY the provided text appears on the poster — absolutely no invented text
- High-quality graphic design, vector-style clarity, no photographic realism unless specified

OUTPUT
Generate the poster image now. Do NOT describe it. Create it.`;

  return { system, user };
}

/* ─── Variation prompt ─── */

export function buildVariationPrompt(
  request: PosterRequest,
  variationIndex: number,
  totalVariations: number
): { system: string; user: string } {
  const base = buildPrompt(request);

  const variationInstructions = [
    "Focus on BOLD TYPOGRAPHY as the dominant visual element. Make the type itself the hero of the poster.",
    "Focus on STRONG GEOMETRIC COMPOSITION. Use shapes, blocks, and spatial division as the primary visual strategy.",
    "Focus on ATMOSPHERIC MOOD. Create depth, texture, and emotional resonance through colour and space.",
    "Focus on MINIMALIST IMPACT. Strip everything to the absolute essential. Maximum effect, minimum elements.",
    "Focus on DYNAMIC ENERGY. Create movement, tension, and visual rhythm through diagonal elements and contrast.",
    "Focus on LAYERED COMPLEXITY. Create depth through overlapping elements, transparency, and visual richness.",
  ];

  const instruction =
    variationInstructions[variationIndex % variationInstructions.length];

  return {
    system: base.system,
    user: `${base.user}

VARIATION ${variationIndex + 1} OF ${totalVariations}
${instruction}
Make this variation distinctly different from other versions while staying true to the brief and style.
REMINDER: Use ONLY the provided text — do not add or change ANY words. Spell every word exactly as given.`,
  };
}
