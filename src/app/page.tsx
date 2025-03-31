"use client";

export default function Home() {
  const placeholders = Array.from({ length: 18 });

  return (
    <main className="min-h-screen bg-[#e8e0da] px-6 py-8">
      {/* Header */}
      <header className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-[#95978b]">🌱 PromptTreehouse</h1>
        <input
          type="text"
          placeholder="Search"
          className="mt-4 w-full max-w-xl rounded-full px-4 py-2 border border-[#ccc] bg-white shadow-sm focus:outline-none"
        />
      </header>

      {/* Pinterest-style masonry grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="break-inside-avoid bg-white rounded-xl shadow-md border border-[#ddd] p-4 flex items-center justify-center text-[#ccc] text-3xl font-bold h-[200px]"
          >
            +
          </div>
        ))}
      </div>
    </main>
  );
}