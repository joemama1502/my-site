// src/app/settings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div className="backdrop-blur-xl bg-white/60 dark:bg-[#111]/60 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
        <h1 className="text-2xl font-semibold mb-4 text-center text-[#6a6e4a] dark:text-white">
          Settings (Placeholder)
        </h1>
        <p className="text-center">
          Here you will be able to customize your TreeHouse experience. 🌿
        </p>
      </div>
    </div>
  );
}