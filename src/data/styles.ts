/* ─── Style Presets (Design Era / Movement) ─── */

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  promptDescription: string;
}

export const styles: StylePreset[] = [
  {
    id: "auto",
    name: "Auto (AI decides)",
    description: "Let the AI choose the best style based on your brief",
    promptDescription: "",
  },
  {
    id: "art-nouveau",
    name: "Art Nouveau",
    description: "Flowing organic curves, nature-inspired motifs, ethereal elegance",
    promptDescription:
      "Art Nouveau style: flowing 'whiplash' curves, nature-inspired motifs, intricate floral borders with elegant ethereal figures. Ornate decorative lettering with organic curves. Muted earth tones, gold, sage, dusty rose. Lithographic illustrated texture.",
  },
  {
    id: "plakatstil",
    name: "Plakatstil",
    description: "Radical simplification, one bold flat-colored object, heavy lettering",
    promptDescription:
      "Plakatstil (Poster Style): radical simplification with one bold, flat-colored central object against a high-contrast background. Heavy, thick lettering. Minimal elements, maximum impact. Clean graphic treatment with strong silhouettes.",
  },
  {
    id: "constructivism",
    name: "Russian Constructivism",
    description: "Industrial geometry, diagonal axes, photomontage, red-black-white",
    promptDescription:
      "Russian Constructivism: intense industrial geometry with heavy diagonal axes and dynamic angles. Photomontage elements, layered planes, bold sans-serif angled text. Strict palette of red, black, and white with occasional yellow. Newsprint lithographic texture.",
  },
  {
    id: "art-deco",
    name: "Art Deco",
    description: "Architectural symmetry, sunburst patterns, metallic elegance",
    promptDescription:
      "Art Deco: architectural symmetry with sunburst patterns, sleek metallic gradients, and 'Machine Age' elegance. Vertical elongated forms, geometric display typography with inline/outline elegant caps. Gold, black, cream, teal, rich jewel tones. Luxurious metallic surfaces.",
  },
  {
    id: "swiss",
    name: "Swiss / International Typographic",
    description: "Mathematical grids, sans-serif hierarchy, objective clarity",
    promptDescription:
      "Swiss International Typographic Style: maximum objectivity with strict mathematical grids, sans-serif typography (Helvetica/Univers), clean hierarchy with flush-left ragged-right alignment. Black-and-white photography, limited functional color, flat clean surfaces.",
  },
  {
    id: "psychedelic",
    name: "Psychedelic",
    description: "Liquid melting typography, vibrating colour-clash, surrealist imagery",
    promptDescription:
      "Psychedelic style: liquid, melting typography that is barely legible, vibrating color-clash palettes with neon saturated complementary colors. Kaleidoscopic surrealist dream-imagery, flowing organic forms, optical vibration patterns. Screen-printed hand-drawn texture.",
  },
  {
    id: "mid-century",
    name: "Mid-Century Modern",
    description: "Hand-drawn atomic shapes, whimsical illustrations, warm optimism",
    promptDescription:
      "Mid-Century Modern: hand-drawn geometric 'atomic' shapes, whimsical illustrations with large areas of negative space. Warm optimistic mood, rounded sans-serif typography, playful compositions. Warm palette with orange, teal, mustard, cream.",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Ben-Day dots, comic-book outlines, vibrant primary repetition",
    promptDescription:
      "Pop Art: Ben-Day printing dots, thick comic-book outlines, vibrant primary colors with high-contrast repetition of everyday icons. Bold impact typography, comic lettering, speech bubbles. CMYK saturated halftone screen print texture.",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Unpolished raw design, blocky shapes, concrete feeling",
    promptDescription:
      "Brutalist graphic design: unpolished, 'honest' design with heavy blocky shapes, exposed structure. Monospace or system fonts, monochromatic or neon-clash colors, deliberately crude functional aesthetic. Visible borders, raw elements, a 'built-from-concrete' feeling.",
  },
  {
    id: "grunge",
    name: "Grunge / Deconstructivism",
    description: "Chaotic layers, distressed textures, xerox-glitch, rebellious",
    promptDescription:
      "Grunge Deconstructivism: chaotic layers with 'broken' or illegible type, distressed textures, xerox-glitch effects. Raw rebellious energy, broken grid, overlapping frames, anti-alignment. Muted or high contrast, photocopied grungy distressed surfaces.",
  },
  {
    id: "memphis",
    name: "Memphis Design",
    description: "Squiggly patterns, confetti shapes, clashing pastel-neon",
    promptDescription:
      "Memphis Design (Radical 80s): squiggly 'bacteria' patterns, confetti-like shapes, clashing pastel and neon colors. Total rejection of traditional design rules, bold geometric patterns, playful and irreverent. Bright flat graphic surfaces.",
  },
  {
    id: "flat-2",
    name: "Flat Design 2.0",
    description: "Clean 2D shapes, app-style gradients, modern sans-serif",
    promptDescription:
      "Flat Design 2.0 (Digital Modern): clean 2D shapes with vibrant 'app-style' gradients, subtle long shadows adding depth. Highly legible modern sans-serif type, bright saturated colors, smooth digital vector surfaces.",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "80s-90s digital aesthetics, glitches, neon pink-teal retro-futurism",
    promptDescription:
      "Vaporwave: 1980s-90s digital aesthetics with glitches, classical statuary, neon pink and teal palettes. 'Lo-fi' retro-futurism, grid landscapes, sunset gradients, CRT scan lines, chrome text effects. Nostalgic digital texture.",
  },
  {
    id: "baroque",
    name: "Baroque / Maximalist",
    description: "Dense layered complexity, rich gold, theatrical lighting",
    promptDescription:
      "Baroque Maximalist: dense layered complexity with rich gold textures, deep shadows, theatrical dramatic lighting. Every inch of the page filled with ornate detail, rich jewel-tone palette, luxurious surfaces with depth and dimension.",
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    description: "Form follows function, primary shapes and colors, geometric balance",
    promptDescription:
      "Bauhaus: 'form follows function' with primary shapes (circle, square, triangle) and primary colors (red, yellow, blue plus black/white). Balanced experimental geometric compositions, geometric sans-serif uppercase typography, clean industrial flat surfaces.",
  },
  {
    id: "folk-art",
    name: "Folk Art / Naive",
    description: "Flat colorful 'imperfect' illustrations, hand-crafted charm",
    promptDescription:
      "Folk Art Naive style: flat, colorful, intentionally 'imperfect' illustrations with charming hand-crafted textures. Bold simple storytelling, bright primary colors, blocky characters with visual wit. Hand-painted brushstroke texture.",
  },
  {
    id: "neo-noir",
    name: "Neo-Noir",
    description: "High-contrast chiaroscuro, deep shadows, mystery and drama",
    promptDescription:
      "Neo-Noir (Cinematic): high-contrast 'chiaroscuro' lighting with deep shadows, moody atmospheric fog. Focus on mystery and drama, silhouettes, desaturated palette with selective color accents (red, amber). Film grain photographic texture.",
  },
  {
    id: "ukiyo-e",
    name: "Ukiyo-e Inspired",
    description: "Flat colour planes, bold outlines, Eastern printmaking atmosphere",
    promptDescription:
      "Ukiyo-e Inspired (Woodblock): flat planes of color with bold outlines, asymmetrical balance, atmospheric gradients. Inspired by traditional Eastern printmaking with nature motifs, waves, mountains. Wood-grain block-print texture.",
  },
  {
    id: "acid-graphics",
    name: "Acid Graphics",
    description: "High-gloss 3D, chrome surfaces, warped liquid metal, futuristic type",
    promptDescription:
      "Acid Graphics (Rave): high-gloss 3D textures with chrome surfaces, warped 'liquid metal' shapes. Hyper-modern illegible futuristic typography, iridescent gradients, metallic reflective surfaces with distorted organic-tech forms.",
  },
  {
    id: "minimalist-zen",
    name: "Minimalist / Zen",
    description: "One focal point, massive empty space, whisper-quiet typography",
    promptDescription:
      "Minimalist Zen: one single focal point with massive amounts of empty space. Whisper-quiet typography creating a sense of calm, extreme restraint with nothing extra. Monochrome or single accent, flat paper-like clean surfaces.",
  },
];

