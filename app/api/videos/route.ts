import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../lib/prisma";

export interface VideoResource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string; // ISO date string
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  duration: number;
  // add other fields as needed
}

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  s3Url: string;
  authorName?: string | null;
  authorAvatar?: string | null;
  createdAt: Date;
  level?: string | null;
  category?: string | null;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const getThumbnailUrl = (publicId: string) =>
  cloudinary.url(publicId, {
    format: "jpg",
    transformation: [{ width: 400, height: 300, crop: "thumb" }],
  });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing courseId in query parameters" },
        { status: 400 }
      );
    }

    const result = await cloudinary.search
      .expression("resource_type:video")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const videos = await Promise.all(
      result.resources.map(async (video: VideoResource) => {
        const title = video.public_id.split("/").pop() || video.public_id;
        const videoUrl = video.secure_url;
        const thumbnailUrl = getThumbnailUrl(video.public_id);
        const createdAt = new Date(video.created_at);

        const existing = await prisma.video.findFirst({
          where: { title },
        });

        if (!existing) {
          await prisma.video.create({
            data: {
              title,
              description: null,
              category: null,
              level: "Beginner",
              s3Url: videoUrl,
              thumbnailUrl,
              authorName: "System",
              authorAvatar: "/avatars/default.png",
              createdAt,
              course: {
                connect: { id: courseId },
              },
            },
          });
        }

        return {
          title,
          s3Url: videoUrl,
          thumbnailUrl,
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
      description = null,
      category = null,
      level = null,
      s3Url,
      thumbnailUrl = null,
      authorName,
      authorAvatar = null,
      courseId,
    } = body;

    if (!title || !level || !s3Url || !authorName || !courseId) {
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
        createdAt: new Date(),
        course: {
          connect: { id: courseId },
        },
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
