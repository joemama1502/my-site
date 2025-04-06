import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionSourceMaps: false, // ← disables sourcemap generation in prod
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
    ],
  },
};

export default nextConfig;