/* ─── Formats (grouped by category) ─── */

export interface FormatPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: "print" | "social" | "digital";
}

export const formats: FormatPreset[] = [
  { id: "a4-portrait", name: "A4 Portrait", width: 2480, height: 3508, category: "print" },
  { id: "a3-portrait", name: "A3 Portrait", width: 3508, height: 4961, category: "print" },
  { id: "instagram-post", name: "Instagram Post", width: 1080, height: 1350, category: "social" },
  { id: "instagram-story", name: "Instagram Story", width: 1080, height: 1920, category: "social" },
  { id: "square", name: "Square", width: 2048, height: 2048, category: "social" },
  { id: "landscape-16-9", name: "Landscape 16:9", width: 1920, height: 1080, category: "digital" },
];

export const formatCategories: Record<FormatPreset["category"], string> = {
  print: "Print",
  social: "Social",
  digital: "Digital",
};

/* ─── Design Tones (multi-select, fine-grained) ─── */

export const designTones = [
  "restrained",
  "aggressive",
  "elegant",
  "raw",
  "cinematic",
  "institutional",
  "playful",
  "provocative",
  "sophisticated",
  "experimental",
] as const;

export type DesignTone = (typeof designTones)[number];

/* ─── Vibes (multi-select, max 2, broad mood) ─── */

