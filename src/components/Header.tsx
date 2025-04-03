// src/components/Header.tsx
"use client";

// --- React / Next Imports ---
import Image from "next/image";
// FIX: Removed unused useCallback
import { useEffect, useState } from "react";

// --- next-auth Imports ---
// FIX: Removed unused signIn, signOut, useSession
// import { signIn, signOut, useSession } from "next-auth/react";

// --- Animation Imports ---
import { motion, AnimatePresence } from "framer-motion";

// --- Icon Imports ---
// FIX: Removed unused FiUser
import { FiPlusCircle, FiSettings, FiGitBranch, FiAperture, FiMoon } from "react-icons/fi";

// --- Component Imports ---
import CreateSeedModal from './CreateSeedModal';
import LoginModal from './LoginModal';
import AuthControl from './AuthControl'; // Keep if used

// --- Constants ---
const funSearchMessages = [ "🌳 What's growing today?", "Search Treehouse", "✨ Start a new branch", "Find your next idea 💡", "🔍 Follow a hunch", "Dig into something weird 🕳️", "🌱 Just plant it", "Remix the internet 🎨", "Search by vibe, not word", "📡 What's trending in the forest?", "🍄 Explore something cool", "Search the roots of something bigger", "Follow a branch of thought 🌿", "📖 Make a little internet history", "Plant your curiosity 🌱", "Find an origin story 🔗", "Look for seeds or trees 🌲", "✨ Discover creative roots", "Trace the weirdest path", "Search an idea’s family tree 👀", "Click a seed, grow a forest", "🍞 Find the original loaf (meme fans know)", "🧠 Add your brain to the mix", "Feed the TreeHouse", "Tap into the underground 🌍", "Search backwards before forwards ⏳", "Remix with respect 🔁", "🎥 Search ideas, not influencers", "No FYP here. Just roots.", "🍃 Follow what feels right", "Look for ghost content 👻", "📍Trace where it started", "Don’t scroll. Create.", "🌍 See what others have planted", "✨ Join the chain of inspiration", "Start something nobody asked for", "🙃 Break the algorithm gently", "Explore what almost got lost", "📎 Look for the strange but true", "🧩 Search the fragments of something bigger", "Search by feeling, not filter", "Catch an idea mid-bloom 🌸", "Pull on a creative thread 🧵", "🛠️ Build something from someone else’s spark", "Uncover the first spark 🔥", "Branch where you want. Nobody’s watching 👁️", "What lives in the Tree today?", "No gatekeepers here 🚪", "Add to the timeline 🌀", "🌲 Where do you want to grow?", "Search softly and carry a big branch", "Not trending. Just true.", "💫 Search the multiverse of creativity", "Chase a trail of breadcrumbs 🥖" ];
const getRandomPlaceholder = (current?: string): string => { let next = current; while (next === current && funSearchMessages.length > 1) { next = funSearchMessages[Math.floor(Math.random() * funSearchMessages.length)]; } return next || "Search Treehouse..."; };

