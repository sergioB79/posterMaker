import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public — anyone can browse shared posters
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "24")));
    const skip = (page - 1) * limit;

    const [posters, total] = await Promise.all([
      prisma.sharedPoster.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          imageUrl: true,
          brief: true,
          styleId: true,
          formatId: true,
          influenceIds: true,
          tones: true,
          authorName: true,
          createdAt: true,
        },
      }),
      prisma.sharedPoster.count(),
    ]);

    return NextResponse.json({
      posters,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load showcase";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Authenticated — share a poster to the showcase
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, brief, styleId, formatId, influenceIds, tones } = await req.json();

    if (!imageUrl || !brief) {
      return NextResponse.json({ error: "Image URL and brief are required" }, { status: 400 });
    }

    // Prevent duplicate shares of the same image
    const existing = await prisma.sharedPoster.findFirst({
      where: { userId: session.user.id, imageUrl },
    });
    if (existing) {
      return NextResponse.json({ error: "Already shared", id: existing.id }, { status: 409 });
    }

    const shared = await prisma.sharedPoster.create({
      data: {
        userId: session.user.id,
        imageUrl,
        brief,
        styleId: styleId || null,
        formatId: formatId || null,
        influenceIds: influenceIds || [],
        tones: tones || [],
        authorName: session.user.name || "Anonymous",
      },
    });

    return NextResponse.json({ id: shared.id, shared: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to share poster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Authenticated — remove a poster from showcase
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Poster ID required" }, { status: 400 });
    }

    // Only allow deleting own shared posters
    await prisma.sharedPoster.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ removed: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove poster";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
