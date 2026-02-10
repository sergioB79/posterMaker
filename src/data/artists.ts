export interface ArtistInfluence {
  id: string;
  name: string;
  category: "designer" | "movement" | "look";
  shortDesc: string;
  fingerprint: {
    layout: string;
    typography: string;
    composition: string;
    color: string;
    texture: string;
    motifs: string;
  };
}

export const artists: ArtistInfluence[] = [
  // --- Designers / Studios ---
  {
    id: "saul-bass",
    name: "Saul Bass",
    category: "designer",
    shortDesc: "Bold geometry, symbolic reduction, cinematic tension",
    fingerprint: {
      layout: "centered, asymmetric focal point, generous margins",
      typography: "hand-drawn feel, bold sans-serif, tight leading",
      composition: "single dominant symbol, strong diagonal movement",
      color: "high contrast, black + one or two accent colors (red, orange)",
      texture: "cut-paper, flat graphic, grain on edges",
      motifs: "fragmented shapes, silhouettes, eye-catching symbols",
    },
  },
  {
    id: "mueller-brockmann",
    name: "Josef Müller-Brockmann",
    category: "designer",
    shortDesc: "Swiss grid master, mathematical precision, clean hierarchy",
    fingerprint: {
      layout: "strict grid system, mathematical proportions, wide margins",
      typography: "Helvetica/Akzidenz, light to bold weights, tight tracking",
      composition: "geometric order, asymmetric balance within grid",
      color: "limited palette, muted tones, high contrast text",
      texture: "flat, clean, no ornamentation",
      motifs: "concentric circles, arcs, geometric abstractions",
    },
  },
  {
    id: "paula-scher",
    name: "Paula Scher",
    category: "designer",
    shortDesc: "Expressive typography, map-like density, bold scale contrasts",
    fingerprint: {
      layout: "type-as-layout, densely packed, overlapping elements",
      typography: "massive display type, mixed weights, decorative serifs",
      composition: "all-over composition, horror vacui, layered depth",
      color: "vibrant, saturated, multi-color palettes",
      texture: "flat graphic with layered complexity",
      motifs: "oversized letterforms, typographic maps, word-as-image",
    },
  },
  {
    id: "david-carson",
    name: "David Carson",
    category: "designer",
    shortDesc: "Anti-grid, deconstructed type, raw editorial energy",
    fingerprint: {
      layout: "broken grid, overlapping frames, anti-alignment",
      typography: "distorted, layered, illegibility as expression",
      composition: "chaotic but intentional, collage-like depth",
      color: "muted or high contrast, often desaturated photography",
      texture: "grungy, photocopied, distressed surfaces",
      motifs: "fragmented text, layered photography, visual noise",
    },
  },
  {
    id: "neville-brody",
    name: "Neville Brody",
    category: "designer",
    shortDesc: "Experimental typography, editorial innovation, digital pioneer",
    fingerprint: {
      layout: "editorial grid, structured but experimental zones",
      typography: "custom typefaces, geometric sans, bold display",
      composition: "structured asymmetry, tension between order and experiment",
      color: "bold primaries or monochrome with accent",
      texture: "clean digital, occasional analog references",
      motifs: "custom glyphs, typographic experiments, editorial layouts",
    },
  },
  {
    id: "stefan-sagmeister",
    name: "Stefan Sagmeister",
    category: "designer",
    shortDesc: "Provocative concepts, physical typography, emotional impact",
    fingerprint: {
      layout: "concept-driven, breaks conventional poster rules",
      typography: "physical/sculptural type, hand-made letterforms",
      composition: "single powerful image, minimal but intense",
      color: "varies with concept, often naturalistic or flesh tones",
      texture: "photographic, tactile, real-world surfaces",
      motifs: "body as canvas, 3D typography, conceptual provocation",
    },
  },
  {
    id: "massimo-vignelli",
    name: "Massimo Vignelli",
    category: "designer",
    shortDesc: "Timeless modernism, limited typefaces, absolute clarity",
    fingerprint: {
      layout: "strict grid, generous whitespace, hierarchical clarity",
      typography: "Helvetica, Bodoni, Garamond only, disciplined scale",
      composition: "classical balance, clean separation of elements",
      color: "primary colors, black, white, restrained palette",
      texture: "flat, clean, no decoration",
      motifs: "clean lines, structured blocks, information architecture",
    },
  },
  {
    id: "alexey-brodovitch",
    name: "Alexey Brodovitch",
    category: "designer",
    shortDesc: "Editorial elegance, dynamic whitespace, photographic drama",
    fingerprint: {
      layout: "dramatic whitespace, bold cropping, editorial flow",
      typography: "elegant serif, restrained but precise placement",
      composition: "dynamic tension, asymmetric balance, cinematic framing",
      color: "black and white dominance, selective color accents",
      texture: "photographic grain, editorial polish",
      motifs: "cropped photography, dramatic scale shifts, editorial grace",
    },
  },
  {
    id: "herb-lubalin",
    name: "Herb Lubalin",
    category: "designer",
    shortDesc: "Typographic wit, ligature mastery, conceptual wordplay",
    fingerprint: {
      layout: "type-centered, tight spatial relationships",
      typography: "ITC Avant Garde, custom ligatures, tight kerning",
      composition: "word-as-image, typographic illustration",
      color: "often monochrome or limited, red accents",
      texture: "clean print, flat graphic",
      motifs: "ligatures, typographic puns, letterform as concept",
    },
  },
  {
    id: "april-greiman",
    name: "April Greiman",
    category: "designer",
    shortDesc: "Digital pioneer, layered space, new wave typography",
    fingerprint: {
      layout: "layered planes, floating elements, digital spatial depth",
      typography: "bitmap + vector mix, digital aesthetic, varied scale",
      composition: "collage of digital and analog, cosmic space",
      color: "gradients, neon accents, digital spectrum",
      texture: "pixel artifacts, smooth gradients, digital collage",
      motifs: "floating geometry, digital landscapes, layered transparencies",
    },
  },

  // --- Movements ---
  {
    id: "swiss-style",
    name: "Swiss / International Typographic Style",
    category: "movement",
    shortDesc: "Grid systems, objective design, typographic clarity",
    fingerprint: {
      layout: "mathematical grid, flush-left ragged-right, modular",
      typography: "sans-serif (Helvetica/Univers), clean hierarchy",
      composition: "asymmetric balance, photographic objectivity",
      color: "limited, functional, high contrast",
      texture: "flat, clean, photographic",
      motifs: "grid lines, geometric shapes, objective photography",
    },
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    category: "movement",
    shortDesc: "Form follows function, primary geometry, universal design",
    fingerprint: {
      layout: "geometric grid, functional zones, clear hierarchy",
      typography: "geometric sans-serif, uppercase, Futura-like",
      composition: "balanced asymmetry, primary shapes as structure",
      color: "red, yellow, blue + black/white",
      texture: "flat, clean, industrial",
      motifs: "circles, triangles, squares, primary geometry",
    },
  },
  {
    id: "constructivism",
    name: "Russian Constructivism",
    category: "movement",
    shortDesc: "Dynamic diagonals, photomontage, revolutionary energy",
    fingerprint: {
      layout: "diagonal axes, dynamic angles, overlapping planes",
      typography: "bold sans, angled text, mixed sizes, uppercase shouts",
      composition: "diagonal thrust, photomontage, layered planes",
      color: "red, black, white, occasional yellow",
      texture: "newsprint, lithographic, rough edges",
      motifs: "diagonal beams, photomontage, geometric figures, arrows",
    },
  },
  {
    id: "brutalism",
    name: "Brutalism (Graphic)",
    category: "movement",
    shortDesc: "Raw structure, exposed systems, anti-polish aesthetic",
    fingerprint: {
      layout: "exposed grid, raw structure, visible systems",
      typography: "monospace or system fonts, raw HTML aesthetic",
      composition: "deliberately crude, functional over beautiful",
      color: "harsh contrasts, neon on black, or stark black on white",
      texture: "digital raw, no smoothing, visible pixels/borders",
      motifs: "visible borders, raw elements, system-level aesthetic",
    },
  },
  {
    id: "art-nouveau",
    name: "Art Nouveau",
    category: "movement",
    shortDesc: "Organic curves, decorative borders, natural elegance",
    fingerprint: {
      layout: "organic flow, decorative borders, integrated illustration",
      typography: "custom decorative lettering, flowing curves",
      composition: "integrated text and image, organic unity",
      color: "muted earth tones, gold, sage, dusty rose",
      texture: "illustrated, hand-drawn, lithographic print",
      motifs: "flowing hair, vines, flowers, organic curves, ornamental borders",
    },
  },
  {
    id: "pop-art",
    name: "Pop Art",
    category: "movement",
    shortDesc: "Mass culture, bold colour, graphic reproduction",
    fingerprint: {
      layout: "comic-strip panels, centered focus, bold framing",
      typography: "bold impact, comic lettering, speech bubbles",
      composition: "single iconic image, flat graphic treatment",
      color: "CMYK primaries, saturated, Ben-Day dots palette",
      texture: "halftone dots, screen print, flat areas",
      motifs: "consumer products, celebrities, comic elements, repetition",
    },
  },
  {
    id: "art-deco",
    name: "Art Deco",
    category: "movement",
    shortDesc: "Geometric luxury, streamlined elegance, golden age glamour",
    fingerprint: {
      layout: "symmetrical, vertical emphasis, decorative framing",
      typography: "geometric display, inline/outline, elegant caps",
      composition: "symmetrical balance, vertical thrust, framed content",
      color: "gold, black, cream, teal, rich jewel tones",
      texture: "metallic sheen, geometric patterns, luxurious surfaces",
      motifs: "sunburst rays, chevrons, geometric patterns, streamlined forms",
    },
  },

  // --- Look & Feel ---
  {
    id: "minimal-typo",
    name: "Minimal Typographic",
    category: "look",
    shortDesc: "Type only, maximum whitespace, quiet confidence",
    fingerprint: {
      layout: "vast whitespace, single text block, extreme margins",
      typography: "refined sans or serif, single weight, precise placement",
      composition: "extreme restraint, one focal point, nothing extra",
      color: "monochrome or one accent, high contrast",
      texture: "flat, clean, paper-like",
      motifs: "nothing but type and space",
    },
  },
  {
    id: "high-contrast-geo",
    name: "High-Contrast Geometric",
    category: "look",
    shortDesc: "Bold shapes, stark contrast, graphic impact",
    fingerprint: {
      layout: "bold geometric blocks, sharp divisions",
      typography: "heavy sans-serif, high contrast sizes",
      composition: "graphic blocks, stark figure-ground",
      color: "black + white + one bold accent",
      texture: "flat, hard edges, no gradients",
      motifs: "circles, rectangles, hard-edge shapes",
    },
  },
  {
    id: "halftone-print",
    name: "Halftone Print Texture",
    category: "look",
    shortDesc: "Screen print aesthetic, vintage reproduction, tactile dots",
    fingerprint: {
      layout: "editorial, offset registration, print marks",
      typography: "bold condensed, slightly misregistered",
      composition: "layered print, visible process",
      color: "CMYK separation, overprint overlaps",
      texture: "halftone dots, ink bleed, paper grain",
      motifs: "dot patterns, registration marks, overprint effects",
    },
  },
  {
    id: "film-cinematic",
    name: "Film Poster Cinematic",
    category: "look",
    shortDesc: "Dramatic lighting, epic scale, Hollywood composition",
    fingerprint: {
      layout: "vertical, hero image dominant, text at bottom",
      typography: "elegant serif or condensed sans, credits block",
      composition: "dramatic figure, atmospheric depth, moody lighting",
      color: "dark, moody, teal-orange, desaturated with accents",
      texture: "photographic, atmospheric haze, film grain",
      motifs: "silhouettes, dramatic lighting, atmospheric depth",
    },
  },
  {
    id: "retro-70s",
    name: "Retro 70s Gradient",
    category: "look",
    shortDesc: "Warm gradients, rounded type, sunset vibes",
    fingerprint: {
      layout: "stacked horizontal bands, centered text",
      typography: "rounded sans, fat weights, groovy curves",
      composition: "horizontal layers, warm atmosphere",
      color: "sunset palette: orange, rust, cream, brown, mustard",
      texture: "smooth gradients, paper grain, soft edges",
      motifs: "stripes, sun/sunset, rainbow arcs, rounded shapes",
    },
  },
  {
    id: "collage-cutout",
    name: "Collage Cutout",
    category: "look",
    shortDesc: "Cut paper, layered fragments, analog chaos",
    fingerprint: {
      layout: "fragmented, overlapping cutouts, anarchic placement",
      typography: "ransom-note mix, cut-out letters, varied sources",
      composition: "layered fragments, visible edges, depth through overlap",
      color: "mixed sources, paper whites, ink blacks, found color",
      texture: "torn edges, tape, glue marks, paper layers",
      motifs: "cut-out photos, torn paper, magazine fragments, tape",
    },
  },
  {
    id: "psychedelic",
    name: "Psychedelic",
    category: "look",
    shortDesc: "Flowing forms, vibrating colour, optical intensity",
    fingerprint: {
      layout: "organic flow, no straight lines, filled space",
      typography: "warped, flowing, barely legible, art-lettering",
      composition: "all-over pattern, no clear hierarchy, optical vibration",
      color: "neon, saturated, complementary clashes, electric",
      texture: "flowing organic, hand-drawn, screen print",
      motifs: "flowing hair, eyes, organic shapes, optical patterns",
    },
  },
];

export const categoryLabels: Record<ArtistInfluence["category"], string> = {
  designer: "Designers / Studios",
  movement: "Movements",
  look: "Look & Feel",
};
