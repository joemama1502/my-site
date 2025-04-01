"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <>
      {/* TOP HERO HEADER */}
      <div className="relative w-full z-40 overflow-hidden">
        {/* Stars background for dark mode */}
        {darkMode && (
          <>
            <div className="absolute inset-0 z-0 bg-[url('/stars.png')] bg-cover bg-center brightness-90 opacity-90 pointer-events-none transition-opacity duration-700" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#111] via-transparent to-[#111] pointer-events-none" />
          </>
        )}


        {/* Main hero content */}
        <div
          className={`relative z-20 flex flex-col items-center pt-8 pb-6 transition-colors duration-500 ease-in-out ${
            darkMode ? "bg-[#111]/70" : "bg-[#ece1d6]"
          }`}
        >
          {/* Logo */}
          <div
            className={`relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4
              transition-all duration-700 ease-in-out
              ${scrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}
            `}
          >
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
            className="w-full max-w-lg rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
          />

          {/* Icon Row */}
          <div className="mt-4 flex gap-6 justify-center items-center">
            {["seed", "leaf", "tree", "moon"].map((icon) => (
              <button
                key={icon}
                className="w-10 h-10 hover:-translate-y-1 transition-transform"
                onClick={() =>
                  icon === "moon"
                    ? setDarkMode(!darkMode)
                    : console.log(`${icon} clicked`)
                }
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
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY SCROLL HEADER */}
      <div
        className={`fixed top-0 left-0 w-full z-[999] px-4 sm:px-6 py-2 flex items-center justify-between
          transition-all duration-300 ease-in-out backdrop-blur-md shadow-md ${
            darkMode ? "bg-[#111]/80" : "bg-white/60"
          } ${heroVisible ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="flex items-center gap-4 w-full max-w-6xl mx-auto">
          {/* Logo small */}
          <div className="pl-4 w-[180px] sm:w-[200px] h-[50px] relative shrink-0">
            <Image
              src={darkMode ? "/logo-white.png" : "/logo.png"}
              alt="PromptTreehouse Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Search and Icons inline */}
          <div className="flex-grow flex items-center justify-center gap-4">
            <div className="flex-grow max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              {["seed", "leaf", "tree", "moon"].map((icon) => (
                <button
                  key={icon}
                  className="w-8 h-8 hover:-translate-y-1 transition-transform"
                  onClick={() =>
                    icon === "moon"
                      ? setDarkMode(!darkMode)
                      : console.log(`${icon} clicked`)
                  }
                >
                  <Image
                    src={
                      darkMode
                        ? `/icons/${icon}-white.png`
                        : `/icons/${icon}.png`
                    }
                    alt={`${icon} Icon`}
                    width={32}
                    height={32}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

