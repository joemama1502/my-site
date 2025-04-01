"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { FiSettings, FiGitBranch, FiAperture, FiX } from "react-icons/fi";

type CardType = "square" | "wide" | "classic" | "phone";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<{ type: CardType; seed: number }[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    const generateCards = (count: number, offset: number = 0) =>
      Array.from({ length: count }, (_, i) => ({
        type: types[Math.floor(Math.random() * types.length)],
        seed: i + 1 + offset,
      }));

    setCards(generateCards(32));

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarVisible(false);
        setTimeout(() => setSidebarOpen(false), 300);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) {
        setCards((prev) => {
          const offset = prev.length;
          const types: CardType[] = ["square", "wide", "classic", "phone"];
          const newCards = Array.from({ length: 16 }, (_, i) => ({
            type: types[Math.floor(Math.random() * types.length)],
            seed: offset + i + 1,
          }));
          return [...prev, ...newCards];
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getAspectStyle = (type: CardType) => {
    switch (type) {
      case "square":
        return "aspect-square";
      case "wide":
        return "aspect-video";
      case "classic":
        return "aspect-[4/3]";
      case "phone":
        return "aspect-[9/16]";
      default:
        return "aspect-square";
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#111] text-white" : "bg-[#ece1d6] text-black"
      }`}
    >
      {/* Sidebar Button */}
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

      {/* Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Grid */}
      <main className="px-6 pb-8 transition-colors duration-500">
        <div className="mt-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4 transition-colors duration-500 ease-in-out">
          {cards.map((card, idx) => {
            const imageUrl = `https://picsum.photos/seed/${card.seed}/600/400`;
            return (
              <div
                key={idx}
                className={`break-inside-avoid overflow-hidden cursor-pointer ${
                  darkMode ? "bg-[#2a2a2a]" : "bg-white"
                } rounded-xl shadow-md border border-[#ddd] transform transition duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl ${getAspectStyle(
                  card.type
                )}`}
                onClick={() => setActiveImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Preview ${card.seed}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Fullscreen Image View */}
        {activeImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={() => setActiveImage(null)}
          >
            <img
              src={activeImage}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white text-3xl font-bold"
            >
              ×
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
