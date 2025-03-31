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
      <div
        className={`relative w-full z-40 flex flex-col items-center pt-8 pb-6
        transition-all transition-colors duration-500 ease-in-out ${
          scrolled
            ? "opacity-0 -translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0"
        } ${darkMode ? "bg-[#111]" : "bg-[#ece1d6]"}`}
      >
        {/* Logo */}
        <div className="relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4">
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
          className="w-full max-w-sm rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
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

      {/* STICKY SCROLL HEADER */}
      <div
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-2 flex items-center justify-between
        transition-all transition-colors duration-500 ease-in-out bg-gradient-to-b ${
          darkMode
            ? "from-[#111]/90 to-[#111]/0"
            : "from-[#ece1d6]/90 to-[#ece1d6]/0"
        } ${heroVisible ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="flex items-center gap-4 w-full max-w-6xl mx-auto">
          {/* Logo small */}
          <div className="w-[120px] sm:w-[160px] h-[40px] relative shrink-0">
            <Image
              src={darkMode ? "/logo-white.png" : "/logo.png"}
              alt="PromptTreehouse Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Search and Icons inline */}
          <div className="flex-grow flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none max-w-md"
            />
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



