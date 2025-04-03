// src/components/CreateSeedModal.tsx
"use client";

// FIX: Added useEffect to the import list
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

// Define UI Colors (includes correct theme backgrounds and placeholder for icon)
const uiColors = {
  pink: { light: 'bg-pink-100', dark: 'bg-pink-900/30' },
  blue: { light: 'bg-blue-100', dark: 'bg-blue-900/30' },
  green: { light: 'bg-green-100', dark: 'bg-green-900/30' },
  yellow: { light: 'bg-yellow-100', dark: 'bg-yellow-900/30' },
  background: { light: 'bg-[#ece1d6]/95', dark: 'bg-[#121212]/95' }, // Background for modal box
  text: { light: 'text-gray-700', dark: 'text-gray-300' },
  placeholder: { light: 'placeholder-gray-500', dark: 'placeholder-gray-500' },
  icon: { light: 'text-gray-400', dark: 'text-gray-500' }, // Added placeholder icon color
  button: { light: 'bg-green-500 hover:bg-green-600', dark: 'bg-green-600 hover:bg-green-700' }, // Example button colors
  buttonText: { light: 'text-white', dark: 'text-white' },
};

export default function CreateSeedModal({ isOpen, onClose, darkMode }: CreateSeedModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle clicking the upload area
  const handleImageUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Function to handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: Handle actual file upload logic here (e.g., upload to server/storage)
      console.log("File selected:", file.name);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = useCallback(() => {
    // TODO: Implement actual seed creation logic (e.g., API call)
    console.log("Submitting seed:", { title, description, imagePreview });
    // Close modal after submission (optional)
    // onClose();
    // Reset form state (optional)
    // setTitle("");
    // setDescription("");
    // setImagePreview(null);
  }, [title, description, imagePreview /*, onClose */]); // Add onClose if called

  // Reset state when modal closes
  useEffect(() => { // This line requires useEffect to be imported
    if (!isOpen) {
      // Optionally add a small delay to allow exit animation
      setTimeout(() => {
        setImagePreview(null);
        setTitle("");
        setDescription("");
      }, 300); // Match exit animation duration
    }
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        // Overlay - Using light blur
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} // Close modal on overlay click
        >
          {/* Modal Content Box - Includes correct background colors and blur */}
          <motion.div
            key="modal-content"
            className={`relative p-6 rounded-3xl shadow-xl w-full max-w-sm mx-4 flex flex-col gap-4 min-h-[450px] backdrop-blur-md ${darkMode ? uiColors.background.dark : uiColors.background.light} ${darkMode ? uiColors.text.dark : uiColors.text.light}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            {/* --- Form Content --- */}

            {/* Image Upload Area */}
            <div
              onClick={handleImageUploadClick}
              className={`relative w-full h-40 rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center cursor-pointer overflow-hidden group ${darkMode ? 'hover:border-gray-500' : 'hover:border-gray-400'} transition`}
            >
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              {imagePreview ? (
                // Use next/image with fill prop and style object
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill // Use fill prop
                  style={{ objectFit: 'cover' }} // Use style object for objectFit
                  className="opacity-90 rounded-2xl"
                />
              ) : (
                <div className={`flex flex-col items-center ${darkMode ? uiColors.icon.dark : uiColors.icon.light}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-sm">Upload Image</span>
                </div>
              )}
              {/* Optional: Add an overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                 <span className="text-white text-sm font-semibold">Change Image</span>
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title your seed..."
              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-black/20 border-gray-600' : 'bg-white/50 border-gray-300'} ${darkMode ? uiColors.placeholder.dark : uiColors.placeholder.light} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-green-500' : 'focus:ring-green-600'} transition`}
            />

            {/* Description Textarea */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-black/20 border-gray-600' : 'bg-white/50 border-gray-300'} ${darkMode ? uiColors.placeholder.dark : uiColors.placeholder.light} resize-none focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-green-500' : 'focus:ring-green-600'} transition`}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`w-full p-2 rounded-lg mt-auto transition ${darkMode ? uiColors.button.dark : uiColors.button.light} ${darkMode ? uiColors.buttonText.dark : uiColors.buttonText.light} font-semibold`}
            >
              Plant Seed
            </button>

            {/* Optional: Close button inside modal */}
            {/* <button onClick={onClose} className="absolute top-3 right-3 text-xl">&times;</button> */}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}