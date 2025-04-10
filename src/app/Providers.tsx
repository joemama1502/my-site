// src/app/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
