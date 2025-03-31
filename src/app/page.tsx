"use client";

export default function Home() {
  const placeholders = Array.from({ length: 12 });

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-green-800 mb-2">🌱 PromptTreehouse</h1>
      <p className="text-lg text-green-700 mb-10 text-center max-w-xl">
        Explore creative seeds, branch into new ideas, and grow the forest.
      </p>

      {/* Pinterest-style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="bg-white aspect-[3/4] rounded-xl shadow-md border border-green-100 flex items-center justify-center text-green-300 text-2xl font-bold"
          >
            +
          </div>
        ))}
      </div>
    </main>
  );
}