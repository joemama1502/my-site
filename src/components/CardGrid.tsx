// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic";
import SeedCard, { SeedCardData } from "./SeedCard"; // Import SeedCardData

// FIX: Removed redundant CardType and CardData interface. Using SeedCardData directly.
// export type CardType = "square" | "wide" | "classic" | "phone"; // Remove if defined in SeedCard
// export interface CardData extends SeedCardData {} // Removed - use SeedCardData

interface CardGridProps {
  cards: SeedCardData[]; // Use SeedCardData
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

// FIX: Update prop type to use SeedCardData
const MasonryCard = ({ data }: { data: SeedCardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
    const { darkMode, onImageClick, ...seed } = data;
    // Ensure SeedCard expects 'seed' prop with SeedCardData type
    return ( <SeedCard seed={seed} darkMode={darkMode} onImageClick={onImageClick} /> );
};

// --- Helper Hook to get Window Width (Client-side only) ---
function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      setWidth(window.innerWidth); // Set initial width
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize); // Cleanup
    }
    return () => {};
  }, []);
  return width;
}
// --- End Helper Hook ---


export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  const windowWidth = useWindowWidth();

  // --- Calculate Column Count based on Window Width ---
  const getColumnCount = (width: number): number => {
    if (width <= 0) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };
  const columnCount = getColumnCount(windowWidth);
  // --- End Column Count Calculation ---

  // --- Calculate Gutter based on Window Width ---
  const getGutter = (width: number): number => {
      if (width < 768) return 6;
      return 16;
  };
  const columnGutter = getGutter(windowWidth);
  // --- End Gutter Calculation ---


  if (!cards || cards.length === 0) {
    return ( <div className="text-center py-10 text-gray-500 dark:text-gray-300"> Loading seeds... </div> );
  }

  // FIX: Ensure card shape matches SeedCardData and extra props expected by MasonryCard
  const itemsWithProps = cards.map(card => ({ ...card, darkMode, onImageClick }));

   if (windowWidth <= 0) {
      return <div className="text-center py-10">Loading layout...</div>;
   }

  // --- Console logs (Consider removing for production) ---
  // console.log("Window Width:", windowWidth);
  // console.log("Calculated Columns:", columnCount);
  // console.log("Calculated Gutter:", columnGutter);
  // --- End logs ---

  return (
    <Masonry
        items={itemsWithProps} // Pass items with darkMode and onClick handler
        columnCount={columnCount}
        columnGutter={columnGutter}
        render={MasonryCard} // Use the wrapper component
        overscanBy={5}
        key={`masonry-cols-${columnCount}`} // Force re-render on column change
    />
  );
}