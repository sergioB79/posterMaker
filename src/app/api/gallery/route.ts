import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const createdDir = path.join(process.cwd(), "created");

    // Check if created folder exists
    try {
      await stat(createdDir);
    } catch {
      return NextResponse.json({ posters: [], folders: [] });
    }

    // Read date folders
    const entries = await readdir(createdDir, { withFileTypes: true });
    const dateFolders = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
      .reverse(); // newest first

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

    for (const folder of dateFolders) {
      const folderPath = path.join(createdDir, folder);
      const files = await readdir(folderPath);
      const jsonFiles = files.filter((f) => f.endsWith(".json"));

      for (const jsonFile of jsonFiles) {
        try {
          const raw = await readFile(path.join(folderPath, jsonFile), "utf-8");
          const meta = JSON.parse(raw);
          allPosters.push({
            ...meta,
            imagePath: `/api/images?path=created/${folder}/${meta.filename}`,
          });
        } catch {
          // Skip corrupted metadata
        }
      }
    }

    // Sort by createdAt descending
    allPosters.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      posters: allPosters,
      folders: dateFolders,
      total: allPosters.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gallery read failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
