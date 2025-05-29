import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const videos = await prisma.video.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: { comments: true },
    });

    return NextResponse.json(videos);
  } catch (err) {
    console.error("Failed to fetch videos from DB:", err);
    return NextResponse.json({ error: "Failed to fetch from DB" }, { status: 500 });
  }
}
