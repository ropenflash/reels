import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../lib/prisma";


export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  s3Url: string;
  avatar?: string;
  author?: string;
  time?: string;
  duration: string;
  difficulty?: number; // 1-5
  category?: string;
  public_id: string;
  secure_url: string;
  created_at: string;
}


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const getThumbnailUrl = (publicId: string) => {
  return cloudinary.url(`${publicId}.jpg`, {
    transformation: [{ width: 400, height: 300, crop: "thumb" }],
  });
};

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("resource_type:video")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const videos = await Promise.all(
      result.resources.map(async (video: Video) => {
        const title = video.public_id.split("/").pop()!;
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
              description: "No description",
              category: null,
              level: "Beginner", // default
              s3Url: videoUrl, // optional: rename this field to `cloudinaryUrl` in your DB schema
              thumbnailUrl,
              authorName: "System",
              authorAvatar: "/avatars/default.png",
              createdAt,
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
      description,
      category,
      level,
      s3Url, // rename this to cloudinaryUrl if you update your DB schema
      thumbnailUrl,
      authorName,
      authorAvatar,
    } = body;

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
        s3Url, // consider renaming to `cloudinaryUrl`
        thumbnailUrl,
        authorName,
        authorAvatar,
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
