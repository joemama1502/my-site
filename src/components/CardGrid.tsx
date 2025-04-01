// src/components/CardGrid.tsx
"use client";

import { motion } from "framer-motion";

export type CardType = "square" | "wide" | "classic" | "phone";

export interface CardData {
  type: CardType;
  seed: number | string;
  id: string | number;
  imageUrl: string;
}

interface CardGridProps {
  cards: CardData[];
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

const getAspectStyle = (type: CardType) => {
  switch (type) {
    case "square": return "aspect-square";
    case "wide": return "aspect-video";
    case "classic": return "aspect-[4/3]";
    case "phone": return "aspect-[9/16]";
    default: return "aspect-square";
  }
};

export default function CardGrid({ cards, darkMode, onImageClick }: CardGridProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {/* Loading... or No images found. */}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          layout // Keep layout animation
          className={`break-inside-avoid overflow-hidden cursor-pointer ${
            darkMode ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"
            // Remove hover:-translate-y-2 from here, Framer Motion will handle hover
          } rounded-xl shadow-md border transform transition-shadow duration-300 ease-in-out hover:shadow-xl ${getAspectStyle(
            card.type
          )}`}
           // Entry Animation
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }} // Entry transition

          // --- New Hover Effect ---
          whileHover={{
             y: -8,          // Lift card by 8 pixels
             scale: 1.03,    // Slightly scale up card
             transition: {
               type: "spring", // Use spring for a bouncier, premium feel
               stiffness: 300,
               damping: 20,
               duration: 0.2 // Hint duration, spring physics dominate
             }
           }}
           // --- End New Hover Effect ---

          onClick={() => onImageClick(card.imageUrl)}
        >
          <img
            src={card.imageUrl}
            alt={`Card image ${card.seed}`}
            loading="lazy"
            className="w-full h-full object-cover"
            // You could potentially add a slight scale to the image itself too if desired:
            // className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            // (Requires adding 'group' to the motion.div above)
          />
        </motion.div>
      ))}
    </div>
  );
}