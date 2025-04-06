// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import CardGrid from '@/components/CardGrid';
import { SeedCardData } from '@/components/SeedCard';
import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

const mockPosts: SeedCardData[] = [
  {
    id: 1,
    type: 'square',
    seed: '123',
    imageUrl: '/images/example1.jpg',
    hits: 409,
    branches: 12,
  },
];

const sanitizeEmail = (email?: string) =>
  email?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';

const ProfilePage = () => {
  const { data: session } = useSession();
  const userId = sanitizeEmail(session?.user?.email);
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [hovering, setHovering] = useState(false);

  // Load previously uploaded banner (if any)
  useEffect(() => {
    const stored = localStorage.getItem(`banner-${userId}`);
    if (stored) {
      setBannerUrl(stored);
    }
  }, [userId]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      {/* Banner */}
      <div
        className="w-full h-80 relative flex items-center justify-center"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <img
          src={bannerUrl || '/images/default-banner.jpg'}
          alt="Profile Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.warn('❗ Failed to load banner.');
            e.currentTarget.src = '/images/default-banner.jpg';
          }}
        />

        {hovering && (
          <div className="absolute bottom-4">
            <UploadButton<OurFileRouter>
              endpoint="bannerUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setBannerUrl(res[0].url);
                  localStorage.setItem(`banner-${userId}`, res[0].url);
                  console.log('✅ Banner updated:', res[0].url);
                }
              }}
              onUploadError={(err) => {
                console.error('❌ Upload failed:', err.message);
              }}
            />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center px-6 py-6 space-x-6">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-neutral-200">
          <Image
            src={session?.user?.image || '/images/default-pfp.jpg'}
            alt="Profile"
            width={144}
            height={144}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.warn('❗ Failed to load profile image.');
              e.currentTarget.src = '/images/default-pfp.jpg';
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">
            @{session?.user?.name || 'username'}
          </h2>
          <div className="text-sm mt-1 flex gap-2 text-black dark:text-white">
            <span>🌱 {mockPosts.length} hits</span>
            <span>🌿 12</span>
            <span>🌳 3</span>
          </div>
          <button className="mt-2 px-4 py-1 text-sm bg-white text-pink-600 rounded-full shadow">
            🌸 Pick (14)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-8 mt-12">
        <CardGrid cards={[...mockPosts]} darkMode={false} onImageClick={() => {}} />
      </div>
    </div>
  );
};

export default ProfilePage;
