"use client";
import { useEffect, useState } from "react";

type CardType = "square" | "wide" | "classic" | "phone";

export default function CardGrid({ darkMode }: { darkMode: boolean }) {
  const [cards, setCards] = useState<{ type: CardType; seed: number }[]>([]);

  useEffect(() => {
    const types: CardType[] = ["square", "wide", "classic", "phone"];
    const newCards = Array.from({ length: 32 }, (_, i) => ({
      type: types[Math.floor(Math.random() * types.length)],
      seed: i + 1,
    }));
    setCards(newCards);
  }, []);

  const getAspectStyle = (type: CardType) => {
    switch (type) {
      case "square":
        return "aspect-square sm:aspect-square";
      case "wide":
        return "aspect-video sm:aspect-video";
      case "classic":
        return "aspect-[4/3] sm:aspect-[4/3]";
      case "phone":
        return "aspect-[9/16] sm:aspect-[9/16]";
      default:
        return "aspect-square sm:aspect-square";
    }
  };

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
      {cards.map((card, idx) => {
        const imageUrl = `https://picsum.photos/seed/${card.seed}/600/400`;
        return (
          <div
            key={idx}
            className={`break-inside-avoid overflow-hidden cursor-pointer ${
              darkMode ? "bg-[#2a2a2a] border-[#444]" : "bg-white border-[#ddd]"
            } rounded-xl shadow-md transform transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl ${getAspectStyle(card.type)}`}
            onClick={() => console.log("Clicked", card.seed)}
          >
            <img
              src={imageUrl}
              alt={`Preview ${card.seed}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
