"use client";

import SeedCard, { SeedCardData } from "./SeedCard";

interface CardGridProps {
  cards: SeedCardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-300">
        No seeds found...
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 px-4 sm:px-8 space-y-4">
      {cards.map((card) => (
        <div key={card.id} className="break-inside-avoid">
          <SeedCard
            seed={card}
            darkMode={darkMode}
            onImageClick={onImageClick}
          />
        </div>
      ))}
    </div>
  );
}
