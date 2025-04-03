// src/components/CreateSeedModal.tsx
// This code already implements the requested background colors and blur

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Define the props
interface CreateSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

// Define UI Colors (includes correct theme backgrounds)
const uiColors = {
  pink: { light: 'bg-pink-100', dark: 'bg-pink-900/30' },
  blue: { light: 'bg-blue-100', dark: 'bg-blue-900/30' },
  green: { light: 'bg-green-100', dark: 'bg-green-900/30' },
  yellow: { light: 'bg-yellow-100', dark: 'bg-yellow-900/30' },
  // Using the requested theme background colors with opacity
  background: { light: 'bg-[#ece1d6]/95', dark: 'bg-[#121212]/95' },
  text: { light: 'text-gray-700', dark: 'text-gray-300' },
  placeholder: { light: 'placeholder-gray-500', dark: 'placeholder-gray-500' },
  icon: { light: 'text-gray-500', dark: 'text-gray-400' }
};

export default function CreateSeedModal({ isOpen, onClose, darkMode }: CreateSeedModalProps) {
  // State, Refs, Effects, Handlers remain the same...
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    } else {
      setFile(null);
      setImagePreview(null);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Planting seed with:", { description, tag, file });
    // --- LATER: Add logic for actual upload ---
    setDescription('');
    setTag('');
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Overlay - Using light blur
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm" // Kept light overlay blur
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Modal Content Box - Includes correct background colors and blur */}
          <motion.div
            key="modal-content"
            className={`relative p-6 rounded-3xl shadow-xl w-full max-w-sm mx-4 flex flex-col gap-4 min-h-[450px] backdrop-blur-md ${darkMode ? uiColors.background.dark : uiColors.background.light} ${darkMode ? uiColors.text.dark : uiColors.text.light}`} // Already has correct classes
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
             <button onClick={onClose} className={`absolute top-4 right-4 p-1 rounded-full z-10 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 flex-grow">
               {/* Content remains the same as previous version... */}

              {/* 1. Upload Block */}
              <motion.div
                className={`flex-grow flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden min-h-[200px] ${darkMode ? uiColors.pink.dark : uiColors.pink.light} ${darkMode ? 'hover:bg-pink-900/40' : 'hover:bg-pink-200/80'} transition-colors`}
                onClick={triggerFileInput}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover" className="opacity-90 rounded-2xl" /> // Added rounding
                ) : (
                  <div className={`flex flex-col items-center ${darkMode ? uiColors.icon.dark : uiColors.icon.light}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-1"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                     <span className="text-sm">upload</span>
                  </div>
                )}
              </motion.div>

              {/* 2. Bottom Row */}
              <div className="flex gap-3 w-full">
                {/* Description Blob/Input */}
                <motion.div
                  className={`flex-1 p-2.5 rounded-full ${darkMode ? uiColors.blue.dark : uiColors.blue.light} transition-colors`}
                  whileHover={{ scale: 1.03 }}
                >
                  <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="say something about your seed..."
                    className={`w-full bg-transparent border-none focus:ring-0 text-sm p-0 outline-none ${darkMode ? uiColors.text.dark : uiColors.text.light} ${darkMode ? uiColors.placeholder.dark : uiColors.placeholder.light}`}
                  />
                </motion.div>

                {/* Tag Blob/Input */}
                <motion.div
                  className={`flex-1 p-2.5 rounded-full ${darkMode ? uiColors.green.dark : uiColors.green.light} transition-colors`}
                  whileHover={{ scale: 1.03 }}
                >
                  <input id="tag" type="text" value={tag} onChange={(e) => setTag(e.target.value)} maxLength={200} placeholder="tag..."
                    className={`w-full bg-transparent border-none focus:ring-0 text-sm p-0 outline-none ${darkMode ? uiColors.text.dark : uiColors.text.light} ${darkMode ? uiColors.placeholder.dark : uiColors.placeholder.light}`}
                  />
                </motion.div>
              </div>

              {/* 3. Plant Button Area */}
              <div className="flex justify-end pt-2">
                 <motion.button
                    type="submit"
                    className={`py-1.5 px-5 rounded-full text-sm font-medium lowercase ${darkMode ? uiColors.yellow.dark : uiColors.yellow.light} ${darkMode ? 'text-yellow-100' : 'text-yellow-900'} transition-colors`}
                    whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.95 }}
                 >
                   plant
                 </motion.button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}