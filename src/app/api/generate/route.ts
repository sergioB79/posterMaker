import { NextRequest, NextResponse } from "next/server";
import { buildVariationPrompt, type PosterRequest } from "@/lib/prompt-builder";

// Uses gpt-image-1 — much better at rendering text on posters than DALL-E 3.
// Set your API key env var in .env.local (default: OPENAI_API_KEY, or override with POSTER_API_KEY)

async function generateImage(
  system: string,
  userPrompt: string,
  width: number,
  height: number
): Promise<string> {
  const apiKey = (process.env.POSTER_API_KEY || process.env.OPENAI_API_KEY)?.trim();

  if (!apiKey) {
    throw new Error(
      "No API key configured. Set POSTER_API_KEY or OPENAI_API_KEY in .env.local."
    );
  }

  const fullPrompt = `${system}\n\n${userPrompt}`;

  // gpt-image-1 supports: 1024x1024, 1024x1536, 1536x1024, auto
  let size: string = "1024x1024";
  const ratio = width / height;
  if (ratio > 1.2) {
    size = "1536x1024";
  } else if (ratio < 0.8) {
    size = "1024x1536";
  }

  console.log(`[generate] Using gpt-image-1, size: ${size}, prompt length: ${fullPrompt.length}`);

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt.slice(0, 32000),
      n: 1,
      size,
      quality: "high",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Image generation failed: ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const result = data.data?.[0];

  // gpt-image-1 returns b64_json by default
  if (result?.b64_json) {
    return `data:image/png;base64,${result.b64_json}`;
  }
  // Fallback to URL if available
  if (result?.url) {
    return result.url;
  }

  throw new Error("No image data in response");
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
      tones,
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
      tones: tones || [],
      colorMode,
      customColors,
    };

    const numVariations = Math.min(body.variations || 4, 6);

    const { formats } = await import("@/data/styles");
    const format = formats.find((f) => f.id === request.formatId);
    const width = format?.width || 2480;
    const height = format?.height || 3508;

    // Generate variations — sequentially to avoid rate limits with gpt-image-1
    const posters: Array<{
      id: string;
      imageUrl: string;
      prompt: string;
      variationIndex: number;
    }> = [];
    const errors: string[] = [];

    for (let i = 0; i < numVariations; i++) {
      const { system, user } = buildVariationPrompt(request, i, numVariations);

      try {
        const imageUrl = await generateImage(system, user, width, height);
        posters.push({
          id: `poster-${Date.now()}-${i}`,
          imageUrl,
          prompt: user.slice(0, 500),
          variationIndex: i,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`[generate] Variation ${i} failed:`, msg);
        errors.push(msg);
      }
    }

    if (posters.length === 0) {
      return NextResponse.json(
        { error: errors[0] || "All variations failed to generate" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posters,
      totalRequested: numVariations,
      totalGenerated: posters.length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
