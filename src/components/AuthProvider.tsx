// src/components/AuthProvider.tsx
"use client"; // This component needs to be a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react"; // Import React

// Define props type including children
type Props = {
  children?: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}