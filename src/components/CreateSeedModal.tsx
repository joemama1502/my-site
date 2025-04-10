// src/components/CreateSeedModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface CreateSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSeedModal({ isOpen, onClose }: CreateSeedModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1003]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${isDark ? 'bg-[#111]' : 'bg-white'} p-6 text-left align-middle shadow-xl transition-all`}>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <Image
                    src={isDark ? "/icons/seed-white.png" : "/icons/seed.png"}
                    alt="Seed icon"
                    width={24}
                    height={24}
                  />
                  Plant a New Seed
                </Dialog.Title>

                <div className="mt-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your seed a name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696e4a] bg-white dark:bg-[#222] text-black dark:text-white"
                  />
                </div>

                <div className="mt-4">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your idea..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696e4a] bg-white dark:bg-[#222] text-black dark:text-white resize-none"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#696e4a] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a4e34] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#696e4a] focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Plant Seed
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}