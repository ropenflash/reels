import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../../../lib/prisma"; // Make sure this is a valid path

export async function DELETE(
  req: NextRequest,
  context:  { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params;

  try {
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const s3Url = new URL(video.s3Url);
    const key = decodeURIComponent(s3Url.pathname.slice(1)); // remove leading slash

    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );

    const deleted = await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("Failed to delete video:", err);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
