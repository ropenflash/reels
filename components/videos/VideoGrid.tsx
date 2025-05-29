import VideoCard from "./VideoCard";
import VideoSkeleton from "./VideoSkeleton";
import { Video } from "@/types";

interface Props {
  videos: Video[];
  loading: boolean;
  playingIndex: number | null;
  onPlay: (index: number) => void;
  onDelete: (id: string) => void;
}

export default function VideoGrid({ videos, loading, playingIndex, onPlay, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)
        : videos.map((video, idx) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingIndex === idx}
              onPlay={() => onPlay(idx)}
              onDelete={() => onDelete(video.id)}
            />
          ))}
    </div>
  );
}
