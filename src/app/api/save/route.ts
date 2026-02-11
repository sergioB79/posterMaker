import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Allow large body for base64 images
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageData, prompt, metadata } = body;

    if (!imageData) {
      return NextResponse.json({ error: "No image data" }, { status: 400 });
    }

    // Create date-based folder: created/YYYY-MM-DD
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

    const imagePathname = `created/${dateStr}/${imageFilename}`;
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
      influenceIds: metadata?.influenceIds || [],
      tones: metadata?.tones || [],
      formatId: metadata?.formatId || "",
      colorMode: metadata?.colorMode || "auto",
      customColors: metadata?.customColors || [],
      createdAt: now.toISOString(),
      folder: dateStr,
    };

    const metaPathname = `created/${dateStr}/${metaFilename}`;
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
