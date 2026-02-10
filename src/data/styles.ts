export interface StylePreset {
  id: string;
  name: string;
  description: string;
}

export const styles: StylePreset[] = [
  { id: "auto", name: "Auto (AI decides)", description: "Let the AI choose the best style based on your brief" },
  { id: "swiss", name: "Swiss", description: "Clean grids, Helvetica, objective clarity" },
  { id: "brutalist", name: "Brutalist", description: "Raw, exposed structure, anti-polish" },
  { id: "retro", name: "Retro", description: "Vintage warmth, nostalgia, analog feel" },
  { id: "psychedelic", name: "Psychedelic", description: "Flowing forms, vibrating colours, optical" },
  { id: "minimal", name: "Minimal", description: "Maximum whitespace, quiet confidence" },
  { id: "cinematic", name: "Cinematic", description: "Dramatic, moody, film poster energy" },
  { id: "typographic", name: "Typographic", description: "Type-only, expressive letterforms" },
  { id: "gradient", name: "Gradient", description: "Smooth colour transitions, modern feel" },
  { id: "collage", name: "Collage", description: "Cut-paper, layered fragments, analog" },
  { id: "art-deco", name: "Art Deco", description: "Geometric luxury, golden age glamour" },
  { id: "constructivist", name: "Constructivist", description: "Dynamic diagonals, revolutionary" },
];

export const formats = [
  { id: "a4-portrait", name: "A4 Portrait", width: 2480, height: 3508 },
  { id: "a3-portrait", name: "A3 Portrait", width: 3508, height: 4961 },
  { id: "instagram-post", name: "Instagram Post (1080×1350)", width: 1080, height: 1350 },
  { id: "instagram-story", name: "Instagram Story (1080×1920)", width: 1080, height: 1920 },
  { id: "square", name: "Square (2048×2048)", width: 2048, height: 2048 },
  { id: "landscape-16-9", name: "Landscape 16:9 (1920×1080)", width: 1920, height: 1080 },
];

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
