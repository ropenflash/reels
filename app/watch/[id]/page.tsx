// app/watch/[id]/page.tsx
import { prisma } from "../../lib/prisma"; // adjust to your path
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer"; // create this component

interface WatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const {id}= await params;
  const video = await prisma.video.findUnique({
    where: {
      id
    },
  });

  if (!video) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">{video.title}</h1>
      <VideoPlayer src={video.s3Url} thumbnail={video.thumbnailUrl || ""} />
      <p className="mt-4 text-gray-700">{video.description}</p>
    </div>
  );
}
