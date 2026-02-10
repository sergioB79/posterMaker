import type { TextField } from "./prompt-builder";

export interface PosterFormState {
  brief: string;
  textFields: TextField[];
  styleId: string;
  influenceIds: string[];
  formatId: string;
  tones: string[];
  colorMode: "auto" | "custom";
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
  influenceIds: string[];
  tones: string[];
  formatId: string;
  colorMode: "auto" | "custom";
  customColors: string[];
  createdAt: string;
  folder: string;
}

export interface GenerationResult {
  posters: GeneratedPoster[];
  error?: string;
}
