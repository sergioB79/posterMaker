import { artists, type ArtistInfluence } from "@/data/artists";
import { styles, formats } from "@/data/styles";

export interface TextField {
  id: string;
  label: string;
  content: string;
  priority: "H1" | "H2" | "body" | "small";
}

export interface PosterRequest {
  brief: string;
  textFields: TextField[];
  styleId: string;
  influenceIds: string[];
  formatId: string;
  tone?: string;
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
    .map((f) => `- [${f.priority}] ${f.label}: "${f.content}"`)
    .join("\n");
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

  const toneStr = request.tone
    ? `\nDESIGN TONE\n${request.tone}`
    : "";

  const colorStr =
    request.colorMode === "custom" && request.customColors?.length
      ? `\nCOLOR PALETTE\nUse these colors as the foundation: ${request.customColors.join(", ")}`
      : "\nCOLOR PALETTE\nAuto — choose a cohesive palette that fits the style and mood";

  const system = `You are a senior art director and poster designer with decades of experience in typography, visual hierarchy, print composition, and contemporary graphic design.

You think in terms of layout systems, grids, contrast, rhythm, negative space, and legibility.
You do not imitate artists literally — you abstract their visual language into compositional rules.

Your goal is to design striking, professional posters that could realistically be printed or published.

When generating a poster image:
- Create the actual poster artwork, not a description
- The poster must contain all the text provided, rendered clearly and legibly
- Apply strong visual hierarchy so the most important text dominates
- Ensure the composition works both at a distance and up close
- Do NOT include mockup frames, device frames, or presentation contexts
- Do NOT add watermarks or signatures
- The output should be a single poster image, ready for print`;

  const user = `DESIGN TASK
Create a poster based on the following information.

GENERAL BRIEF
${request.brief}

TEXT CONTENT
${buildTextFieldsBlock(request.textFields)}

FORMAT
${formatStr}

STYLE DIRECTION
${styleName}

ARTISTIC INFLUENCE
${influencePhrase}
${toneStr}
${colorStr}

DESIGN RULES
- Strong visual hierarchy: the most important text must dominate the composition
- Professional typography: clean, intentional, legible at all sizes
- Clear focal point that draws the eye immediately
- Balanced use of negative space — let the design breathe
- No decorative clutter — every element must earn its place
- The poster must work at a distance (impact) and up close (detail)
- All provided text must appear on the poster, correctly spelled

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
Make this variation distinctly different from other versions while staying true to the brief and influences.`,
  };
}
