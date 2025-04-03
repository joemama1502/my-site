// src/components/SeedCard.tsx
"use client";

import { useState, useRef } from "react"; // Removed useEffect as it wasn't used
import { motion } from "framer-motion";
import Image from 'next/image';

// CardType definition
export type CardType = "square" | "wide" | "classic" | "phone";

// SeedCardData interface
export interface SeedCardData {
  type: CardType;
  seed: number | string;
  id: string | number;
  imageUrl: string;
  hits: number;
  branches: number;
}

// Component props
interface SeedCardProps {
  seed: SeedCardData;
  darkMode: boolean;
  onImageClick: (imageUrl: string) => void;
}

const pastelGlowColors = [
  '#F9A8D4', '#93C5FD', '#6EE7B7', '#FDBA74', '#C4B5FD',
];

const getAspectStyle = (type: CardType) => {
  switch (type) {
    case "square": return "aspect-square";
    case "wide": return "aspect-video";
    case "classic": return "aspect-[4/3]";
    case "phone": return "aspect-[9/16]";
    default: return "aspect-square";
  }
};

export default function SeedCard({ seed, darkMode, onImageClick }: SeedCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const glowColorRef = useRef<string | null>(null);

  const handleHoverStart = () => {
    const randomColor = pastelGlowColors[Math.floor(Math.random() * pastelGlowColors.length)];
    glowColorRef.current = randomColor;
    setIsHovering(true);
  };

  const handleHoverEnd = () => {
    setIsHovering(false);
  };

  return (
    <motion.div
      layout
      // --- MODIFIED className FOR RESPONSIVE BORDER/PADDING/SHADOW ---
      className={`overflow-hidden cursor-pointer relative flex flex-col
        p-1 md:p-2  // Smaller padding on mobile (p-0.5), default p-1 on medium+
        ${darkMode ? "bg-[#2a2a2a] border-gray-700" : "bg-white border-gray-200"}
         rounded-xl
         shadow-none md:shadow-md // No shadow on mobile, shadow-md on medium+
         border transform`} // Keep 1px border always
      // --- END MODIFICATIONS ---
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={() => onImageClick(seed.imageUrl)}
    >
        {/* Glow Element */}
        <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none" // Match parent rounding
            style={{ backgroundColor: glowColorRef.current ?? 'transparent' }}
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
         />
         {/* End Glow Element */}

        {/* Image container */}
        {/* Ensure inner rounding matches outer padding difference if needed */}
        <div className={`w-full overflow-hidden relative rounded-lg ${getAspectStyle(seed.type)}`}>
            <Image
                src={seed.imageUrl}
                alt={`Card image ${seed.seed}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw" // Keep existing sizes
                className="object-cover transition-transform duration-300 ease-in-out" // Removed rounding here, parent div handles clipping
                loading="lazy"
            />
            {/* Stats Overlay */}
            <div className={`absolute bottom-1 left-1 md:bottom-1.5 md:left-1.5 z-10 // Adjusted position slightly for smaller padding
                            text-xs text-gray-100 px-2 py-1 rounded-md
                            [text-shadow:0_1px_1px_rgb(0_0_0_/_0.7)] pointer-events-none
                            bg-gradient-to-t from-black/60 to-transparent`}>
               <span className="inline-block mr-1" role="img" aria-label="hits">🌱</span>
               {seed.hits} hits
               <span className="mx-1.5">•</span>
               <span className="inline-block mr-1" role="img" aria-label="branches">🌿</span>
               {seed.branches} branches
            </div>
        </div>
    </motion.div>
  );
}