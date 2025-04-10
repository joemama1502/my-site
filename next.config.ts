import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // ✅ Firebase images
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Supabase storage URLs
      },
    ],
  },
};

export default nextConfig;
