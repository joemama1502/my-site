// src/components/SeedCard.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type CardType = "square" | "wide" | "classic" | "phone";

export interface SeedCardData {
  type: CardType;
  seed: number | string;
  id: string | number;
  imageUrl: string;
  hits: number;
  branches: number;
}

interface SeedCardProps {
  seed: SeedCardData;
  onImageClick: (imageUrl: string) => void;
}

const pastelGlowColors = [
  "#F9A8D4", "#93C5FD", "#6EE7B7", "#FDBA74", "#C4B5FD", "#FCD34D",
  "#FCA5A5", "#5EEAD4", "#A5F3FC", "#D8B4FE", "#FBCFE8", "#FDE68A",
  "#E0F2FE", "#F87171", "#86EFAC", "#BFDBFE"
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

export default function SeedCard({ seed, onImageClick }: SeedCardProps) {
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
      className="relative z-20 flex flex-col cursor-pointer p-1 md:p-[2px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] transform shadow-none md:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { type: "spring", stiffness: 300, damping: 22 }
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={() => onImageClick(seed.imageUrl)}
    >
      <motion.div
        className="absolute -inset-0.25 z-0 rounded-2xl pointer-events-none"
        style={{
          backgroundColor: glowColorRef.current ?? "transparent",
          filter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      <div className={`w-full overflow-hidden relative z-10 rounded-lg ${getAspectStyle(seed.type)}`}>
        <Image
          src={seed.imageUrl}
          alt={`Card image ${seed.seed}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
        <div className="absolute bottom-1 left-1 md:bottom-1.5 md:left-1.5 z-10 text-xs text-gray-100 px-2 py-1 rounded-md [text-shadow:0_1px_1px_rgb(0_0_0_/_0.7)] pointer-events-none bg-gradient-to-t from-black/60 to-transparent">
          <span role="img" aria-label="hits">🌱</span> {seed.hits} hits
          <span className="mx-1.5">•</span>
          <span role="img" aria-label="branches">🌿</span> {seed.branches} branches
        </div>
      </div>
    </motion.div>
  );
}
