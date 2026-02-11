import { artists, type ArtistInfluence } from "@/data/artists";
import { styles, formats } from "@/data/styles";

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
  influenceIds: string[];
  formatId: string;
  tones?: string[];
  colorMode?: "auto" | "custom";
  customColors?: string[];
}

function buildInfluencePhrase(influenceIds: string[]): string {
  const selected = influenceIds
    .map((id) => artists.find((a) => a.id === id))
    .filter(Boolean) as ArtistInfluence[];

  if (selected.length === 0) {
    return "No specific artistic influence — use your best judgment as a senior art director to create a visually compelling poster.";
  }

  if (selected.length === 1) {
    const a = selected[0];
    return `Style influenced by the visual language of ${a.name}, abstracting its compositional principles, typographic attitude, and graphic rhythm without imitation. Key characteristics to reference: ${a.fingerprint.composition}; ${a.fingerprint.typography}; ${a.fingerprint.color}.`;
  }

  const names = selected.map((a) => a.name);
  const last = names.pop();
  const nameList = names.join(", ") + " and " + last;

  const fingerprintSummary = selected
    .map(
      (a) =>
        `${a.name}: ${a.fingerprint.composition}, ${a.fingerprint.typography}`
    )
    .join(". ");

  return `Style composed from a deliberate blend of ${nameList}, merging their core graphic principles into a coherent, contemporary poster language. Reference points — ${fingerprintSummary}.`;
}

function buildTextFieldsBlock(fields: TextField[]): string {
  if (fields.length === 0) return "No specific text provided — generate appropriate placeholder text.";

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

  return `

EXACT TEXT REFERENCE (spell-check against this — every character matters):
${lines.join("\n")}`;
}

export function buildPrompt(request: PosterRequest): {
  system: string;
  user: string;
} {
  const style = styles.find((s) => s.id === request.styleId);
  const format = formats.find((f) => f.id === request.formatId);

  const styleName =
    request.styleId === "auto" || !style
      ? "Auto — choose the most appropriate style based on the brief and influences"
      : `${style.name} — ${style.description}`;

  const formatStr = format
    ? `${format.name} (${format.width}×${format.height}px)`
    : "A4 Portrait";

  const influencePhrase = buildInfluencePhrase(request.influenceIds);

  const toneStr =
    request.tones && request.tones.length > 0
      ? `\nDESIGN TONE\n${request.tones.join(" + ")}`
      : "";

  const colorStr =
    request.colorMode === "custom" && request.customColors?.length
      ? `\nCOLOR PALETTE\nUse these colors as the foundation: ${request.customColors.join(", ")}`
      : "\nCOLOR PALETTE\nAuto — choose a cohesive palette that fits the style and mood";

  const system = `You are a senior art director and poster designer with decades of experience in typography, visual hierarchy, print composition, and contemporary graphic design.

You think in terms of layout systems, grids, contrast, rhythm, negative space, and legibility.
You do not imitate artists literally — you abstract their visual language into compositional rules.

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

  const user = `DESIGN TASK
Create a poster based on the following information.

GENERAL BRIEF
${request.brief}

TEXT CONTENT — use ONLY these texts, nothing more, nothing less:
${buildTextFieldsBlock(request.textFields)}
${buildTextSpellingBlock(request.textFields)}

FORMAT
${formatStr}

STYLE DIRECTION
${styleName}

ARTISTIC INFLUENCE
${influencePhrase}
${toneStr}
${colorStr}

DESIGN RULES
- Strong visual hierarchy: H1 text must dominate, H2 secondary, body smaller, small at the bottom
- Professional typography: clean, intentional, legible at all sizes
- Clear focal point that draws the eye immediately
- Balanced use of negative space — let the design breathe
- No decorative clutter — every element must earn its place
- ONLY the provided text appears on the poster — absolutely no invented text

OUTPUT
Generate the poster image now. Do NOT describe it. Create it.`;

  return { system, user };
}

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
Make this variation distinctly different from other versions while staying true to the brief and influences.
REMINDER: Use ONLY the provided text — do not add or change ANY words. Spell every word exactly as given.`,
  };
}
