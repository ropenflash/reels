"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get session and extract user role
    getSession().then((session) => {
      if (session?.user?.role) {
        setRole(session.user.role);
      }
    });
  }, []);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Jump Rope", path: "/jump-rope" },
    { label: "Calisthenics", path: "/calisthenics" },
    { label: "Breaking", path: "/coming-soon" },
    { label: "Watch Later", path: "/coming-soon" },
    ...(role === "ADMIN"
      ? [{ label: "Admin Panel", path: "/admin/users", admin: true }]
      : []),
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false); // close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Hamburger button - visible on mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded"
        aria-label={open ? "Close menu" : "Open menu"}
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
        <h1
          className="text-2xl font-bold text-blue-500 mb-6 cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          RopeNflash
        </h1>
        <nav className="space-y-4" aria-label="Primary navigation">
          {menuItems.map(({ label, path, admin }, index) => (
            <div
              key={index}
              onClick={() => handleNavigate(path)}
              className={clsx(
                "font-semibold cursor-pointer transition",
                admin ? "text-yellow-400 hover:text-yellow-300" : "hover:text-blue-400"
              )}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavigate(path);
                }
              }}
            >
              {label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
