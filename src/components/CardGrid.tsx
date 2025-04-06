// src/components/CardGrid.tsx
"use client";

import { useState, useEffect } from 'react';
import { Masonry } from "masonic";
import SeedCard, { SeedCardData } from "./SeedCard";
export type { CardType } from "./SeedCard";

interface CardGridProps {
  cards: SeedCardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

const MasonryCard = ({ data }: { data: SeedCardData & { darkMode: boolean, onImageClick: (imageUrl: string) => void } }) => {
  const { darkMode, onImageClick, ...seedData } = data;
  return <SeedCard seed={seedData} darkMode={darkMode} onImageClick={onImageClick} />;
};

function useWindowWidth() {
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWidth(window.innerWidth);
    if (width === 0) setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return width;
}

export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  const windowWidth = useWindowWidth();

  const getColumnCount = (width: number): number => {
    if (width <= 0) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };
  const columnCount = getColumnCount(windowWidth);

  const getGutter = (width: number): number => {
    if (width < 768) return 8;
    return 16;
  };
  const columnGutter = getGutter(windowWidth);

  if (!cards || cards.length === 0) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading seeds...</div>;
  }

  const itemsWithProps = cards.map(card => ({ ...card, darkMode, onImageClick }));

  if (columnCount <= 0) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Calculating layout...</div>;
  }

  // 💡 Wrap Masonry in a container that allows overflow so glows don't get clipped
  return (
    <div className="relative overflow-visible">
      <Masonry
        items={itemsWithProps}
        columnCount={columnCount}
        columnGutter={columnGutter}
        render={MasonryCard}
        overscanBy={5}
        key={`masonry-cols-${columnCount}`}
      />
    </div>
  );
}
