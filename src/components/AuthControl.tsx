// src/components/AuthControl.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiX, FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";

const pastelGlowColors = [
  '#F9A8D4', '#93C5FD', '#6EE7B7', '#FDBA74', '#C4B5FD'
];

interface AuthControlProps {
  buttonSize?: string;
  iconSize?: number;
}

export default function AuthControl({ buttonSize = "w-14 h-14", iconSize = 40 }: AuthControlProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    const color = pastelGlowColors[Math.floor(Math.random() * pastelGlowColors.length)];
    setHoverColor(color);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`rounded-full flex items-center justify-center ${buttonSize} bg-neutral-800 hover:bg-neutral-700 text-white font-bold`}
          title="Sign in"
          style={{
            boxShadow: hoverColor ? `0 0 10px 3px ${hoverColor}` : undefined,
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <span className="text-xl">+</span>
        </button>

        {showModal && (
          <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div
              className="bg-white/60 dark:bg-[#111]/60 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-center border border-gray-300 dark:border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
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
                  setShowModal(false);
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
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-600 transition-colors shadow-md ${buttonSize}`}
        style={{
          boxShadow: hoverColor ? `0 0 10px 3px ${hoverColor}` : undefined,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Image
          src={session.user?.image || "/icons/file.svg"}
          alt="Profile"
          width={iconSize}
          height={iconSize}
          className="rounded-full object-cover w-full h-full"
        />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white/60 dark:bg-[#111]/60 text-gray-800 dark:text-white shadow-lg rounded-lg z-50 text-sm overflow-hidden backdrop-blur-xl border border-gray-300 dark:border-gray-600">
          <div
            onClick={() => {
              router.push("/profile");
              setShowDropdown(false);
            }}
            className="px-4 py-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            Profile
          </div>
          <div
            onClick={() => {
              router.push("/settings");
              setShowDropdown(false);
            }}
            className="px-4 py-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            Settings
          </div>
          <div
            onClick={() => signOut()}
            className="px-4 py-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 border-t border-gray-300 dark:border-gray-600"
          >
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}
