import type { TextField } from "./prompt-builder";

export interface PosterFormState {
  brief: string;
  textFields: TextField[];
  styleId: string;
  influenceIds: string[];
  formatId: string;
  tone: string;
  colorMode: "auto" | "custom";
  customColors: string[];
}

export interface GeneratedPoster {
  id: string;
  imageUrl: string;
  prompt: string;
  variationIndex: number;
}

export interface GenerationResult {
  posters: GeneratedPoster[];
  error?: string;
}
