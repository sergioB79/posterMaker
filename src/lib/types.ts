import type { TextField } from "./prompt-builder";

export interface PosterFormState {
  brief: string;
  textFields: TextField[];
  styleId: string;
  remixId: string;
  formatId: string;
  tones: string[];
  vibes: string[];
  compositionId: string;
  textureId: string;
  paletteId: string;
  customColors: string[];
}

export interface GeneratedPoster {
  id: string;
  imageUrl: string;
  prompt: string;
  variationIndex: number;
}

export interface SavedPoster {
  id: string;
  filename: string;
  prompt: string;
  brief: string;
  textFields: TextField[];
  styleId: string;
  remixId?: string;
  tones: string[];
  vibes?: string[];
  compositionId?: string;
  textureId?: string;
  paletteId?: string;
  customColors: string[];
  createdAt: string;
  folder: string;
  // Legacy fields (old posters may have these)
  influenceIds?: string[];
  formatId?: string;
  colorMode?: "auto" | "custom";
}

export interface GenerationResult {
  posters: GeneratedPoster[];
  error?: string;
}
