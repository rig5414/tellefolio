"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import Image from "next/image";
import CircularLoader from "@/components/admin/CircularLoader";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboardClient({ session }: { session: any }) {
  const { resolvedTheme } = useTheme();
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  // Backgrounds and overlays for each theme
  const bgImage =
    resolvedTheme === "light"
      ? "/images/adminbackground1.jpg"
      : "/images/adminbackground.jpg";
  const overlayColor =
    resolvedTheme === "light"
      ? "bg-blue-100/80"
      : "bg-[#232b3b]/80";
  const cardBg =
    resolvedTheme === "light"
      ? "bg-blue-50/90 border border-blue-200"
      : "bg-[#232b3b]/90 border border-[#444]";
  const accent = resolvedTheme === "light" ? "#2563eb" : "#FFC300";
  const textColor = resolvedTheme === "light" ? "text-blue-900" : "text-gray-200";

  // Logout handler
  const handleLogout = async () => {
    setShowLogout(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Themed blurred background */}
      <div className="absolute inset-0 w-full h-full z-0 transition-all duration-700">
        <Image
          src={bgImage}
          alt="Admin Background"
          fill
          priority
          className="object-cover blur-md scale-105 transition-all duration-700"
          style={{ filter: resolvedTheme === "light" ? "blur(8px) brightness(1.05)" : "blur(8px) brightness(0.7)" }}
        />
      </div>
      {/* Themed overlay */}
      <div className={`absolute inset-0 ${overlayColor} z-0 transition-all duration-700`} />
      {/* Theme toggle and logout icon */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => setShowLogout(true)}
          className="p-2 rounded-lg bg-transparent hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 text-red-600 dark:text-red-400"
          aria-label="Log out"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
      {/* Logout confirmation modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#232b3b] rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Logout</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Centered loader and dashboard content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <CircularLoader>
          <div className={`flex flex-col items-center justify-center w-full max-w-xl gap-6 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700`}>
            <h1
              className={`text-4xl font-extrabold mb-2 text-center drop-shadow ${textColor}`}
              style={{ color: accent }}
            >
              Admin Dashboard
            </h1>
            <p className={`text-lg mb-4 text-center ${textColor}`}>
              Welcome, <span className="font-semibold" style={{ color: accent }}>{session.user?.name || session.user?.email}</span>!<br />
              Manage your portfolio projects here.
            </p>
            <div className="w-full flex flex-col items-center gap-4">
              <a
                href="/admin/projects/new"
                className="block w-full text-center py-3 rounded-lg"
                style={{ background: accent, color: '#fff', fontWeight: 700, fontSize: '1.125rem', boxShadow: '0 2px 8px 0 #0002' }}
              >
                + Add New Project
              </a>
              {/* Placeholder for project list or stats */}
              <div className={`w-full mt-4 p-6 rounded-xl ${resolvedTheme === 'light' ? 'bg-blue-100 border border-blue-200 text-blue-900' : 'bg-[#232b3b] border border-[#444] text-gray-300'} text-center shadow-inner transition-all duration-700`}>
                Project list and admin tools coming soon...
              </div>
            </div>
          </div>
        </CircularLoader>
      </div>
    </div>
  );
} 