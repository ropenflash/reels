'use client';

import { useState } from 'react';

const uploadFileWithProgress = (
  file: File,
  url: string,
  onProgress: (percent: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.open('POST', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url); // Cloudinary's final hosted file URL
      } else {
        reject(new Error(`Upload failed with ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload error'));
    xhr.send(formData);
  });
};

export default function UploadForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    s3Url: '', // Will be used to store cloudinary video URL
    thumbnailUrl: '',
    authorName: '',
    authorAvatar: '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [progress, setProgress] = useState({ video: 0, thumbnail: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0] || null;
    if (type === 'video') setVideoFile(file);
    else setThumbnailFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, type: 'video' | 'thumbnail') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (type === 'video') setVideoFile(file);
    else setThumbnailFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      setMessage('Both video and thumbnail files are required.');
      return;
    }

    setLoading(true);
    setProgress({ video: 0, thumbnail: 0 });
    setMessage('');

    try {
      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

      const videoPublicUrl = await uploadFileWithProgress(videoFile, cloudinaryUploadUrl, (p) =>
        setProgress((prev) => ({ ...prev, video: p }))
      );

      const thumbPublicUrl = await uploadFileWithProgress(thumbnailFile, cloudinaryUploadUrl, (p) =>
        setProgress((prev) => ({ ...prev, thumbnail: p }))
      );

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          s3Url: videoPublicUrl, // Still using s3Url field in schema — can rename to cloudinaryUrl
          thumbnailUrl: thumbPublicUrl,
        }),
      });

      if (!res.ok) throw new Error('DB save error');

      setMessage('Upload complete!');
      setVideoFile(null);
      setThumbnailFile(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        s3Url: '',
        thumbnailUrl: '',
        authorName: '',
        authorAvatar: '',
      });
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
        console.error("Upload error:", err.message);
      } else {
        console.error("Unknown upload error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded space-y-4">
      <h2 className="text-2xl font-semibold">Upload Video</h2>

      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" />
      <select name="level" value={formData.level} onChange={handleChange} className="w-full p-2 border rounded">
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      {/* Video Upload */}
      <div onDrop={(e) => handleFileDrop(e, 'video')} onDragOver={(e) => e.preventDefault()} className="p-6 border-2 border-dashed rounded text-center">
        <p>{videoFile ? videoFile.name : 'Drag & drop a video or click to choose'}</p>
        <input type="file" accept="video/*" onChange={(e) => handleFileInput(e, 'video')} className="hidden" id="videoInput" />
        <label htmlFor="videoInput" className="text-blue-600 underline cursor-pointer">Choose Video</label>
      </div>

      {progress.video > 0 && (
        <div className="w-full bg-gray-200 rounded">
          <div className="bg-blue-600 text-xs text-white text-center p-1 rounded" style={{ width: `${progress.video}%` }}>{progress.video}%</div>
        </div>
      )}

      {/* Thumbnail Upload */}
      <div onDrop={(e) => handleFileDrop(e, 'thumbnail')} onDragOver={(e) => e.preventDefault()} className="p-6 border-2 border-dashed rounded text-center">
        <p>{thumbnailFile ? thumbnailFile.name : 'Drag & drop a thumbnail or click to choose'}</p>
        <input type="file" accept="image/*" onChange={(e) => handleFileInput(e, 'thumbnail')} className="hidden" id="thumbInput" />
        <label htmlFor="thumbInput" className="text-blue-600 underline cursor-pointer">Choose Thumbnail</label>
      </div>

      {progress.thumbnail > 0 && (
        <div className="w-full bg-gray-200 rounded">
          <div className="bg-green-600 text-xs text-white text-center p-1 rounded" style={{ width: `${progress.thumbnail}%` }}>{progress.thumbnail}%</div>
        </div>
      )}

      <input name="authorName" placeholder="Author Name" value={formData.authorName} onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="authorAvatar" placeholder="Author Avatar URL" value={formData.authorAvatar} onChange={handleChange} className="w-full p-2 border rounded" />

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p className={`text-sm ${message.toLowerCase().includes('fail') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
      )}
    </form>
  );
}