export interface VibePreset {
  id: string;
  name: string;
  description: string;
}

export const vibes: VibePreset[] = [
  { id: "sophisticated-elegant", name: "Sophisticated & Elegant", description: "Refined, luxurious, polished" },
  { id: "raw-aggressive", name: "Raw & Aggressive", description: "Bold, intense, confrontational" },
  { id: "playful-experimental", name: "Playful & Experimental", description: "Fun, curious, boundary-pushing" },
  { id: "clean-institutional", name: "Clean & Institutional", description: "Professional, structured, authoritative" },
];

/* ─── Composition Types (single select) ─── */

export interface CompositionPreset {
  id: string;
  name: string;
  description: string;
  promptDescription: string;
}

export const compositions: CompositionPreset[] = [
  {
    id: "auto",
    name: "Auto (AI decides)",
    description: "Let the AI choose based on content and style",
    promptDescription: "",
  },
  {
    id: "typographic-dominant",
    name: "Typographic Dominant",
    description: "Text is the main visual hero",
    promptDescription: "Typographic Dominant composition where text is the main hero element. Large-scale display type drives the layout, letterforms create visual rhythm and hierarchy.",
  },
  {
    id: "image-focused",
    name: "Image-Focused",
    description: "Photography or illustration centered",
    promptDescription: "Image-Focused composition centered around a dominant photograph or illustration. Text is secondary and supports the visual, arranged around the central image.",
  },
  {
    id: "abstract-geometric",
    name: "Abstract / Geometric",
    description: "Shapes and patterns as structure",
    promptDescription: "Abstract Geometric composition using shapes, patterns, and geometric forms as the primary structural elements. Text is integrated within the geometric framework.",
  },
  {
    id: "collage-mixed",
    name: "Collage / Mixed Media",
    description: "Layered textures and fragments",
    promptDescription: "Collage Mixed Media composition with layered textures, overlapping fragments, and mixed-media elements creating depth through visual complexity.",
  },
];

/* ─── Color Palettes (single select) ─── */

export interface PalettePreset {
  id: string;
  name: string;
  description: string;
  promptDescription: string;
}

export const palettes: PalettePreset[] = [
  {
    id: "auto",
    name: "Auto (AI decides)",
    description: "Cohesive palette matching style and mood",
    promptDescription: "Choose a cohesive color palette that fits the style and mood.",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Black & white with tonal range",
    promptDescription: "Monochrome black-and-white palette with full tonal range from deep black to bright white.",
  },
  {
    id: "primary",
    name: "Primary",
    description: "Red, blue, yellow — bold and classic",
    promptDescription: "Primary colors palette: bold red, blue, and yellow with black and white accents.",
  },
  {
    id: "earth-tones",
    name: "Earth Tones",
    description: "Warm naturals — brown, olive, terracotta",
    promptDescription: "Earth tones palette: warm naturals including brown, olive, terracotta, sand, and forest green.",
  },
  {
    id: "neon-vibrant",
    name: "Neon / Vibrant",
    description: "Electric, saturated, high-energy",
    promptDescription: "Neon vibrant palette: electric high-saturation colors including hot pink, electric blue, acid green, and vivid orange.",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Enter your own hex codes",
    promptDescription: "",
  },
];

/* ─── Texture / Finish ─── */

export interface TexturePreset {
  id: string;
  name: string;
  description: string;
  promptDescription: string;
}

export const textures: TexturePreset[] = [
  {
    id: "none",
    name: "None (Crisp Digital)",
    description: "Clean, smooth, no texture overlay",
    promptDescription: "",
  },
  {
    id: "paper-grain",
    name: "Paper Grain",
    description: "Matte paper surface with subtle grain",
    promptDescription: "Rendered with a matte paper grain texture, subtle fiber visible, like a high-quality art print on uncoated stock.",
  },
  {
    id: "distressed",
    name: "Distressed / Street",
    description: "Wheatpaste, torn edges, weathered surface",
    promptDescription: "Rendered with a distressed street-poster texture: wheatpaste effect, torn edges, weathered surface as if the poster has been pasted on a wall and aged.",
  },
  {
    id: "glossy",
    name: "Glossy / Plastic",
    description: "High-shine reflective surface",
    promptDescription: "Rendered with a glossy plastic-like finish: high-shine reflective surface with subtle light reflections as if laminated or printed on coated stock.",
  },
  {
    id: "screenprint",
    name: "Vintage Screenprint",
    description: "Ink bleed, halftone dots, registration marks",
    promptDescription: "Rendered with a vintage screenprint texture: visible ink bleed, halftone dot patterns, slight mis-registration between color layers, tactile print quality.",
  },
];
