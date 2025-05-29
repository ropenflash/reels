import { prisma } from "../../../lib/prisma"; // adjust path as needed
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const videoId = params.id;

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ message: "View recorded" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update views:", error);
    return NextResponse.json({ error: "Error updating view count" }, { status: 500 });
  }
}