// --- Component Definition ---
export default function Header({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void; }) {
  // --- State ---
  const [scrollY, setScrollY] = useState(0);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Keep if LoginModal is used
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => getRandomPlaceholder());
  const [heroInputFocused, setHeroInputFocused] = useState(false);
  const [heroInputValue, setHeroInputValue] = useState("");
  const [stickyInputFocused, setStickyInputFocused] = useState(false);
  const [stickyInputValue, setStickyInputValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  // --- Effects ---
  useEffect(() => { // Set isClient after mount
    setIsClient(true);
  }, []);

  useEffect(() => { // Placeholder rotation (30 seconds)
    if (isClient) {
      const intervalId = setInterval(() => {
        let currentActiveElement = null;
        try {
          currentActiveElement = document.activeElement;
        // FIX: Changed catch(e) to catch as 'e' was unused
        } catch {} // Ignore error if activeElement is inaccessible
        if (!currentActiveElement || (currentActiveElement.tagName !== 'INPUT')) {
             setSearchPlaceholder(prev => getRandomPlaceholder(prev));
        }
      }, 30000);
      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [isClient]);

  useEffect(() => { // Scroll tracking
    if (typeof window !== 'undefined') { setScrollY(window.scrollY); }
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Calculated Values ---
  const scrolledDown = scrollY > 80;

  // --- Icon Data ---
  const navIcons = [
    { name: 'seed', icon: FiPlusCircle, action: () => setIsSeedModalOpen(true) },
    { name: 'leaf', icon: FiGitBranch, action: () => console.log('leaf clicked') },
    { name: 'tree', icon: FiAperture, action: () => console.log('tree clicked') },
    { name: 'moon', icon: FiMoon, action: () => setDarkMode(!darkMode) }
  ];

  // --- Component Return ---
  return (
    <>
      {/* Fixed Auth Control - Ensure AuthControl component exists and is imported */}
      <div className="fixed top-4 left-4 z-[1001]">
        <AuthControl />
      </div>

      {/* Hero Header */}
      <div className="relative w-full z-40 overflow-hidden">
        {darkMode && (
          <>
            <div className="absolute inset-0 z-0 bg-[url('/stars.png')] bg-cover bg-center brightness-90 opacity-90 pointer-events-none transition-opacity duration-700" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#111] via-transparent to-[#111] pointer-events-none" />
          </>
        )}
        <div className={`relative z-20 flex flex-col items-center pt-16 pb-8 transition-colors duration-500 ease-in-out ${ darkMode ? "bg-[#111]/70" : "bg-[#ece1d6]" }`}>
          {/* Logo */}
          <div className={`relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4 transition-opacity duration-700 ease-in-out opacity-100 translate-y-0`}>
            <Image src={darkMode ? "/logo-white.png" : "/logo.png"} alt="PromptTreehouse Logo" fill sizes="(max-width: 640px) 300px, 400px" className="object-contain" priority />
          </div>
          {/* Hero Search */}
          <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
             <input
               type="text"
               value={heroInputValue}
               onChange={(e) => setHeroInputValue(e.target.value)}
               onFocus={() => setHeroInputFocused(true)}
               onBlur={() => setHeroInputFocused(false)}
               className={`w-full rounded-full px-4 py-2 text-center border border-gray-300 dark:border-gray-500 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${heroInputFocused && !heroInputValue ? 'caret-transparent' : 'caret-black dark:caret-white'}`}
             />
             {isClient && (
               <AnimatePresence mode="wait">
                 {heroInputValue === '' && (
                   <motion.span
                     key={searchPlaceholder}
                     className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-base"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.5, ease: "easeInOut" }}
                   >
                     {searchPlaceholder}
                   </motion.span>
                 )}
               </AnimatePresence>
             )}
          </div>
          {/* Hero Icons */}
          <div className="mt-4 flex gap-6 justify-center items-center flex-wrap">
            {navIcons.map(({ name, icon: Icon, action }) => (
              <button key={name} className={`w-10 h-10 hover:-translate-y-1 transition-transform flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${ name === "seed" ? "hover:scale-110" : "" }`} onClick={action} aria-label={`${name} action`} title={name.charAt(0).toUpperCase() + name.slice(1)} >
                <Icon size={24} className={darkMode ? "text-white" : "text-black"} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 w-full z-[999] px-4 sm:px-6 py-2 transition-all duration-300 ease-in-out backdrop-blur-xl shadow-md bg-white/80 dark:bg-white/80 ${ !scrolledDown ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0" }`} >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto gap-3 h-12 pl-16">
          {/* Center Group: Search + Icons */}
          <div className="flex-1 flex justify-center items-center gap-4 mx-2 overflow-hidden">
            {/* Sticky Search */}
            <div className="relative w-full max-w-xs">
              <input
                 type="text"
                 value={stickyInputValue}
                 onChange={(e) => setStickyInputValue(e.target.value)}
                 onFocus={() => setStickyInputFocused(true)}
                 onBlur={() => setStickyInputFocused(false)}
                 className={`w-full rounded-full px-4 py-2 text-center border border-gray-300 dark:border-gray-400 bg-white text-black shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${stickyInputFocused && !stickyInputValue ? 'caret-transparent' : 'caret-black'}`}
              />
               {isClient && (
                 <AnimatePresence mode="wait">
                   {stickyInputValue === '' && (
                     <motion.span
                       key={searchPlaceholder + '-sticky'}
                       className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-sm"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.5, ease: "easeInOut" }}
                     >
                       {searchPlaceholder}
                     </motion.span>
                   )}
                 </AnimatePresence>
               )}
            </div>
            {/* Sticky Icons (Desktop only) */}
            <div className="hidden md:flex gap-3 items-center">
              {navIcons.map(({ name, icon: Icon, action }) => (
                <button key={name + '-sticky'} className={`w-8 h-8 hover:-translate-y-1 transition-transform flex items-center justify-center rounded-full hover:bg-gray-500/20`} onClick={action} aria-label={`${name} action`} title={name.charAt(0).toUpperCase() + name.slice(1)}>
                   <Icon size={20} className="text-gray-700" />
                </button>
              ))}
            </div>
          </div>
          {/* Right Item: Settings (Desktop only) */}
          <div className="hidden md:flex flex-shrink-0">
            <button onClick={() => console.log("Settings clicked")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-500/20 transition-colors" aria-label="Settings" title="Settings" >
              <FiSettings size={24} className="text-gray-700" />
            </button>
          </div>
          {/* Mobile Placeholder (for justify-between) */}
          <div className="md:hidden flex-shrink-0 w-10 h-10"></div>
        </div>
      </div>

      {/* Modals */}
      {/* Ensure CreateSeedModal and LoginModal components are correctly implemented */}
      <CreateSeedModal isOpen={isSeedModalOpen} onClose={() => setIsSeedModalOpen(false)} darkMode={darkMode} />
      {/* Conditionally render LoginModal only if needed, or remove if AuthControl handles login */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

    </>
  );
}