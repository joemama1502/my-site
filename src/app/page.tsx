// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
// --- CORRECTED Component Imports ---
import Header from "@/components/Header";
import CardGrid, { CardData, CardType } from "@/components/CardGrid";
// import CreateSeedModal from '@/components/CreateSeedModal'; // Usually handled by Header
// import LoginModal from '@/components/LoginModal';       // Usually handled by Header
// import AuthControl from '@/components/AuthControl';       // Usually handled by Header

// --- Other Imports ---
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';


export default function Home() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  // --- Hooks & Logic ---
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0, rootMargin: "400px 0px 0px 0px" });

  const generateCards = useCallback((count: number, offset: number = 0): CardData[] => {
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    return Array.from({ length: count }, (_, i) => {
       const seed = offset + i + 1;
       const type = types[Math.floor(Math.random() * types.length)];
       return { type: type, seed: seed, id: `card-${seed}-${type}-${Math.random()}`, imageUrl: `https://picsum.photos/seed/${seed}/600/400`, hits: Math.floor(Math.random() * 500) + 1, branches: Math.floor(Math.random() * 50) + 1, };
    });
  }, []);

  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasNextPage) return; setIsLoading(true); console.log("Loading more cards..."); setTimeout(() => { setCards((prev) => { const newCards = generateCards(16, prev.length); return [...prev, ...newCards]; }); setIsLoading(false); }, 800);
  }, [generateCards, isLoading, hasNextPage]);

  // --- Effects ---
  useEffect(() => { // Initial load
    if (typeof window !== 'undefined' && cards.length === 0) { const initialCards = generateCards(32); setCards(initialCards); }
  }, [generateCards]);

  useEffect(() => { // Infinite scroll
    if (inView && !isLoading) { loadMoreItems(); }
  }, [inView, loadMoreItems, isLoading]);

   useEffect(() => { // Modal escape key
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveImage(null); }; if (typeof window !== 'undefined') { window.addEventListener("keydown", handleEsc); return () => window.removeEventListener("keydown", handleEsc); } return () => {};
   }, []);

  // --- Modal Handlers ---
  const openImageModal = useCallback((imageUrl: string) => { setActiveImage(imageUrl); }, []);
  const closeImageModal = useCallback(() => { setActiveImage(null); }, []);

  // --- Render ---
  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${ darkMode ? "bg-[#121212] text-white" : "bg-[#ece1d6] text-black" }`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="px-4 pb-10 pt-8 transition-colors duration-500">

        {/* Static AuthControl removed */}

        <CardGrid cards={cards} darkMode={darkMode} onImageClick={openImageModal} />

        {isLoading && ( <div className="text-center py-6"> <p className="text-gray-500 dark:text-gray-400">Loading more...</p> </div> )}

        <div ref={loadMoreRef} style={{ height: "1px" }} />

      </main>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {activeImage && ( <motion.div className="fixed inset-0 z-[1005] bg-black/80 flex items-center justify-center p-4" onClick={closeImageModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}> <motion.div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}> <img src={activeImage} alt="Enlarged view" className="block object-contain max-w-full max-h-[90vh]" /> <button onClick={closeImageModal} className="absolute -top-2 -right-2 md:top-2 md:right-2 text-white text-3xl bg-black/50 rounded-full p-1 leading-none w-8 h-8 flex items-center justify-center" aria-label="Close image">&times;</button> </motion.div> </motion.div> )}
      </AnimatePresence>
    </div>
  );
}