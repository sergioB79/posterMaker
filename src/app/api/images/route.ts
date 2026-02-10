import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const filePath = url.searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Security: only allow files from the created directory
  const safePath = path.normalize(filePath).replace(/^[/\\]+/, "");
  if (!safePath.startsWith("created") || safePath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 403 });
  }

  const fullPath = path.join(process.cwd(), safePath);

  try {
    await stat(fullPath);
    const buffer = await readFile(fullPath);

    const ext = path.extname(fullPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
