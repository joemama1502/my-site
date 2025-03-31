"use client";
import Image from "next/image";

export default function Home() {
  const cardHeights = [200, 240, 180, 300, 260, 210, 170, 280, 220, 190, 310, 230];

  return (
    <main className="min-h-screen bg-[#e8e0da] px-6 py-8">
      {/* Header */}
      <header className="flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="PromptTreehouse Logo"
          width={150}
          height={150}
          className="mb-4"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-xl rounded-full px-4 py-2 border border-[#ccc] bg-white shadow-sm focus:outline-none"
        />
      </header>

      {/* Pinterest-style masonry grid with random card heights */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
        {cardHeights.map((height, idx) => (
          <div
            key={idx}
            className="break-inside-avoid bg-white rounded-xl shadow-md border border-[#ddd] flex items-center justify-center text-[#ccc] text-3xl font-bold"
            style={{ height: `${height}px` }}
          >
            +
          </div>
        ))}
      </div>
    </main>
  );
}
