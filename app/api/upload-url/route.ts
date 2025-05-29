import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("fileName");
    const fileType = url.searchParams.get("fileType") || "video/mp4";

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName query parameter" }, { status: 400 });
    }

    const key = `videos/${fileName}`;

    // Generate presigned PUT URL
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: 60 * 5 }); // 5 minutes

    // Generate presigned GET URL for fetching the video later
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });
    const downloadUrl = await getSignedUrl(s3, getCommand, { expiresIn: 60 * 60 }); // 1 hour

    return NextResponse.json({ uploadUrl, downloadUrl, key });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json({ error: "Failed to generate presigned URLs" }, { status: 500 });
  }
}
