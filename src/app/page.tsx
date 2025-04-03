// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from 'next/image'; // Import Next.js Image component

// Component Imports (De-duplicated)
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar"; // Keep Sidebar
import CardGrid, { CardData, CardType } from "@/components/CardGrid"; // Ensure types are correctly defined/exported from CardGrid or define here

// Animation and Utility Imports (De-duplicated)
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';

// Define CardData type structure if not fully exported from CardGrid
// interface CardData {
//   id: string;
//   type: CardType;
//   seed: number;
//   imageUrl: string;
//   hits?: number; // Optional property
//   branches?: number; // Optional property
// }
// type CardType = "square" | "wide" | "classic" | "phone";


export default function Home() {
  // --- State (De-duplicated) ---
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Single loading state
  // Re-introduce setHasNextPage if you plan to limit loading
  const [hasNextPage, setHasNextPage] = useState(true);

  // --- Hooks & Logic ---
  // useInView hook for triggering infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0, // Trigger as soon as the element enters the viewport
    rootMargin: "400px 0px 0px 0px" // Trigger when element is 400px below the viewport
  });

  // Function to generate cards (Consolidated and fixed return)
  const generateCards = useCallback((count: number, offset: number = 0): CardData[] => {
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    return Array.from({ length: count }, (_, i) => {
      const seed = offset + i + 1;
      const type = types[Math.floor(Math.random() * types.length)];
      // Ensure this return statement matches the CardData interface/type
      return {
        type: type,
        seed: seed,
        id: `card-${seed}-${type}-${Math.random()}`, // Consider a more robust ID generation
        imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
        hits: Math.floor(Math.random() * 500) + 1,
        branches: Math.floor(Math.random() * 50) + 1,
      };
    });
  }, []); // No dependencies

  // Function to load more items (for useInView)
  const loadMoreItems = useCallback(() => {
    // Prevent multiple loads, check if there are more pages expected
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    console.log("Loading more cards (useInView)...");

    // Simulate network delay
    setTimeout(() => {
      setCards((prev) => {
        const newCards = generateCards(16, prev.length);
        // --- TODO: Implement check for last page ---
        // Example: if (newCards.length === 0) {
        //   setHasNextPage(false);
        // }
        return [...prev, ...newCards];
      });
      setIsLoading(false);
    }, 800); // Simulate 800ms load time

  }, [generateCards, isLoading, hasNextPage, setHasNextPage]); // Add setHasNextPage if used in TODO

  // --- Effects (De-duplicated) ---

  // Effect for initial card load
  useEffect(() => {
    if (typeof window !== 'undefined' && cards.length === 0) {
      console.log("Loading initial cards...");
      const initialCards = generateCards(32);
      setCards(initialCards);
    }
    // Add cards.length to dependency array if needed based on linting/logic
  }, [generateCards]); // Removed cards.length dependency unless strictly needed

  // Effect for infinite scrolling using useInView
  useEffect(() => {
    if (inView && !isLoading && hasNextPage) { // Check hasNextPage here
      loadMoreItems();
    }
  }, [inView, isLoading, hasNextPage, loadMoreItems]);

  // Effect for closing modal with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null); // Close image modal
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []); // Empty dependency array - runs once on mount

  // --- Image Modal Management (De-duplicated) ---
  const openImageModal = useCallback((imageUrl: string) => {
    setActiveImage(imageUrl);
  }, []);

  const closeImageModal = useCallback(() => {
    setActiveImage(null);
  }, []);


  // --- Render (Consolidated) ---
  return (
    // Single main container div
    <div
      className={`min-h-screen transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#ece1d6] text-black"
      }`}
    >
      {/* Consider layout structure: Sidebar usually outside or alongside main content */}
      {/* <Sidebar username="@TreeUser" /> */}

      {/* Single Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Single Main Content Area */}
      <main className="px-4 pb-10 pt-8 transition-colors duration-500">

        {/* You might want a wrapper div here if using Sidebar for layout (e.g., flex) */}

        {/* Single Card Grid */}
        <CardGrid
          cards={cards}
          darkMode={darkMode}
          onImageClick={openImageModal}
        />

        {/* Single Loading Indicator */}
        {isLoading && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Loading more...</p>
            {/* Optional: Add a spinner component */}
          </div>
        )}

        {/* Element to trigger loading more items via useInView */}
        <div ref={loadMoreRef} style={{ height: "1px", marginTop: "10px" }} />

      </main>

      {/* Single Image Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="image-modal" // Key for AnimatePresence
            className="fixed inset-0 z-[1005] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeImageModal} // Close on backdrop click
          >
            {/* Image container with animation */}
            <motion.div
              className="relative max-w-full max-h-full" // Let image size dictate final size
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image itself
            >
              {/* Use Next.js Image component */}
              <Image
                src={activeImage}
                alt="Enlarged view"
                width={1200} // Provide base width (adjust as needed)
                height={900} // Provide base height (adjust as needed)
                style={{
                  maxWidth: '90vw', // Limit width relative to viewport
                  maxHeight: '90vh', // Limit height relative to viewport
                  width: 'auto', // Allow auto width based on height constraint
                  height: 'auto', // Allow auto height based on width constraint
                  objectFit: 'contain',
                  borderRadius: '8px', // Optional styling
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)' // Optional styling
                }}
              />
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute -top-2 -right-2 md:top-1 md:right-1 w-8 h-8 bg-white/70 text-black rounded-full flex items-center justify-center text-xl font-bold shadow-lg hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
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