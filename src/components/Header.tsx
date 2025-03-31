"use client";
import Image from "next/image";

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  return (
    <header className="flex flex-col items-center mb-8">
      {/* Logo */}
      <div className="relative w-[300px] sm:w-[400px] h-[150px] sm:h-[200px] mb-4">
        <Image
          src={darkMode ? "/logo-white.png" : "/logo.png"}
          alt="PromptTreehouse Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        className="w-full max-w-xl rounded-full px-4 py-2 border border-[#ccc] bg-white text-black shadow-sm focus:outline-none"
      />

      {/* Icon Row */}
      <div className="mt-4 flex gap-6 justify-center items-center">
        <button className="w-10 h-10" onClick={() => console.log("Seed clicked")}>
          <Image src="/icons/seed.png" alt="Seed Icon" width={40} height={40} />
        </button>
        <button className="w-10 h-10" onClick={() => console.log("Leaf clicked")}>
          <Image src="/icons/leaf.png" alt="Leaf Icon" width={40} height={40} />
        </button>
        <button className="w-10 h-10" onClick={() => console.log("Tree clicked")}>
          <Image src="/icons/tree.png" alt="Tree Icon" width={40} height={40} />
        </button>
        <button className="w-10 h-10" onClick={() => setDarkMode(!darkMode)}>
          <Image src="/icons/moon.png" alt="Dark Mode Toggle" width={40} height={40} />
        </button>
      </div>
    </header>
  );
}

