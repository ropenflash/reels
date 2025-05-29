// app/api/videos/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // update path as needed
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // Step 1: Get video record to extract the S3 key
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Step 2: Parse key from S3 URL (assuming it ends with the key)
    const s3Url = new URL(video.s3Url);
    const key = decodeURIComponent(s3Url.pathname.slice(1)); // remove leading `/`

    // Step 3: Delete file from S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );

    // Step 4: Delete record from DB
    const deleted = await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("Failed to delete video:", err);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
