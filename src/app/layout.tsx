// CORRECTED src/app/layout.tsx

import type { Metadata } from "next";
// Import fonts for side effects (loads the CSS needed)
import "geist/font/sans";
import "geist/font/mono";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // Keep AuthProvider import

// REMOVED FONT FUNCTION CALLS AND className FROM HTML

export const metadata: Metadata = {
  title: "TreeHouse",
  description: "A New Home for Human Creativity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // REMOVED className PROP FROM HTML
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}