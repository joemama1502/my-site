""// src/app/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import CardGrid from '@/components/CardGrid';
import { SeedCardData } from '@/components/SeedCard';

const mockPosts: SeedCardData[] = [
  { id: 1, type: 'square', seed: '123', imageUrl: '/images/example1.jpg', hits: 409, branches: 12 },
  { id: 2, type: 'square', seed: '456', imageUrl: '/images/example2.jpg', hits: 206, branches: 9 },
  { id: 3, type: 'square', seed: '789', imageUrl: '/images/example3.jpg', hits: 123, branches: 5 },
  { id: 4, type: 'phone', seed: '999', imageUrl: '/images/example4.jpg', hits: 312, branches: 20 },
];

const sanitizeEmail = (email?: string) =>
  email?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';

const ProfilePage = () => {
  const { data: session } = useSession();
  const userId = sanitizeEmail(session?.user?.email);

  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    async function loadBanner() {
      if (!userId) return;
      setIsLoadingBanner(true);
      try {
        const res = await fetch(`/api/banner?user=${userId}`);
        const json = await res.json();
        if (json?.url) {
          setBannerUrl(json.url);
          console.log('📸 Loaded banner URL:', json.url);
        } else {
          throw new Error('No banner found');
        }
      } catch (err) {
        setBannerUrl('/images/default-banner.jpg');
        console.warn('❗ Using fallback banner');
      }
      setIsLoadingBanner(false);
    }

    loadBanner();
  }, [userId]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', userId);

    try {
      const res = await fetch('/api/upload-banner', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json?.url) {
        setBannerUrl(`${json.url}?t=${Date.now()}`);
        console.log('✅ Banner updated:', json.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      {/* Banner */}
      <div
        className="w-full h-80 relative flex items-center justify-center"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {isLoadingBanner ? (
          <div className="w-full h-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        ) : (
          <img
            src={bannerUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn('❗ Failed to load banner. Using fallback.');
              e.currentTarget.src = '/images/default-banner.jpg';
            }}
          />
        )}

        {hovering && (
          <label className="absolute bottom-4 bg-white text-black px-3 py-1 rounded cursor-pointer shadow text-sm z-10">
            Upload Banner
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </label>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center px-6 py-6 space-x-6">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-neutral-200">
          <img
            src={session?.user?.image || '/images/default-pfp.jpg'}
            alt="Profile"
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
