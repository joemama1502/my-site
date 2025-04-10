"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Header from "@/components/Header";
import CardGrid from "@/components/CardGrid";
import { SeedCardData } from "@/components/SeedCard";

function getRandomType(): SeedCardData["type"] {
  const types = ["square", "wide", "classic", "phone"] as const;
  return types[Math.floor(Math.random() * types.length)];
}

function generateMockCards(count: number, startId = 0): SeedCardData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    seed: `Seed ${startId + i + 1}`,
    imageUrl: `https://picsum.photos/seed/${startId + i}/600/400`,
    type: getRandomType(),
    hits: Math.floor(Math.random() * 1000),
    branches: Math.floor(Math.random() * 50),
  }));
}

export default function HomePage() {
  const [cards, setCards] = useState<SeedCardData[]>([]);
  const [page, setPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreCards = useCallback(() => {
    const newCards = generateMockCards(20, page * 20);
    setCards((prev) => [...prev, ...newCards]);
    setPage((prev) => prev + 1);
  }, [page]);

  const lastCardRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreCards();
      }
    });

    if (node) observer.current.observe(node);
  }, [loadMoreCards]);

  useEffect(() => {
    loadMoreCards(); // initial load
  }, []);

  const handleImageClick = (card: SeedCardData) => {
    console.log("Clicked image:", card.imageUrl);
  };

  return (
    <main className="bg-white text-black dark:text-white transition-colors min-h-screen">
      <Header />
      <div className="pt-[10px] pb-12 px-2 sm:px-4 md:px-6 bg-white">
        <CardGrid
          cards={cards}
          onImageClick={handleImageClick}
          lastCardRef={lastCardRef}
        />
      </div>
    </main>
  );
}
