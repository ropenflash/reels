"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModel";
import VideoGrid from "@/components/videos/VideoGrid";

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
  level: string;
}

export default function CalisthenicsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch videos with category = 'rope jumping' on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Add category filter as query param
      const res = await fetch(`/api/videos/db?search=calisthenics`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      await fetch(`/api/videos/${confirmDeleteId}`, { method: "DELETE" });
      setVideos((prev) => prev.filter((v) => v.id !== confirmDeleteId));
    } catch (err) {
      console.log("Error deleting video.", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <main className="flex-1 bg-gray-100 p-4 md:p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Calisthenics Videos</h1>

        <VideoGrid
          videos={videos}
          loading={loading}
          playingIndex={playingIndex}
          onPlay={setPlayingIndex}
          onDelete={setConfirmDeleteId}
        />

        {!loading && videos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No Calisthenics videos found.</p>
        )}

        <ConfirmModal
          isOpen={!!confirmDeleteId}
          title="Confirm Delete"
          message="Are you sure you want to delete this video?"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </main>
    </div>
  );
}
