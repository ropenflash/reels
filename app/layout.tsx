'use client'; // <-- Important for using hooks like useState/useRouter

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./Providers";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push("/upload-video");
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar for desktop */}
            <aside className="hidden sm:block w-64 bg-white border-r shadow-sm">
              <Sidebar />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden="true"
                />
                <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg z-50">
                  <Sidebar />
                </aside>
              </>
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col ml-0 sm:ml-4 sm:mt-4">
              {/* Header with toggle button */}
              <header className="h-16 bg-white border-b shadow-sm pt-4 px-6 flex items-center justify-between">
                <Header
                  onNewVideoClick={handleClick}
                  search=""
                  onSearchChange={() => {}}
                />

                {/* Mobile menu button */}
                <button
                  className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <svg
                    className="h-6 w-6 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </header>

              {/* Page content */}
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
