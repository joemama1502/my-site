"use client";
import { useState } from "react";
import Header from "@/components/Header";
import CardGrid from "@/components/CardGrid";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <Sidebar />
      <main className={`${darkMode ? "bg-[#1e1e1e] text-white" : "bg-[#e8e0da] text-black"} min-h-screen px-2 sm:px-6 py-8 transition-colors duration-300`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <CardGrid darkMode={darkMode} />
      </main>
    </>
  );
}