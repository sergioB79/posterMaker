import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
    const folderPath = path.join(process.cwd(), "created", dateStr);

    await mkdir(folderPath, { recursive: true });

    // Generate filename
    const id = `poster-${dateStr}-${timeStr}-${Math.random().toString(36).slice(2, 6)}`;
    const imageFilename = `${id}.png`;
    const metaFilename = `${id}.json`;

    // Save image
    let imageBuffer: Buffer;
    if (imageData.startsWith("data:image")) {
      // base64 data URL
      const base64 = imageData.split(",")[1];
      imageBuffer = Buffer.from(base64, "base64");
    } else {
      // Fetch from URL
      const res = await fetch(imageData);
      const arrayBuf = await res.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuf);
    }

    await writeFile(path.join(folderPath, imageFilename), imageBuffer);

    // Save metadata + prompt
    const meta = {
      id,
      filename: imageFilename,
      prompt: prompt || "",
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

    await writeFile(
      path.join(folderPath, metaFilename),
      JSON.stringify(meta, null, 2)
    );

    return NextResponse.json({
      saved: true,
      id,
      path: `/created/${dateStr}/${imageFilename}`,
      metaPath: `/created/${dateStr}/${metaFilename}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("[save]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
