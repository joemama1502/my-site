// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic"; // Use Masonic
import SeedCard, { SeedCardData } from "./SeedCard"; // Import SeedCard and its data type

// Define CardType if needed independently
export type CardType = "square" | "wide" | "classic" | "phone";

// Define CardData explicitly. Ensure it includes all properties needed by SeedCard.
// Or, if SeedCardData is sufficient, import and use that type directly.
export interface CardData {
  type: CardType;
  seed: number | string;
  id: string | number;
  imageUrl: string;
  // Add other properties like hits, branches if they are part of CardData
  hits?: number;
  branches?: number;
}

// Removed duplicate interface: export interface CardData extends SeedCardData {}

interface CardGridProps {
  cards: CardData[]; // Use the defined CardData
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

// This component wraps SeedCard, adapting it for Masonic's `render` prop
const MasonryCard = ({ data }: { data: CardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
    // Separate the props for SeedCard from the extra props (darkMode, onImageClick)
    const { darkMode, onImageClick, ...seedData } = data;
    // Pass the remaining data directly to SeedCard. Ensure SeedCard expects these props.
    // Removed potentially unsafe cast 'as SeedCardData'. Types should align.
    return ( <SeedCard seed={seedData} darkMode={darkMode} onImageClick={onImageClick} /> );
};

// --- Helper Hook to get Window Width (Client-side only) ---
function useWindowWidth() {
  // Initialize width based on window if available, otherwise 0
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Don't run effect on server

    const handleResize = () => setWidth(window.innerWidth);
    // Set width on mount in case it wasn't set in useState (e.g., SSR)
    if (width === 0) {
        setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, [width]); // Re-run if width was initially 0

  return width;
}
// --- End Helper Hook ---

export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  const windowWidth = useWindowWidth();

  // --- Calculate Column Count based on Window Width ---
  const getColumnCount = (width: number): number => {
    if (width <= 0) return 1; // Avoid 0 columns, default to 1 if width is 0 initially
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };
  const columnCount = getColumnCount(windowWidth);
  // --- End Column Count Calculation ---

  // --- Calculate Gutter based on Window Width ---
  const getGutter = (width: number): number => {
      if (width < 768) return 8; // Using 8px gutter for mobile example
      return 16; // Default gutter
  };
  const columnGutter = getGutter(windowWidth);
  // --- End Gutter Calculation ---

  // Handle loading state / no cards (removed duplicate return)
  if (!cards || cards.length === 0) {
    return ( <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading seeds...</div> );
  }

  // Prepare items for Masonic, adding necessary props for MasonryCard
  const itemsWithProps = cards.map(card => ({ ...card, darkMode, onImageClick }));

  // Prevent rendering Masonic with 0 columns during initial SSR or before width is calculated
  if (columnCount <= 0) {
     return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Calculating layout...</div>;
  }

  // Optional: Logs for debugging column/gutter calculation
  // console.log("Window Width:", windowWidth);
  // console.log("Calculated Columns:", columnCount);
  // console.log("Calculated Gutter:", columnGutter);

  // Return the Masonic layout (Removed the CSS Column layout)
  return (
    <Masonry
        items={itemsWithProps} // Pass the prepared items
        columnCount={columnCount} // Use calculated columns
        columnGutter={columnGutter} // Use calculated gutter
        render={MasonryCard} // Component to render each item
        overscanBy={5} // Render items slightly outside viewport for smoother scrolling
        key={`masonry-cols-${columnCount}`} // Force re-render if column count changes
    />
  );
}