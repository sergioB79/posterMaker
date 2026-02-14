import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { checkCredits, deductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { buildVariationPrompt, type PosterRequest } from "@/lib/prompt-builder";
import { put } from "@vercel/blob";

// Uses gpt-image-1 — much better at rendering text on posters than DALL-E 3.
// Set your API key env var in .env.local: PosterMaker_OPENAI_API_KEY

export const runtime = "nodejs";

async function generateImage(
  system: string,
  userPrompt: string,
  width: number,
  height: number
): Promise<string> {
  const apiKey = (
    process.env.PosterMaker_OPENAI_API_KEY ||
    process.env.POSTER_API_KEY ||
    process.env.OPENAI_API_KEY
  )?.trim();

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
    return `data:image/png;base64,${result.b64_json}`;
  }
  if (result?.url) {
    return result.url;
  }

  throw new Error("No image data in response");
}

async function savePosterToDisk(params: {
  userId: string;
  imageData: string;
  prompt: string;
  brief: string;
  textFields: PosterRequest["textFields"];
  styleId: string;
  remixId: string;
  formatId: string;
  tones: string[];
  vibes: string[];
  compositionId: string;
  textureId: string;
  paletteId: string;
  customColors: string[];
}) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const id = `poster-${dateStr}-${timeStr}-${Math.random().toString(36).slice(2, 6)}`;
  const imageFilename = `${id}.png`;
  const metaFilename = `${id}.json`;

  let imageBuffer: Buffer;
  let contentType = "image/png";
  if (params.imageData.startsWith("data:image")) {
    const [header, base64] = params.imageData.split(",");
    const match = header?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);
    if (match?.[1]) {
      contentType = match[1];
    }
    imageBuffer = Buffer.from(base64 || "", "base64");
  } else {
    const res = await fetch(params.imageData);
    const arrayBuf = await res.arrayBuffer();
    contentType = res.headers.get("content-type") || contentType;
    imageBuffer = Buffer.from(arrayBuf);
  }

  const imagePathname = `created/${params.userId}/${dateStr}/${imageFilename}`;
  const imageBlob = await put(imagePathname, imageBuffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });

  const meta = {
    id,
    filename: imageFilename,
    imageUrl: imageBlob.url,
    prompt: params.prompt || "",
    brief: params.brief || "",
    textFields: params.textFields || [],
    styleId: params.styleId || "",
    remixId: params.remixId || "",
    formatId: params.formatId || "",
    tones: params.tones || [],
    vibes: params.vibes || [],
    compositionId: params.compositionId || "auto",
    textureId: params.textureId || "none",
    paletteId: params.paletteId || "auto",
    customColors: params.customColors || [],
    createdAt: now.toISOString(),
    folder: dateStr,
  };

  const metaPathname = `created/${params.userId}/${dateStr}/${metaFilename}`;
  await put(metaPathname, JSON.stringify(meta, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return { id, imageUrl: imageBlob.url };
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in to generate posters" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as PosterRequest & {
      variations?: number;
    };

    const {
      brief,
      textFields,
      styleId,
      remixId,
      formatId,
      tones,
      vibes,
      compositionId,
      textureId,
      paletteId,
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
      remixId: remixId || "",
      formatId: formatId || "a4-portrait",
      tones: tones || [],
      vibes: vibes || [],
      compositionId: compositionId || "auto",
      textureId: textureId || "none",
      paletteId: paletteId || "auto",
      customColors,
    };

    const numVariations = Math.min(body.variations || 4, 6);

    // Credit check — 1 credit per image
    const { ok, credits } = await checkCredits(session.user.id, numVariations);
    if (!ok) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You have ${credits} but need ${numVariations}. Buy more credits or reduce variations.`,
          credits,
        },
        { status: 402 }
      );
    }

    const { formats } = await import("@/data/styles");
    const format = formats.find((f) => f.id === request.formatId);
    const width = format?.width || 2480;
    const height = format?.height || 3508;

    // Record generation in database
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        prompt: brief,
        brief,
        styleId: request.styleId,
        formatId: request.formatId,
        images: numVariations,
        credits: numVariations,
      },
    });

    // Deduct credits upfront
    await deductCredits(session.user.id, numVariations, generation.id);

    // Generate variations sequentially to avoid rate limits
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
        const saved = await savePosterToDisk({
          userId: session.user.id,
          imageData: imageUrl,
          prompt: user,
          brief: request.brief,
          textFields: request.textFields,
          styleId: request.styleId,
          remixId: request.remixId || "",
          formatId: request.formatId,
          tones: request.tones || [],
          vibes: request.vibes || [],
          compositionId: request.compositionId || "auto",
          textureId: request.textureId || "none",
          paletteId: request.paletteId || "auto",
          customColors: request.customColors || [],
        });
        posters.push({
          id: saved.id,
          imageUrl: saved.imageUrl,
          prompt: user.slice(0, 500),
          variationIndex: i,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`[generate] Variation ${i} failed:`, msg);
        errors.push(msg);
      }
    }

    // No refunds for failed variations — credits are consumed on generation attempt
    const failedCount = numVariations - posters.length;
    if (failedCount > 0) {
      console.log(`[generate] ${failedCount} variation(s) failed — no refund`);
    }

    if (posters.length === 0) {
      return NextResponse.json(
        { error: errors[0] || "All variations failed to generate. Credits have been consumed." },
        { status: 500 }
      );
    }

    // Get updated credit balance
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      posters,
      totalRequested: numVariations,
      totalGenerated: posters.length,
      creditsRemaining: updatedUser?.credits ?? 0,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
