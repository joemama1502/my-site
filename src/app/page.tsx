// src/app/page.tsx (or your main page file)
"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header"; // Assuming correct path
import Sidebar from "@/components/Sidebar"; // Import Sidebar
import CardGrid, { CardData, CardType } from "@/components/CardGrid"; // Import CardGrid and types
import { motion, AnimatePresence } from "framer-motion"; // Keep for Modal

// Debounce function (keep it here or move to a utils file)
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) { clearTimeout(timeout); timeout = null; }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state for infinite scroll

  // Function to generate cards - now generates CardData with id and imageUrl
  const generateCards = useCallback((count: number, offset: number = 0): CardData[] => {
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    return Array.from({ length: count }, (_, i) => {
       const seed = offset + i + 1;
       const type = types[Math.floor(Math.random() * types.length)];
       return {
         type: type,
         seed: seed,
         // Generate a unique ID, combining seed and type or using a library like uuid
         id: `card-${seed}-${type}-${Math.random()}`,
         imageUrl: `https://picsum.photos/seed/${seed}/600/400`, // Generate URL here
       };
    });
  }, []); // No dependencies, safe to memoize

  // Effect for initial card load
  useEffect(() => {
    // Prevent running on server or during fast refresh in dev if needed
    if (typeof window !== 'undefined' && cards.length === 0) {
       console.log("Loading initial cards...");
       const initialCards = generateCards(32);
       setCards(initialCards);
    }
  }, [generateCards, cards.length]); // Rerun if generateCards changes or cards array becomes empty

  // Effect for infinite scrolling - Debounced
  useEffect(() => {
    const checkForMoreCards = () => {
      // Ensure it doesn't run while already loading
      if (isLoading) return;

      // Check if near bottom
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 600; // Adjusted threshold

      if (nearBottom) {
        setIsLoading(true); // Set loading flag
        console.log("Loading more cards...");
        // Simulate network delay for loading spinner (optional)
        setTimeout(() => {
           setCards((prev) => {
             const newCards = generateCards(16, prev.length);
             return [...prev, ...newCards];
           });
           setIsLoading(false); // Reset loading flag
        }, 500); // Simulate 500ms load time
      }
    };

    const debouncedScrollHandler = debounce(checkForMoreCards, 200);
    window.addEventListener("scroll", debouncedScrollHandler, { passive: true });
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, [generateCards, isLoading]); // Depend on generateCards and isLoading

  // Effect for closing modal with Escape key
   useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null); // Close image modal
      }
    };
     window.addEventListener("keydown", handleEsc);
     return () => window.removeEventListener("keydown", handleEsc);
   }, []);


  // --- Image Modal Management ---
  const openImageModal = useCallback((imageUrl: string) => {
      setActiveImage(imageUrl);
  }, []); // Memoize if passed deeply, though simple here

   const closeImageModal = useCallback(() => {
      setActiveImage(null);
  }, []);


  return (
    // Main container sets background and text color based on dark mode
    <div
      className={`min-h-screen transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-[#111] text-white" : "bg-[#e8e0da] text-black"
      }`}
    >
      {/* Sidebar component is self-managing */}
      <Sidebar username="@TreeUser" />

      {/* Header Component */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Area */}
      <main className="px-4 pb-10 pt-4 transition-colors duration-500">
        {/* Card Grid Component */}
        <CardGrid
          cards={cards}
          darkMode={darkMode}
          onImageClick={openImageModal}
        />

         {/* Loading Indicator for Infinite Scroll */}
        {isLoading && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Loading more...</p>
             {/* Optional: Add a spinner */}
          </div>
        )}
      </main>

      {/* --- Image Lightbox Modal (remains in page.tsx) --- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="image-modal" // Added key for AnimatePresence
            className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={closeImageModal}
          >
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            >
              <img
                src={activeImage}
                alt="Enlarged view"
                className="block max-w-full max-h-[90vh] object-contain shadow-lg rounded-lg"
              />
              <button
                onClick={closeImageModal}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close image viewer"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}