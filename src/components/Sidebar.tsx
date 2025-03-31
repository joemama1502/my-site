"use client";
import { useState, useEffect } from "react";
import { FiSettings, FiGitBranch, FiAperture, FiX } from "react-icons/fi";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarVisible(false);
        setTimeout(() => setSidebarOpen(false), 300);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
        onClick={() => {
          setSidebarOpen(true);
          setTimeout(() => setSidebarVisible(true), 10);
        }}
      >
        U
      </button>

      {sidebarOpen && (
        <div
          className={`mt-4 w-48 bg-[#2a2a2a] text-white rounded-xl shadow-lg py-4 px-3 flex flex-col gap-4 transition-all duration-300 ${
            sidebarVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0"
          }`}
        >
          <button
            onClick={() => (window.location.href = "/profile")}
            className="text-left font-semibold text-white hover:text-green-300 transition"
          >
            @Username
          </button>

          <hr className="border-gray-600" />

          <button className="flex items-center gap-2 hover:text-green-300 transition">
            <FiGitBranch />
            Branches
          </button>
          <button className="flex items-center gap-2 hover:text-green-300 transition">
            <FiAperture />
            Trees
          </button>
          <button className="flex items-center gap-2 hover:text-green-300 transition">
            <FiSettings />
            Settings
          </button>

          <div className="mt-auto pt-4 border-t border-gray-600">
            <button
              className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
              onClick={() => {
                setSidebarVisible(false);
                setTimeout(() => setSidebarOpen(false), 300);
              }}
            >
              <FiX />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
