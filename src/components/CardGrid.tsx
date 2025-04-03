// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic";
import SeedCard, { SeedCardData } from "./SeedCard";

export type CardType = "square" | "wide" | "classic" | "phone";
export interface CardData extends SeedCardData {}

interface CardGridProps {
  cards: CardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

const MasonryCard = ({ data }: { data: CardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
    const { darkMode, onImageClick, ...seed } = data;
    return ( <SeedCard seed={seed as SeedCardData} darkMode={darkMode} onImageClick={onImageClick} /> );
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
    // vvv THIS IS WHERE YOU TWEAK COLUMN COUNT vvv
    if (width < 768) return 2; // Use 2 columns below 768px (md breakpoint)
    if (width < 1024) return 3; // Use 3 columns below 1024px (lg breakpoint)
    if (width < 1280) return 4; // Use 4 columns below 1280px (xl breakpoint)
    return 5;                  // Use 5 columns for 1280px and above
    // ^^^ THIS IS WHERE YOU TWEAK COLUMN COUNT ^^^
  };
  const columnCount = getColumnCount(windowWidth);
  // --- End Column Count Calculation ---

  // --- Calculate Gutter based on Window Width ---
  const getGutter = (width: number): number => {
      if (width < 768) return 6; // Smaller gutter (8px) on mobile
      return 16; // Default gutter (16px) on larger screens
  };
  const columnGutter = getGutter(windowWidth);
  // --- End Gutter Calculation ---


  if (!cards || cards.length === 0) {
    return ( <div className="text-center py-10 text-gray-500 dark:text-gray-300"> Loading seeds... </div> );
  }

  const itemsWithProps = cards.map(card => ({ ...card, darkMode, onImageClick }));

   if (windowWidth <= 0) {
      return <div className="text-center py-10">Loading layout...</div>;
   }

  // --- Add console logs right before rendering Masonry ---
  console.log("Window Width:", windowWidth);
  console.log("Calculated Columns:", columnCount);
  console.log("Calculated Gutter:", columnGutter);
  // --- End logs ---

  return (
    <Masonry
        items={itemsWithProps}
        columnCount={columnCount}      // Use calculated columns
        columnGutter={columnGutter}    // <<< USE CALCULATED GUTTER >>>
        render={MasonryCard}
        overscanBy={5}
        key={`masonry-cols-${columnCount}`} // Force re-render on column change
    />
  );
}