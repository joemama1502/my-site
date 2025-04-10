"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import SeedCard, { SeedCardData } from "./SeedCard";

interface CardGridProps {
  cards: SeedCardData[];
  onImageClick: (card: SeedCardData) => void;
  lastCardRef?: (node: HTMLDivElement) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onImageClick, lastCardRef }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-300 bg-white">
        No seeds found...
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 px-4 sm:px-8 space-y-4 bg-white">
      {cards.map((card, index) => (
        <div
          key={card.id} 
          ref={index === cards.length - 1 ? lastCardRef : undefined}
          className="break-inside-avoid"
        >
          <SeedCard
            seed={card}
            onImageClick={() => onImageClick(card)}
            priority={index < 4}
          />
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
