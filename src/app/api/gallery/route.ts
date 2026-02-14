import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));

    // List only this user's blobs
    const userPrefix = `created/${session.user.id}/`;
    const { blobs } = await list({ prefix: userPrefix, limit: 1000 });
    const metaBlobs = blobs.filter((b) => b.pathname.endsWith(".json"));

    // Sort by blob uploadedAt descending (avoids fetching all JSON just to sort)
    metaBlobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    // Paginate
    const total = metaBlobs.length;
    const totalPages = Math.ceil(total / limit);
    const pagedBlobs = metaBlobs.slice((page - 1) * limit, page * limit);

    // Fetch metadata in parallel for current page only
    const results = await Promise.allSettled(
      pagedBlobs.map(async (blob) => {
        const res = await fetch(blob.url);
        return res.json();
      })
    );

    const posters: Record<string, unknown>[] = [];
    const dateFolders = new Set<string>();

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const meta = r.value as Record<string, unknown>;
      posters.push({
        ...meta,
        imagePath: meta.imageUrl || meta.imagePath || "",
      });
      if (meta.folder) dateFolders.add(meta.folder as string);
    }

    return NextResponse.json({
      posters,
      folders: Array.from(dateFolders).sort().reverse(),
      total,
      page,
      totalPages,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gallery read failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
