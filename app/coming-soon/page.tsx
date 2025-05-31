"use client";

import Link from "next/link";

export default function ComingSoon() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-600 to-purple-700 text-white px-6">
      <h1 className="text-6xl font-extrabold mb-6 tracking-wide">🚧 Coming Soon</h1>
      <p className="text-xl max-w-lg text-center mb-8">
      <p>We&apos;re working hard to bring you something amazing. Stay tuned for updates!</p>
      </p>
      <div className="flex space-x-4">
        <Link href="/" passHref>
          <div className="px-6 py-3 bg-white text-blue-700 font-semibold rounded shadow hover:bg-gray-100 transition cursor-pointer">
            Go Back Home
          </div>
        </Link>
        <a
          href="mailto:support@example.com"
          className="px-6 py-3 border border-white rounded hover:bg-white hover:text-blue-700 transition"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}
