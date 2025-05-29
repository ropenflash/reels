'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  X as Close,
  // Star,
  Trash,
  // Eye,
  // ThumbsUp,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import clsx from 'clsx';

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
  level:string;
  // likes:string;
  // rating:number;
  // views: number;
}

interface Props {
  video: Video;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
}

const badgeColors: Record<string, string> = {
  Beginner: 'bg-green-200 text-green-800',
  Intermediate: 'bg-yellow-200 text-yellow-800',
  Advanced: 'bg-red-200 text-red-800',
};

export default function VideoCard({ video, isPlaying, onPlay, onDelete }: Props) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/watch/${video.id}`
      : '';

  useEffect(() => {
    if (isPlaying && !hasViewed) {
      setHasViewed(true);
      fetch(`/api/videos/${video.id}/view`, { method: 'POST' }).catch(console.error);
    }
  }, [isPlaying, hasViewed, video.id]);

  // const renderStars = (rating: number) => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //     <Star
  //       key={i}
  //       size={14}
  //       className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
  //       fill={i < rating ? 'currentColor' : 'none'}
  //     />
  //   ));
  // };

  return (
    <Card className="overflow-hidden relative group hover:scale-[1.02] transition-transform shadow-lg rounded-2xl bg-white">
      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 z-10 bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-full p-1 hidden group-hover:block"
        title="Delete Video"
      >
        <Trash size={16} />
      </button>

      {/* Thumbnail / Video */}
      <div className="relative aspect-video bg-gray-200 cursor-pointer" onClick={onPlay}>
        {video.thumbnailUrl && !isPlaying ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <video
            src={video.s3Url}
            controls={isPlaying}
            autoPlay
            loop={!isPlaying}
            muted={!isPlaying}
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </span>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="font-semibold text-sm truncate">{video.title}</div>
          {video.category && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">
              {video.category}
            </span>
          )}
        </div>

        {video.description && (
          <p className="text-xs text-gray-700 line-clamp-2">{video.description}</p>
        )}

        <div className="flex items-center text-xs text-gray-600 gap-2">
          <span
            className={clsx(
              'inline-block text-xs font-medium px-2 py-1 rounded',
              badgeColors[video.level] || 'bg-gray-200 text-gray-800'
            )}
          >
            {video.level}
          </span>

          {/* <div className="flex items-center gap-1">
            <span className="mr-1">Rating:</span>
            {renderStars(video.rating || 0)}
          </div> */}
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Avatar className="h-6 w-6">
            <AvatarImage src={video.avatar} />
          </Avatar>
          <span>{video.author}</span>
          <span>• {video.time}</span>
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-600">
          {/* <span className="flex items-center gap-1">
            <ThumbsUp size={14} /> {video.likes}
          </span> */}
          {/* <span className="flex items-center gap-1">
            <MessageCircle size={14} /> {video.comments?.length ?? 0}
          </span> */}
          {/* <span className="flex items-center gap-1">
            <Eye size={14} /> {video.views}
          </span> */}

          {/* Share */}
          <div className="relative">
            <button onClick={() => setShowShareOptions(!showShareOptions)}>
              {showShareOptions ? <Close size={14} /> : <Share2 size={14} />}
            </button>

            {showShareOptions && (
              <div className="absolute right-0 bottom-6 bg-white border rounded-md shadow-lg p-2 z-10 flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(video.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Twitter"
                >
                  <Twitter size={16} className="text-blue-500 hover:scale-110" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                >
                  <Facebook size={16} className="text-blue-700 hover:scale-110" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    shareUrl
                  )}&title=${encodeURIComponent(video.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={16} className="text-blue-600 hover:scale-110" />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${video.title} ${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp size={16} className="text-green-500 hover:scale-110" />
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
