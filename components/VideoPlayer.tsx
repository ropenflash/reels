'use client';

import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, thumbnail }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const isCloudinary = src.includes('res.cloudinary.com');
  const optimizedSrc = isCloudinary
    ? src.replace('/upload/', '/upload/f_auto,q_auto/')
    : src;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setIsLoading(false);
      video.volume = volume;
      video.muted = isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [isMuted, volume]);

  return (
    <div
      className="relative w-full max-w-sm mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-lg group"
      onClick={togglePlay}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={optimizedSrc}
        className="w-full h-full object-cover"
        muted={isMuted}
        loop
        preload="metadata"
        playsInline
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${progress}%` }} />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-12 right-3 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Volume Control */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="absolute bottom-6 right-3 w-24"
      />

      {/* Time Info */}
      <div className="absolute bottom-2 left-3 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <Loader2 className="animate-spin text-white w-8 h-8" />
        </div>
      )}

      {/* Overlay Play Icon */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:opacity-0 transition-opacity">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;