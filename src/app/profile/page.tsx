'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import CardGrid from '@/components/CardGrid';
import { SeedCardData } from '@/components/SeedCard';

const mockPosts: SeedCardData[] = [
  {
    id: 1,
    type: 'square',
    seed: '123',
    imageUrl: '/images/example1.jpg',
    hits: 409,
    branches: 12,
  },
  {
    id: 2,
    type: 'square',
    seed: '456',
    imageUrl: '/images/example2.jpg',
    hits: 206,
    branches: 9,
  },
  {
    id: 3,
    type: 'square',
    seed: '789',
    imageUrl: '/images/example3.jpg',
    hits: 123,
    branches: 5,
  },
  {
    id: 4,
    type: 'phone',
    seed: '999',
    imageUrl: '/images/example4.jpg',
    hits: 312,
    branches: 20,
  },
];

const ProfilePage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.email || 'guest';
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    async function loadBanner() {
      setIsLoadingBanner(true);

      // Use the URL you provided directly
      const bannerURL = `https://ilupxplqymcsncxirwiz.supabase.co/storage/v1/object/public/profile-assets/Fernandez_Tony_06.jpeg`;

      // If there was an issue loading banner, fall back to the default
      setBannerUrl(bannerURL);

      setIsLoadingBanner(false);
    }

    loadBanner();
  }, [userId]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `banners/${userId}.jpg`;
    console.log('Uploading to:', filePath, file);

    const { error } = await supabase.storage
      .from('profile-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('❌ Banner upload error:', error.message);
    } else {
      console.log('✅ Upload success!');
      const { data } = await supabase.storage
        .from('profile-assets')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        console.log('📸 New banner URL:', data.publicUrl);
        setBannerUrl(`${data.publicUrl}?t=${Date.now()}`);
      }
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
            onError={(e) => {
              console.warn('❗ Banner image failed to load, using fallback.');
              e.currentTarget.src = '/images/default-banner.jpg';
            }}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}

        {hovering && (
          <label className="absolute bottom-4 bg-white text-black px-3 py-1 rounded cursor-pointer shadow text-sm transition-all">
            Change Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </label>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center px-6 py-6 space-x-6">
        <div className="relative">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-neutral-200">
            <Image
              src={session?.user?.image || '/images/default-pfp.jpg'}
              alt="Profile"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>
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
          <button className="mt-2 px-4 py-1 text-sm bg-white text-pink-600 rounded-full shadow hover:shadow-lg transition-all">
            🌸 Pick (14)
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="px-4 md:px-8 mt-12">
        <CardGrid cards={[...mockPosts, ...mockPosts]} darkMode={false} onImageClick={() => {}} />
      </div>
    </div>
  );
};

export default ProfilePage;

