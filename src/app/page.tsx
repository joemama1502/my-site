"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    const newCards = Array.from({ length: 32 }, (_, i) => ({
      type: types[Math.floor(Math.random() * types.length)],
      seed: i + 1,
    }));
    setCards(newCards);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarVisible(false);
        setTimeout(() => setSidebarOpen(false), 300);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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
    <>
      {/* Sidebar */}
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
            className={`mt-4 w-48 bg-[#2a2a2a] text-white rounded-xl shadow-lg py-4 px-3 flex flex-col gap-4 transition-all duration-300 ${sidebarVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
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

      {/* Main Content */}
      <main className={`${darkMode ? "bg-[#1e1e1e] text-white" : "bg-[#e8e0da] text-black"} min-h-screen px-6 py-8 transition-colors duration-300`}>
        <header className="flex flex-col items-center mb-8">
          {/* Logo */}
          <div className="relative w-[400px] h-[200px] mb-4">
              <Image
                src={darkMode ? "/logo-white.png" : "/logo.png"}
                alt="PromptTreehouse Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-xl rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
          />

          {/* Icon Row */}
          <div className="mt-4 flex gap-6 justify-center items-center">
            <button className="w-10 h-10" onClick={() => console.log("Seed clicked")}>
              <Image
                src="/icons/seed.png"
                alt="Seed Icon"
                width={40}
                height={40}
                className="hover:scale-110 transition-transform"
              />
            </button>
            <button className="w-10 h-10" onClick={() => console.log("Leaf clicked")}>
              <Image
                src="/icons/leaf.png"
                alt="Leaf Icon"
                width={40}
                height={40}
                className="hover:scale-110 transition-transform"
              />
            </button>
            <button className="w-10 h-10" onClick={() => console.log("Tree clicked")}>
              <Image
                src="/icons/tree.png"
                alt="Tree Icon"
                width={40}
                height={40}
                className="hover:scale-110 transition-transform"
              />
            </button>
            <button className="w-10 h-10" onClick={() => setDarkMode(!darkMode)}>
              <Image
                src="/icons/moon.png"
                alt="Dark Mode Toggle"
                width={40}
                height={40}
                className="hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </header>

        {/* Card Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
          {cards.map((card, idx) => {
            const imageUrl = `https://picsum.photos/seed/${card.seed}/600/400`;
            return (
              <div
                key={idx}
                className={`break-inside-avoid overflow-hidden cursor-pointer ${darkMode ? "bg-[#2a2a2a]" : "bg-white"} rounded-xl shadow-md border border-[#ddd] transform transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl ${getAspectStyle(card.type)}`}
                onClick={() => setActiveImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Preview ${card.seed}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Fullscreen Modal */}
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
    </>
  );
}