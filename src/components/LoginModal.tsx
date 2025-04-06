// src/components/LoginModal.tsx
"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { FiX, FiLogIn } from "react-icons/fi";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/60 dark:bg-[#111]/60 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center border border-gray-300 dark:border-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          aria-label="Close login modal"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-[#6a6e4a] dark:text-white">
          Welcome to TreeHouse
        </h2>

        <button
          onClick={() => {
            signIn("google");
            onClose();
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FiLogIn size={20} />
          Sign in with Google
        </button>

        <button
          disabled
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 text-white rounded-lg opacity-60 cursor-not-allowed"
        >
          Email & Password (Coming Soon)
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
