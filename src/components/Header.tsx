// Header.tsx

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
// --- ADDED --- (We'll create this component next)
import CreateSeedModal from './CreateSeedModal';

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  // --- ADDED --- State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrolled = scrollY > 80;
  const heroVisible = scrollY < 300;

  // --- ADDED --- Function to handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // --- ADDED --- Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* TOP HERO HEADER */}
      <div className="relative w-full z-40 overflow-hidden">
        {darkMode && (
          <>
            <div className="absolute inset-0 z-0 bg-[url('/stars.png')] bg-cover bg-center brightness-90 opacity-90 pointer-events-none transition-opacity duration-700" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#111] via-transparent to-[#111] pointer-events-none" />
          </>
        )}

        <div
          className={`relative z-20 flex flex-col items-center pt-8 pb-6 transition-colors duration-500 ease-in-out ${
            darkMode ? "bg-[#111]/70" : "bg-[#ece1d6]"
          }`}
        >
          <div
            className={`relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4 transition-all duration-700 ease-in-out ${
              scrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <Image
              src={darkMode ? "/logo-white.png" : "/logo.png"}
              alt="PromptTreehouse Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
          />

          <div className="mt-4 flex gap-6 justify-center items-center flex-wrap">
            {["seed", "leaf", "tree", "moon"].map((icon) => (
              <button
                key={icon}
                // --- MODIFIED --- Added hover scale effect, especially noticeable on seed
                className={`w-10 h-10 hover:-translate-y-1 transition-transform ${
                  icon === "seed" ? "hover:scale-110" : "" // Add specific hover effect to seed
                }`}
                onClick={() => {
                  // --- MODIFIED --- Handle seed icon click
                  if (icon === "seed") {
                    handleOpenModal();
                  } else if (icon === "moon") {
                    setDarkMode(!darkMode);
                  } else {
                    console.log(`${icon} clicked`);
                  }
                }}
              >
                <Image
                  src={
                    darkMode
                      ? `/icons/${icon}-white.png`
                      : `/icons/${icon}.png`
                  }
                  alt={`${icon} Icon`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY HEADER */}
      <div
        className={`fixed top-0 left-0 w-full z-[999] px-4 sm:px-6 py-2 transition-all duration-300 ease-in-out backdrop-blur-md shadow-md ${
          darkMode ? "bg-[#111]/80" : "bg-white/60"
        } ${heroVisible ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="flex flex-wrap items-center justify-between w-full max-w-6xl mx-auto gap-3">
          <div className="flex flex-grow items-center justify-between gap-4 w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full max-w-[200px] rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
            />

            <div className="flex gap-3 items-center">
              {["seed", "leaf", "tree", "moon"].map((icon) => (
                <button
                  key={icon}
                  // --- MODIFIED --- Added hover scale effect, especially noticeable on seed
                  className={`w-8 h-8 hover:-translate-y-1 transition-transform ${
                    icon === "seed" ? "hover:scale-110" : "" // Add specific hover effect to seed
                  }`}
                  onClick={() => {
                     // --- MODIFIED --- Handle seed icon click
                    if (icon === "seed") {
                      handleOpenModal();
                    } else if (icon === "moon") {
                      setDarkMode(!darkMode);
                    } else {
                      console.log(`${icon} clicked`);
                    }
                  }}
                >
                  <Image
                    src={
                      darkMode
                        ? `/icons/${icon}-white.png`
                        : `/icons/${icon}.png`
                    }
                    alt="" // Keep alt empty for decorative icons in sticky header? Or add proper alt.
                    aria-hidden="true"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- ADDED --- Render the modal conditionally */}
      <CreateSeedModal //
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        darkMode={darkMode}
      />
    </>
  );
}
