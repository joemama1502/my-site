// src/app/page.tsx
"use client";

// FIX: Removed unused 'Sidebar' import, added missing dependencies to hooks
import { useEffect, useState, useCallback } from "react";
import Image from 'next/image'; // Import Next.js Image component

// Component Imports
import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar"; // Removed unused import
import CardGrid, { SeedCardData, CardType } from "@/components/CardGrid"; // Use SeedCardData directly

// Animation and Utility Imports
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';

// Define CardType if needed independently, or import from CardGrid if exported there
// type CardType = "square" | "wide" | "classic" | "phone";

export default function Home() {
  // --- State ---
  const [darkMode, setDarkMode] = useState(false);
  const [cards, setCards] = useState<SeedCardData[]>([]); // Use SeedCardData
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true); // Keep setter for potential future use

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
        id: `card-<span class="math-inline">\{seed\}\-</span>{type}-${Math.random()}`,
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
        // if (newCards.length === 0) {
        //   setHasNextPage(false); // Call the setter here when implemented
        // }
        return [...prev, ...newCards];
      });
      setIsLoading(false);
    }, 800);

  // FIX: Removed unnecessary dependency 'setHasNextPage' because it's not called inside
  }, [generateCards, isLoading, hasNextPage]);

  // --- Effects ---

  // Effect for initial card load
  useEffect(() => {
    if (typeof window !== 'undefined' && cards.length === 0) {
      console.log("Loading initial cards...");
      const initialCards = generateCards(32);
      setCards(initialCards);
    }
  // FIX: Added missing dependency 'cards.length'
  }, [generateCards, cards.length]);

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
    <div
      className={`min-h-screen transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#ece1d6] text-black"