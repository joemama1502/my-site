// src/app/layout.tsx

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

// Define metadata
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
    // Apply font variables to the <html> tag
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>

      {/* It's standard to include a <head> tag, even if Next.js manages much of its content */}
      <head>
        {/* You can add meta tags, links, etc. here if needed */}
        {/* Note: Next.js often handles title, description from metadata export */}
      </head>

      {/* Apply base body styles. Ensure NO comments/whitespace exist between <html> and <body> */}
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>

    </html>
  );
}