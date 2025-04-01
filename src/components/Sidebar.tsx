// src/components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { FiSettings, FiGitBranch, FiAperture, FiX, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  username?: string;
}

export default function Sidebar({ username = "@Username" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // --- Updated Sidebar Variants for "Bubble" effect ---
  const sidebarVariants = {
    closed: {
      // Start slightly scaled down, faded out, and maybe slightly off-screen
      opacity: 0,
      scale: 0.9,
      x: "-20%", // Optional: keeps some leftward motion hint
      transition: {
        type: "tween",
        ease: "easeIn", // Smooth exit
        duration: 0.25
      }
    },
    open: {
      // Animate to full size, opacity, and on-screen position
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring", // Spring for a nice "bubble" pop
        stiffness: 180,
        damping: 20,
        // Stagger children if menu items were animated individually
        // delayChildren: 0.2,
        // staggerChildren: 0.05
      }
    },
  };
  // --- End Updated Variants ---

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      {/* Trigger Button (no changes needed) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-[1001] w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-gray-800 dark:focus:ring-white"
        aria-label="Open user menu"
      >
        <FiUser size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay (optional: adjust blur/opacity) */}
            <motion.div
              key="sidebar-overlay"
              // Slightly less opacity, keep subtle blur
              className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar Menu Content */}
            <motion.div
              key="sidebar-menu"
              className={`fixed top-0 left-0 h-full w-64 shadow-xl z-[1002] flex flex-col p-4
                 text-white
                 // --- Added Background Blur and Transparency ---
                 bg-[#2a2a2a]/85 backdrop-blur-lg
                 // --- End Background Blur ---
                 will-change-transform, will-change-opacity // Hint browser about animations
                 `}
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants} // Use updated variants
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Profile (no changes needed) */}
              <div className="mb-6 flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-black">
                   {username?.charAt(1)?.toUpperCase() || 'U'}
                 </div>
                 <button
                   onClick={() => (window.location.href = "/profile")}
                   className="text-left font-semibold hover:text-green-300 transition text-lg"
                 >
                   {username}
                 </button>
              </div>

              {/* Menu Items (no changes needed, but could be animated with staggerChildren) */}
              <nav className="flex flex-col gap-2 flex-grow">
                <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 hover:text-green-300 transition text-left">
                  <FiGitBranch size={20} /> Branches
                </button>
                <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 hover:text-green-300 transition text-left">
                  <FiAperture size={20} /> Trees
                </button>
                <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 hover:text-green-300 transition text-left">
                  <FiSettings size={20} /> Settings
                </button>
              </nav>

              {/* Close Button (no changes needed) */}
              <div className="mt-auto pt-4 border-t border-gray-600">
                <button
                  className="flex w-full items-center gap-3 p-2 rounded text-red-400 hover:bg-gray-700/50 hover:text-red-500 transition text-left"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close user menu"
                >
                  <FiX size={20} /> Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}