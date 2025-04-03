// src/components/LoginModal.tsx
"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { FiX, FiLogIn } from "react-icons/fi"; // Using FiLogIn for Google icon placeholder

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose} // Close modal if overlay is clicked
    >
      {/* Modal Content */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          aria-label="Close login modal"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Welcome!
        </h2>

        {/* Google Sign-In Button */}
        <button
          onClick={() => {
             signIn('google');
             onClose(); // Close modal after initiating sign in
            }
          }
          className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FiLogIn size={20}/> {/* Placeholder icon - replace with Google 'G' if desired */}
          Continue with Google
        </button>

        {/* Placeholder for other methods if needed later */}
        {/* <p className="text-sm text-gray-500 dark:text-gray-400 my-4">OR</p> */}
        {/* Add Email/Password fields or other providers here */}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          {/* Link these later */}
        </p>
      </div>
    </div>
  );
}