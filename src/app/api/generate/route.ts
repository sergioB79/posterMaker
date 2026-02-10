import { NextRequest, NextResponse } from "next/server";
import { buildVariationPrompt, type PosterRequest } from "@/lib/prompt-builder";

// This API route handles poster generation requests.
// It builds the prompt and calls an AI image generation API.
// You need to set OPENAI_API_KEY in your .env.local for DALL-E,
// or adapt the generateImage function for your preferred provider.

async function generateImage(
  system: string,
  userPrompt: string,
  width: number,
  height: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No API key configured. Set OPENAI_API_KEY in .env.local for DALL-E, or adapt this function for your image generation provider."
    );
  }

  // Using DALL-E 3 as the default image generation backend
  // The system prompt is merged into the user prompt for DALL-E
  const fullPrompt = `${system}\n\n${userPrompt}`;

  // DALL-E 3 supports: 1024x1024, 1024x1792, 1792x1024
  let size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024";
  const ratio = width / height;
  if (ratio > 1.2) {
    size = "1792x1024";
  } else if (ratio < 0.8) {
    size = "1024x1792";
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: fullPrompt.slice(0, 4000), // DALL-E 3 max prompt length
      n: 1,
      size,
      quality: "hd",
      style: "vivid",
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Image generation failed: ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  return data.data[0]?.url || data.data[0]?.b64_json;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PosterRequest & {
      variations?: number;
    };

    const {
      brief,
      textFields,
      styleId,
      influenceIds,
      formatId,
      tone,
      colorMode,
      customColors,
    } = body;

    if (!brief?.trim()) {
      return NextResponse.json(
        { error: "Brief is required" },
        { status: 400 }
      );
    }

    const request: PosterRequest = {
      brief,
      textFields: textFields || [],
      styleId: styleId || "auto",
      influenceIds: influenceIds || [],
      formatId: formatId || "a4-portrait",
      tone,
      colorMode,
      customColors,
    };

    const numVariations = Math.min(body.variations || 4, 6);

    // Determine dimensions for the format
    const { formats } = await import("@/data/styles");
    const format = formats.find((f) => f.id === request.formatId);
    const width = format?.width || 2480;
    const height = format?.height || 3508;

    // Generate variations in parallel
    const promises = Array.from({ length: numVariations }, (_, i) => {
      const { system, user } = buildVariationPrompt(
        request,
        i,
        numVariations
      );

      return generateImage(system, user, width, height)
        .then((imageUrl) => ({
          id: `poster-${Date.now()}-${i}`,
          imageUrl,
          prompt: user.slice(0, 500),
          variationIndex: i,
        }))
        .catch((err) => ({
          id: `poster-${Date.now()}-${i}`,
          imageUrl: "",
          prompt: "",
          variationIndex: i,
          error: err.message,
        }));
    });

    const results = await Promise.all(promises);
    const successful = results.filter((r) => r.imageUrl && !("error" in r));
    const errors = results.filter((r) => "error" in r);

    if (successful.length === 0) {
      const firstError =
        errors[0] && "error" in errors[0]
          ? (errors[0] as { error: string }).error
          : "All variations failed to generate";
      return NextResponse.json({ error: firstError }, { status: 500 });
    }

    return NextResponse.json({
      posters: successful,
      totalRequested: numVariations,
      totalGenerated: successful.length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
