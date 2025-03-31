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
  const [scrolled, setScrolled] = useState(false);
  const [instantHide, setInstantHide] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      const direction = delta > 0 ? "down" : "up";

      setScrollDirection(direction);
      setScrollSpeed(Math.min(Math.abs(delta), 100)); // cap for stability

      if (currentY < 20 && lastScrollY - currentY > 50) {
        setInstantHide(true);
      } else {
        setInstantHide(false);
      }

      setScrolled(currentY > 10);
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* TOP HERO HEADER */}
      <div
        className={`absolute top-0 left-0 w-full z-0 flex flex-col items-center pt-8 pb-6 transition-all ${
          scrollSpeed > 60
            ? "duration-200"
            : scrollSpeed > 20
            ? "duration-400"
            : "duration-500"
        } ease-out ${
          scrolled
            ? `opacity-0 -translate-y-${Math.min(
                Math.floor(scrollSpeed / 10) + 4,
                10
              )} pointer-events-none`
            : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
      >
        {/* Logo */}
        <div className="relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4 transition-all duration-500">
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

        {/* Icons */}
        <div className="mt-4 flex gap-6 justify-center items-center">
          {["seed", "leaf", "tree", "moon"].map((icon, i) => (
            <button
              key={i}
              className="w-10 h-10"
              onClick={icon === "moon" ? () => setDarkMode(!darkMode) : undefined}
            >
              <Image
                src={`/icons/${icon}${darkMode ? "-white" : ""}.png`}
                alt={`${icon} icon`}
                width={40}
                height={40}
                className="hover:scale-110 transition-transform duration-200"
              />
            </button>
          ))}
        </div>
      </div>

      {/* STICKY HEADER WRAPPER */}
      <div
        className={`sticky top-0 z-10 w-full ${
          instantHide
            ? "opacity-0 -translate-y-2 pointer-events-none transition-none"
            : "transition-all duration-500 ease-out"
        } ${
          scrolled
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <header
          className={`w-full px-4 sm:px-8 backdrop-blur-md ${
            darkMode ? "bg-[#1e1e1e]/70" : "bg-[#e8e0da]/70"
          } ${scrolled ? "py-2 shadow-md" : "py-0"} transition-all duration-500`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="relative w-24 h-10">
              <Image
                src={darkMode ? "/logo-white.png" : "/logo.png"}
                alt="PromptTreehouse Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search"
              className="flex-grow sm:w-[300px] md:w-[400px] rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
            />

            {/* Icons */}
            <div className="flex gap-4 items-center">
              {["seed", "leaf", "tree", "moon"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  onClick={icon === "moon" ? () => setDarkMode(!darkMode) : undefined}
                >
                  <Image
                    src={`/icons/${icon}${darkMode ? "-white" : ""}.png`}
                    alt={`${icon} icon`}
                    width={40}
                    height={40}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to preserve layout */}
      <div className="h-[260px] sm:h-[320px]"></div>
    </>
  );
}
