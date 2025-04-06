"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

import CreateSeedModal from "./CreateSeedModal";
import LoginModal from "./LoginModal";
import AuthControl from "./AuthControl";

const funSearchMessages = [
  "Chase a trail of breadcrumbs 🥖",
  "Plant your weirdest ideas 🌱",
  "Dig up something cool 🪄",
  "Enter the rabbit hole 🕳️",
  "What’s blooming in your mind?",
  "Summon something strange 🔮",
  "Find your creative frequency 💳",
  "Whistle to the void 🎶",
  "Scroll and grow 🌱",
  "Make some prompt magic ✨",
  "What weird seed will you plant?",
  "Let’s go down the weird treehole 🕳️🌲",
  "Search your future memory 🔁",
  "Spin your cosmic yarn 🧶",
  "Tease the fates 🔮",
  "Turn your brain upside-down 🤹",
  "Embrace your silly side 🦄",
  "Spoil your curiosity 🍿",
  "Unlock the hidden door 🗝️",
  "Tiptoe through your daydreams 💭",
  "Flirt with chaos 🌀",
  "Brew a new obsession ☕",
  "Travel to Idea-land ✈️",
  "Swing from branch to branch 🙉",
  "Discover whats possible 🔍",
  "lets get funky 🪩🕺",
];

const pastelGlowColors = [
  "#F9A8D4", // Pink
  "#93C5FD", // Blue
  "#6EE7B7", // Green
  "#FDBA74", // Orange
  "#C4B5FD", // Purple
];

