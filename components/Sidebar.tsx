"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button - visible on mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static top-0 left-0 h-full w-64 bg-black text-white p-4 space-y-6 transition-transform z-40",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <h1 className="text-2xl font-bold text-blue-500 mb-6">RopeNflash</h1>
        <nav className="space-y-4">
          <div className="font-semibold cursor-pointer">Home</div>
          {/* <div className="cursor-pointer">My Videos</div>
          <div className="cursor-pointer">
            <Clock className="inline mr-2" size={16} /> History
          </div>
          <div className="cursor-pointer">
            <Share className="inline mr-2" size={16} /> Shared Video
          </div>
          <div className="cursor-pointer">
            <Clock className="inline mr-2" size={16} /> Watch Later
          </div>
          <div className="cursor-pointer">
            <Trash className="inline mr-2" size={16} /> Trash
          </div>
          <div className="cursor-pointer">Settings</div>
          <div className="flex justify-between items-center cursor-pointer">
            Teams <span className="bg-blue-500 rounded-full px-2">15</span>
          </div> */}
        </nav>
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
