// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from 'next/image'; // Import Next.js Image component

// Component Imports
import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar"; // Keep commented/removed if not used
import CardGrid, { SeedCardData, CardType } from "@/components/CardGrid"; // Ensure types are exported/defined correctly

// Animation and Utility Imports
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';

// Define CardType if not exported from CardGrid
// type CardType = "square" | "wide" | "classic" | "phone";

export default function Home() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<SeedCardData[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  // --- Hooks & Logic ---
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "400px 0px 0px 0px"
  });

  // Function to generate cards
  const generateCards = useCallback((count: number, offset: number = 0): SeedCardData[] => {
    // Assuming CardType is defined/imported correctly
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    return Array.from({ length: count }, (_, i) => {
      const seed = offset + i + 1;
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        type: type,
        seed: seed,
        id: `card-${seed}-${type}-${Math.random()}`, // Use a better unique ID method in production
        imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
        hits: Math.floor(Math.random() * 500) + 1,
        branches: Math.floor(Math.random() * 50) + 1,
      };
    });
  }, []);

  // Function to load more items
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    console.log("Loading more cards (useInView)...");
    setTimeout(() => {
      setCards((prev) => {
        const newCards = generateCards(16, prev.length);
        // TODO: Check if newCards.length === 0 and call setHasNextPage(false)
        // if (newCards.length === 0) { setHasNextPage(false); }
        return [...prev, ...newCards];
      });
      setIsLoading(false);
    }, 800);
  }, [generateCards, isLoading, hasNextPage]); // Removed setHasNextPage dependency

  // --- Effects ---

  // Effect for initial card load
  useEffect(() => {
    // Check needed to prevent hydration mismatch if initial state is calculated differently server/client
    if (typeof window !== 'undefined' && cards.length === 0) {
      console.log("Loading initial cards...");
      const initialCards = generateCards(32);
      setCards(initialCards);
    }
  }, [generateCards, cards.length]); // Added cards.length dependency

  // Effect for infinite scrolling using useInView
  useEffect(() => {
    if (inView && !isLoading && hasNextPage) {
      loadMoreItems();
    }
  }, [inView, isLoading, hasNextPage, loadMoreItems]);

  // Effect for closing modal with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // --- Image Modal Management ---
  const openImageModal = useCallback((imageUrl: string) => {
    setActiveImage(imageUrl);
  }, []);

  const closeImageModal = useCallback(() => {
    setActiveImage(null);
  }, []);


  // --- Render ---
  return (
    // Ensure no space after opening angle bracket
    <div
      className={`min-h-screen transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#ece1d6] text-black"
      }`}
    >
      {/* <Sidebar username="@TreeUser" /> */}

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="px-4 pb-10 pt-8 transition-colors duration-500">
        <CardGrid
          cards={cards}
          darkMode={darkMode}
          onImageClick={openImageModal}
        />

        {isLoading && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Loading more...</p>
          </div>
        )}

        <div ref={loadMoreRef} style={{ height: "1px", marginTop: "10px" }} />
      </main>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="image-modal"
            className="fixed inset-0 z-[1005] bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeImageModal}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt="Enlarged view"
                width={1200}
                height={900}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              />
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
