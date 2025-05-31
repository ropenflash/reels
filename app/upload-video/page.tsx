// app/upload-video/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../utils/authOptions";
// import UploadForm from "../../components/UploadForm";

export default async function UploadVideoPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    // Show a message or redirect (redirect on server requires next/navigation)
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied - Admins only</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      {/* <UploadForm /> */}
    </main>
  );
}
