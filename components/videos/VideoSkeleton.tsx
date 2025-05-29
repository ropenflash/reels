import { Card, CardContent } from "@/components/ui/card";

export default function VideoSkeleton() {
  return (
    <Card className="overflow-hidden shadow-md">
      <div className="relative aspect-video bg-gray-300 animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
