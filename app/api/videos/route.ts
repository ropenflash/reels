import { NextResponse, NextRequest } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "../../lib/prisma"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const getThumbnailUrl = (videoUrl: string) => {
  const baseUrl = videoUrl.split("?")[0];
  const fileName = baseUrl.split("/").pop()!;
  const thumbnailFileName = fileName.replace(/\.(mp4|mov)$/i, ".jpg");
  return videoUrl.replace(fileName, `thumbnails/${thumbnailFileName}`);
};

export async function GET() {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET!,
    });

    const listResponse = await s3.send(listCommand);
    const supportedExtensions = [".mp4", ".mov"];

    const videos = await Promise.all(
      (listResponse.Contents || [])
        .filter(
          (obj) =>
            obj.Key &&
            supportedExtensions.some((ext) => obj.Key!.toLowerCase().endsWith(ext))
        )
        .map(async (obj) => {
          const key = obj.Key!;
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET!,
              Key: key,
            }),
            { expiresIn: 3600 }
          );

          const fileName = key.split("/").pop()!;
          const title = fileName.replace(/\.(mp4|mov)$/i, "");
          const createdAt = obj.LastModified || new Date();

          const existing = await prisma.video.findFirst({
            where: { title },
          });

          if (!existing) {
            await prisma.video.create({
              data: {
                title,
                description: "No description",
                category: null,
                level: "Beginner", // default/fallback
                s3Url: signedUrl,
                thumbnailUrl: getThumbnailUrl(signedUrl),
                authorName: "System",
                authorAvatar: "/avatars/default.png",
                createdAt: createdAt,
              },
            });
          }

          return {
            title,
            s3Url: signedUrl,
            thumbnailUrl: getThumbnailUrl(signedUrl),
          };
        })
    );

    return NextResponse.json({ success: true, videos });
  } catch (err) {
    console.error("Failed to fetch or save videos:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      category,
      level,
      s3Url,
      thumbnailUrl,
      authorName,
      authorAvatar,
    } = body;

    // Validate required fields
    if (!title || !level || !s3Url || !authorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        category,
        level,
        s3Url,
        thumbnailUrl,
        authorName,
        authorAvatar,
        // rating: typeof rating === "number" ? rating : 0, // ✅ initialize to 0 if not provided
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    console.error("Failed to create video:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
