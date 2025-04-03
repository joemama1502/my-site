// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
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