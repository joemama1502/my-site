// src/components/AuthControl.tsx
"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiUser, FiPlusCircle } from "react-icons/fi";

interface AuthControlProps {
  buttonSize?: string; // e.g., 'w-10 h-10' or 'w-12 h-12'
  iconSize?: number;   // e.g., 24 or 28
}

// Set default sizes (for the smaller version in the sticky header)
const defaultButtonSize = "w-10 h-10";
const defaultIconSize = 24;
const defaultImageSize = 40; // Corresponds to w-10/h-10

export default function AuthControl({
  buttonSize = defaultButtonSize, // Use default if no prop passed
  iconSize = defaultIconSize,     // Use default if no prop passed
}: AuthControlProps) {
  const { data: session, status } = useSession();

  // Calculate image dimension based on button size class (simple example)
  // This might need refinement if you use many different size classes
  const imageDimension = buttonSize.includes('12') ? 48 : defaultImageSize;

  if (status === "loading") {
    return <div className={`${buttonSize} rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse`}></div>;
  }

  if (session) {
    // Logged In: Show PFP
    return (
      <button
        onClick={() => signOut()}
        className={`${buttonSize} rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-600 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
        title="Logout" aria-label="Logout"
      >
        {session.user?.image ? (
          <Image
             src={session.user.image}
             alt={session.user.name || "User Avatar"}
             width={imageDimension} // Use calculated size
             height={imageDimension} // Use calculated size
             className="object-cover"
             priority // Prioritize loading user image when logged in
          />
        ) : (
          <div className={`w-full h-full bg-gray-600 flex items-center justify-center text-white`}> <FiUser size={iconSize} /> </div>
        )}
      </button>
    );
  }

  // Logged Out: Show "Plus Circle" button
  return (
    <button
      onClick={() => signIn('google')}
      className={`${buttonSize} rounded-full bg-gray-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
      aria-label="Login / Sign Up"
    >
      <FiPlusCircle size={iconSize} />
    </button>
  );
}