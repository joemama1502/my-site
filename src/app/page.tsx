// src/app/page.tsx
"use client";

// --- CORRECTED Imports ---
import { useEffect, useState, useCallback } from "react"; // Removed unused useRef
import Image from 'next/image'; // Added for Next.js Image optimization

// --- Component Imports ---
import Header from "@/components/Header";
import CardGrid, { /* CardData */ SeedCardData } from "@/components/CardGrid"; // Use SeedCardData directly if CardData is just an alias
// import CreateSeedModal from '@/components/CreateSeedModal';
// import LoginModal from '@/components/LoginModal';
// import AuthControl from '@/components/AuthControl';

// --- Other Imports ---
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';

// Define CardData here if it needs specific properties beyond SeedCardData, otherwise use SeedCardData
export interface CardData extends SeedCardData {
    // Add any page-specific properties for CardData here if needed
}


export default function Home() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // FIX: Removed setHasNextPage as it wasn't being called.
  // If pagination limits are needed, implement logic to call setHasNextPage(false).
  const [hasNextPage] = useState(true); // Read-only state for now

  // --- Hooks & Logic ---
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0, rootMargin: "400px 0px 0px 0px" });

  // Note: Generate cards needs CardData type defined or imported correctly
  const generateCards = useCallback((count: number, offset: number = 0): CardData[] => {
    const types = ["square", "wide", "classic", "phone"]; // Ensure 'CardType' is aligned or remove if SeedCardData defines it
    return Array.from({ length: count }, (_, i) => {
       const seed = offset + i + 1;
       const type = types[Math.floor(Math.random() * types.length)];
       return {
         type: type,
         seed: seed,
         id: `card-${seed}-${type}-${Math.random()}`,
         imageUrl: `https://picsum.photos/seed/${seed}/600/400`,
         hits: Math.floor(Math.random() * 500) + 1,
         branches: Math.floor(Math.random() * 50) + 1,
       };
    });
  }, []);

  const loadMoreItems = useCallback(() => {
    // FIX: Removed hasNextPage from dependency array as setHasNextPage was removed
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    console.log("Loading more cards...");
    setTimeout(() => {
      setCards((prev) => {
        const newCards = generateCards(16, prev.length);
        // Add logic here to check if newCards.length === 0 or based on API response
        // and call setHasNextPage(false) if needed in the future
        return [...prev, ...newCards];
      });
      setIsLoading(false);
    }, 800);
  }, [generateCards, isLoading, hasNextPage]); // Removed setHasNextPage from dependencies

  // --- Effects ---
  useEffect(() => { // Initial load
    // FIX: Added cards.length to dependency array
    if (typeof window !== 'undefined' && cards.length === 0) {
      const initialCards = generateCards(32);
      setCards(initialCards);
    }
    // Ensure generateCards is stable or memoized if it causes issues
  }, [generateCards, cards.length]); // Added cards.length

  useEffect(() => { // Infinite scroll
    if (inView && !isLoading) {
      loadMoreItems();
    }
  }, [inView, loadMoreItems, isLoading]);

   useEffect(() => { // Modal escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
    return () => {};
   }, []);

  // --- Modal Handlers ---
  const openImageModal = useCallback((imageUrl: string) => {
    setActiveImage(imageUrl);
  }, []);
  const closeImageModal = useCallback(() => {
    setActiveImage(null);
  }, []);

  // --- Render ---
  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${ darkMode ? "bg-[#121212] text-white" : "bg-[#ece1d6] text-black" }`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="px-4 pb-10 pt-8 transition-colors duration-500">

        {/* Use SeedCardData directly if CardData is just an alias */}
        <CardGrid cards={cards} darkMode={darkMode} onImageClick={openImageModal} />

        {isLoading && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Loading more...</p>
          </div>
        )}

        {/* Element to trigger loading more */}
        <div ref={loadMoreRef} style={{ height: "1px" }} />

      </main>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="fixed inset-0 z-[1005] bg-black/80 flex items-center justify-center p-4"
            onClick={closeImageModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Use a motion.div that controls layout for Next/Image with fill */}
            <motion.div
              className="relative w-full h-full max-w-4xl max-h-[90vh]" // Adjust max-w/max-h as needed
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking image
            >
              {/* FIX: Replaced <img> with next/image */}
              <Image
                src={activeImage}
                alt="Enlarged view"
                fill // Use fill to cover the parent div
                style={{ objectFit: 'contain' }} // Maintain aspect ratio within bounds
                className="block" // Removed max-w/max-h, handled by parent
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px" // Optional: provide sizes for optimization
              />
              <button
                onClick={closeImageModal}
                className="absolute -top-2 -right-2 md:top-2 md:right-2 text-white text-3xl bg-black/50 rounded-full p-1 leading-none w-8 h-8 flex items-center justify-center"
                aria-label="Close image"
              >&times;</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}