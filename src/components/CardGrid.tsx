// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic";
// FIX: Only import SeedCardData directly used by this component
import SeedCard, { SeedCardData } from "./SeedCard";
// FIX: Explicitly re-export CardType so page.tsx can import it from here
export type { CardType } from "./SeedCard"; // Assuming CardType is exported from SeedCard

// Use SeedCardData for props
interface CardGridProps {
  cards: SeedCardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

// MasonryCard receives data typed as SeedCardData plus extra props
const MasonryCard = ({ data }: { data: SeedCardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
    const { darkMode, onImageClick, ...seedData } = data;
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

  // Prepare items for Masonic
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

// Also ensure SeedCard.tsx correctly defines and exports SeedCardData and CardType
// Example structure for SeedCard.tsx might be:
/*
import React from 'react';

export type CardType = "square" | "wide" | "classic" | "phone";

export interface SeedCardData {
  id: string | number;
  type: CardType;
  seed: number | string;
  imageUrl: string;
  hits?: number;
  branches?: number;
}

interface SeedCardProps {
  seed: SeedCardData;
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

const SeedCard: React.FC<SeedCardProps> = ({ seed, darkMode, onImageClick }) => {
  // ... component implementation ...
  return (
    <div onClick={() => onImageClick(seed.imageUrl)}>
       <img src={seed.imageUrl} alt={`Seed ${seed.seed}`} loading="lazy" />
       // ... other card details ...
    </div>
  );
};

export default SeedCard;
*/
