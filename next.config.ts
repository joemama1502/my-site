// next.config.ts

import type { NextConfig } from 'next';

// Use TypeScript's type annotation directly
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Existing entry for Google avatars
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // --- ADD THIS NEW ENTRY for Picsum ---
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Keep any other existing configurations you might have
};

export default nextConfig;