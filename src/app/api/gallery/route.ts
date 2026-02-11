import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "created/", limit: 1000 });
    const metaBlobs = blobs.filter((b) => b.pathname.endsWith(".json"));

    const allPosters: Array<{
      id: string;
      filename: string;
      prompt: string;
      brief: string;
      styleId: string;
      influenceIds: string[];
      tones: string[];
      formatId: string;
      createdAt: string;
      folder: string;
      imagePath: string;
    }> = [];

    const dateFolders = new Set<string>();
    for (const blob of metaBlobs) {
      try {
        const res = await fetch(blob.url);
        const meta = await res.json();
        if (meta?.folder) {
          dateFolders.add(meta.folder);
        }
        allPosters.push({
          ...meta,
          imagePath: meta.imageUrl || meta.imagePath || "",
        });
      } catch {
        // Skip corrupted metadata
      }
    }

    // Sort by createdAt descending
    allPosters.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      posters: allPosters,
      folders: Array.from(dateFolders).sort().reverse(),
      total: allPosters.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gallery read failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