function getRandomPlaceholder(current?: string): string {
  let next = current;
  while (next === current && funSearchMessages.length > 1) {
    next = funSearchMessages[Math.floor(Math.random() * funSearchMessages.length)];
  }
  return next || "Search Treehouse...";
}

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);

  // Hero input
  const [heroInputValue, setHeroInputValue] = useState("");
  const [heroInputFocused, setHeroInputFocused] = useState(false);
  const [heroHoverColor, setHeroHoverColor] = useState<string | null>(null);

  // Sticky input
  const [stickyInputValue, setStickyInputValue] = useState("");
  const [stickyInputFocused, setStickyInputFocused] = useState(false);
  const [stickyHoverColor, setStickyHoverColor] = useState<string | null>(null);

  // Placeholder
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => getRandomPlaceholder());
  const [isClient, setIsClient] = useState(false);

  // NextAuth session
  const { data: session } = useSession();

  // On client
  useEffect(() => setIsClient(true), []);

  // Cycle placeholders if not typing
  useEffect(() => {
    if (isClient) {
      const intervalId = setInterval(() => {
        let currentActiveElement: Element | null = null;
        try {
          currentActiveElement = document.activeElement;
        } catch {}
        if (!currentActiveElement || currentActiveElement.tagName !== "INPUT") {
          setSearchPlaceholder((prev) => getRandomPlaceholder(prev));
        }
      }, 45000);

      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [isClient]);

  // Track scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrolledDown = scrollY > 80;

  // Hover logic for hero
  const handleHeroHoverStart = () => {
    const color = pastelGlowColors[Math.floor(Math.random() * pastelGlowColors.length)];
    setHeroHoverColor(color);
  };
  const handleHeroHoverEnd = () => {
    setHeroHoverColor(null);
  };

  // Hover logic for sticky
  const handleStickyHoverStart = () => {
    const color = pastelGlowColors[Math.floor(Math.random() * pastelGlowColors.length)];
    setStickyHoverColor(color);
  };
  const handleStickyHoverEnd = () => {
    setStickyHoverColor(null);
  };

  // Nav icons
  const navIcons = [
    {
      name: "seed",
      src: "/icons/seed.png",
      white: "/icons/seed-white.png",
      action: () => setIsSeedModalOpen(true),
    },
    {
      name: "leaf",
      src: "/icons/leaf.png",
      white: "/icons/leaf-white.png",
      action: () => console.log("leaf clicked"),
    },
    {
      name: "tree",
      src: "/icons/tree.png",
      white: "/icons/tree-white.png",
      action: () => console.log("tree clicked"),
    },
    {
      name: "moon",
      src: "/icons/moon.png",
      white: "/icons/moon-white.png",
      action: () => setDarkMode(!darkMode),
    },
  ];

  return (
    <>
      {/*
        HERO SECTION
        Big logo, big search, big icons,
        plus top-right sign-in
      */}
      <div className="fixed top-4 right-6 z-[1001] flex items-center gap-2">
        {!session && (
          <span className="text-[#696e4a] text-sm font-semibold hidden sm:inline">
            Sign Up / Login
          </span>
        )}
        {/* Hero profile icon: w-12 h-12, iconSize=32 */}
        <AuthControl buttonSize="w-12 h-12" iconSize={32} />
      </div>

      <div className="relative w-full z-40 overflow-hidden">
        {darkMode && (
          <>
            <div className="absolute inset-0 z-0 bg-[url('/stars.png')] bg-cover bg-center brightness-90 opacity-90 pointer-events-none transition-opacity duration-700" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#111] via-transparent to-[#111] pointer-events-none" />
          </>
        )}

        <div
          className={`relative z-20 flex flex-col items-center pt-16 pb-8 transition-colors duration-500 ease-in-out ${
            darkMode ? "bg-[#111]/70" : "bg-[#ece1d6]"
          }`}
        >
          {/* Large center logo */}
          <div className="relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4">
            <Image
              src={darkMode ? "/logo-white.png" : "/logo.png"}
              alt="TreeHouse site logo"
              fill
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px"
              className="object-contain"
              priority
            />
          </div>

          {/* Hero input with pastel glow */}
          <motion.div
            className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mt-4 rounded-full"
            onHoverStart={handleHeroHoverStart}
            onHoverEnd={handleHeroHoverEnd}
            style={{
              boxShadow: heroHoverColor ? `0 0 15px 3px ${heroHoverColor}` : "none",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <input
              type="text"
              value={heroInputValue}
              onChange={(e) => setHeroInputValue(e.target.value)}
              onFocus={() => setHeroInputFocused(true)}
              onBlur={() => setHeroInputFocused(false)}
              className={`w-full rounded-full px-4 py-3 text-center border border-gray-300 dark:border-gray-500 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-[#696e4a] text-lg ${
                heroInputFocused && !heroInputValue ? "caret-transparent" : "caret-black dark:caret-white"
              }`}
            />
            {isClient && (
              <AnimatePresence mode="wait">
                {heroInputValue === "" && (
                  <motion.span
                    key={searchPlaceholder}
                    className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {searchPlaceholder}
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Hero icons row */}
          <div className="mt-6 flex gap-6 justify-center items-center flex-wrap">
            {navIcons.map(({ name, src, white, action }) => (
              <button
                key={name}
                onClick={action}
                className="w-12 h-12 hover:-translate-y-1 transition-transform flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                aria-label={name}
              >
                <Image src={darkMode ? white : src} alt={name} width={36} height={36} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/*
        STICKY BAR
        Above hero icon => bigger z-index
        Transparent = #111/30 or white/30
        Logo bigger, search bar wider,
        profile icon same size as hero
      */}
      <div
        className={`fixed top-0 left-0 w-full py-2 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-md
          ${!scrolledDown ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}
          ${
            darkMode
              ? "bg-[#111]/30"
              : "bg-white/30"
          }
          // bump z-index above the hero icon (z-[1001])
        z-[1002]
        `}
      >
        <div className="flex items-center w-full h-16 px-6 justify-between">
          {/* Left: bigger logo e.g. w-40 h-12 */}
          <div className="relative w-[160px] h-[50px]">
            <Image
              src={darkMode ? "/logo-white.png" : "/logo.png"}
              alt="TreeHouse small logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Center: search + icons side-by-side */}
          <div className="flex items-center gap-4">
            <motion.div
              className="relative rounded-full"
              onHoverStart={handleStickyHoverStart}
              onHoverEnd={handleStickyHoverEnd}
              style={{
                boxShadow: stickyHoverColor ? `0 0 15px 3px ${stickyHoverColor}` : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {/* Wider search bar: 240px on small, 300px on sm */}
              <input
                type="text"
                value={stickyInputValue}
                onChange={(e) => setStickyInputValue(e.target.value)}
                onFocus={() => setStickyInputFocused(true)}
                onBlur={() => setStickyInputFocused(false)}
                className="w-[240px] sm:w-[300px] rounded-full px-4 py-2.5 text-center border border-gray-300 dark:border-gray-400 bg-white text-black shadow-sm focus:outline-none focus:ring-1 focus:ring-[#696e4a] text-sm"
              />
              {isClient && (
                <AnimatePresence mode="wait">
                  {stickyInputValue === "" && (
                    <motion.span
                      key={searchPlaceholder + "-sticky"}
                      className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {searchPlaceholder}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Sticky icons */}
            <div className="flex gap-3 items-center">
              {navIcons.map(({ name, src, white, action }) => (
                <button
                  key={name + "-sticky"}
                  onClick={action}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-500/20 transition"
                >
                  <Image src={darkMode ? white : src} alt={name} width={28} height={28} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: same size as hero = w-12 h-12, iconSize=32 */}
          <div className="flex items-center gap-2">
            {!session && (
              <span className="text-[#696e4a] text-sm font-semibold hidden sm:inline">
                Sign Up / Login
              </span>
            )}
            <AuthControl buttonSize="w-12 h-12" iconSize={32} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateSeedModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        darkMode={darkMode}
      />
      <LoginModal isOpen={false} onClose={() => {}} />
    </>
  );
}
