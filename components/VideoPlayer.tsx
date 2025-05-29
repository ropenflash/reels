// components/VideoPlayer.tsx
"use client";

import { useRef } from "react";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, thumbnail }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full max-w-sm mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        controls
        poster={thumbnail}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
