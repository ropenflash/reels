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
}
