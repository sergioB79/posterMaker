import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { buildVariationPrompt, type PosterRequest } from "@/lib/prompt-builder";

// Uses gpt-image-1 — much better at rendering text on posters than DALL-E 3.

async function generateImage(
  system: string,
  userPrompt: string,
  width: number,
  height: number
): Promise<{ b64: string; url?: string }> {
  const apiKey = (process.env.PosterMaker_OPENAI_API_KEY || process.env.POSTER_API_KEY || process.env.OPENAI_API_KEY)?.trim();

  if (!apiKey) {
    throw new Error(
      "No API key configured. Set PosterMaker_OPENAI_API_KEY in .env.local."
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

  if (result?.b64_json) {
    return { b64: result.b64_json };
  }
  if (result?.url) {
    return { url: result.url, b64: "" };
  }

  throw new Error("No image data in response");
}

async function saveToFile(
  b64: string,
  prompt: string,
  metadata: Record<string, unknown>
): Promise<{ id: string; imagePath: string }> {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const folderPath = path.join(process.cwd(), "created", dateStr);

  await mkdir(folderPath, { recursive: true });

  const id = `poster-${dateStr}-${timeStr}-${Math.random().toString(36).slice(2, 6)}`;
  const imageFilename = `${id}.png`;
  const metaFilename = `${id}.json`;

  // Save image
  const imageBuffer = Buffer.from(b64, "base64");
  await writeFile(path.join(folderPath, imageFilename), imageBuffer);

  // Save metadata
  const meta = {
    id,
    filename: imageFilename,
    prompt,
    ...metadata,
    createdAt: now.toISOString(),
    folder: dateStr,
  };
  await writeFile(
    path.join(folderPath, metaFilename),
    JSON.stringify(meta, null, 2)
  );

  return {
    id,
    imagePath: `/api/images?path=created/${dateStr}/${imageFilename}`,
  };
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

    // Generate variations sequentially to avoid rate limits
    const posters: Array<{
      id: string;
      imageUrl: string;
      prompt: string;
      variationIndex: number;
    }> = [];
    const errors: string[] = [];

    const metadata = {
      brief,
      styleId: request.styleId,
      influenceIds: request.influenceIds,
      tones: request.tones || [],
      formatId: request.formatId,
    };

    for (let i = 0; i < numVariations; i++) {
      const { system, user } = buildVariationPrompt(request, i, numVariations);

      try {
        const result = await generateImage(system, user, width, height);

        if (result.b64) {
          // Auto-save to disk and return file path (not base64)
          const saved = await saveToFile(result.b64, user, metadata);
          posters.push({
            id: saved.id,
            imageUrl: saved.imagePath,
            prompt: user,
            variationIndex: i,
          });
          console.log(`[generate] Variation ${i} saved: ${saved.id}`);
        } else if (result.url) {
          posters.push({
            id: `poster-${Date.now()}-${i}`,
            imageUrl: result.url,
            prompt: user,
            variationIndex: i,
          });
        }
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
