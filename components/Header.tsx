'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signIn, signOut } from "next-auth/react";

interface HeaderProps {
  onNewVideoClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Header({
  onNewVideoClick,
  search,
  onSearchChange,
}: HeaderProps) {
  const { data: session, status } = useSession();
  const isUploader =
    session?.user?.role === "ADMIN" || session?.user?.role === "UPLOADER";

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
      {/* Left Section: Search + Upload */}
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
        {session && isUploader && (
          <Button onClick={onNewVideoClick}>
            New Video
          </Button>
        )}
      </div>

      {/* Right Section: Avatar + Name + Sign In/Out */}
      <div className="flex items-center justify-between">
        {status === "loading" ? null : session ? (
          <>
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            {session.user?.name && (
              <span className="font-medium text-gray-800">{session.user.name}</span>
            )}
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button onClick={() => signIn("google")}>
            Sign In with Google
          </Button>
        )}
      </div>
    </div>
  );
}
