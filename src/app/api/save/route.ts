import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

// Allow large body for base64 images
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { imageData, prompt, metadata } = body;

    if (!imageData) {
      return NextResponse.json({ error: "No image data" }, { status: 400 });
    }

    // Create date-based folder: created/{userId}/YYYY-MM-DD
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");

    // Generate filename
    const id = `poster-${dateStr}-${timeStr}-${Math.random().toString(36).slice(2, 6)}`;
    const imageFilename = `${id}.png`;
    const metaFilename = `${id}.json`;

    // Save image to Blob storage
    let imageBuffer: Buffer;
    let contentType = "image/png";
    if (imageData.startsWith("data:image")) {
      // base64 data URL
      const [header, base64] = imageData.split(",");
      const match = header?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);
      if (match?.[1]) {
        contentType = match[1];
      }
      imageBuffer = Buffer.from(base64 || "", "base64");
    } else {
      // Fetch from URL
      const res = await fetch(imageData);
      const arrayBuf = await res.arrayBuffer();
      contentType = res.headers.get("content-type") || contentType;
      imageBuffer = Buffer.from(arrayBuf);
    }

    const imagePathname = `created/${session.user.id}/${dateStr}/${imageFilename}`;
    const imageBlob = await put(imagePathname, imageBuffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    // Save metadata + prompt
    const meta = {
      id,
      filename: imageFilename,
      prompt: prompt || "",
      imageUrl: imageBlob.url,
      brief: metadata?.brief || "",
      textFields: metadata?.textFields || [],
      styleId: metadata?.styleId || "",
      remixId: metadata?.remixId || "",
      formatId: metadata?.formatId || "",
      tones: metadata?.tones || [],
      vibes: metadata?.vibes || [],
      compositionId: metadata?.compositionId || "auto",
      textureId: metadata?.textureId || "none",
      paletteId: metadata?.paletteId || "auto",
      customColors: metadata?.customColors || [],
      createdAt: now.toISOString(),
      folder: dateStr,
    };

    const metaPathname = `created/${session.user.id}/${dateStr}/${metaFilename}`;
    await put(metaPathname, JSON.stringify(meta, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      saved: true,
      id,
      path: imageBlob.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("[save]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
