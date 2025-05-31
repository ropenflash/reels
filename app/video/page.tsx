import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";
import { prisma } from "../lib/prisma";

export default async function VideoPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">
          You must be signed in to view this page.
        </p>
      </div>
    );
  }

  const payment = await prisma.payment.findFirst({
    where: {
      email: session.user.email,  // guaranteed string now
      verified: true,
    },
  });

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <p className="text-yellow-600 text-lg font-semibold mb-4">
          Access denied. Please make a payment to watch this video.
        </p>
        <a
          href="/payment"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Payment Page
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow-md mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Enjoy your video 🎬
      </h1>
      <div className="aspect-w-16 aspect-h-9">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
          preload="metadata"
        >
          <source src="https://your-cloudinary-url/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
