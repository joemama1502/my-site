// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic";
// FIX: Import SeedCard and SeedCardData - SeedCardData will now be used directly
import SeedCard, { SeedCardData, CardType } from "./SeedCard"; // Assuming CardType is also exported from SeedCard or defined globally

// FIX: Removed local CardData interface definition. Using imported SeedCardData instead.
// export interface CardData { ... }

// Props now expect an array of SeedCardData
interface CardGridProps {
  cards: SeedCardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

// MasonryCard now receives data typed as SeedCardData plus extra props
const MasonryCard = ({ data }: { data: SeedCardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
    const { darkMode, onImageClick, ...seedData } = data;
    // Pass the correct props to SeedCard
    return ( <SeedCard seed={seedData} darkMode={darkMode} onImageClick={onImageClick} /> );
};

// Helper Hook to get Window Width (Client-side only)
function useWindowWidth() {
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    if (width === 0) {
        setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return width;
}

export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  const windowWidth = useWindowWidth();

  // Calculate Column Count based on Window Width
  const getColumnCount = (width: number): number => {
    if (width <= 0) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };
  const columnCount = getColumnCount(windowWidth);

  // Calculate Gutter based on Window Width
  const getGutter = (width: number): number => {
      if (width < 768) return 8;
      return 16;
  };
  const columnGutter = getGutter(windowWidth);

  // Handle loading state / no cards
  if (!cards || cards.length === 0) {
    return ( <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading seeds...</div> );
  }

  // Prepare items for Masonic (items are already SeedCardData, just add extra props)
  const itemsWithProps = cards.map(card => ({ ...card, darkMode, onImageClick }));

  // Prevent rendering Masonic with 0 columns
  if (columnCount <= 0) {
     return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Calculating layout...</div>;
  }

  // Return the Masonic layout
  return (
    <Masonry
        items={itemsWithProps}
        columnCount={columnCount}
        columnGutter={columnGutter}
        render={MasonryCard}
        overscanBy={5}
        key={`masonry-cols-${columnCount}`}
    />
  );
}