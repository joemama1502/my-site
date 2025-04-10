'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import CardGrid from '@/components/CardGrid';
import { uploadImage, getImageUrl, ImageType } from '@/lib/storage';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const { data: session, status } = useSession();
  const [bannerUrl, setBannerUrl] = useState<string>('/images/default-banner.jpg');
  const [profilePicUrl, setProfilePicUrl] = useState<string>(session?.user?.image || '/images/default-pfp.jpg');
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [isLoadingProfilePic, setIsLoadingProfilePic] = useState(true);
  const [hoveringBanner, setHoveringBanner] = useState(false);
  const [hoveringProfilePic, setHoveringProfilePic] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check if the current user is the profile owner
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && userId) {
      const currentUserEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
      setIsOwner(currentUserEmail === userId);
    }
  }, [status, session, userId]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Load user assets
  useEffect(() => {
    async function loadUserAssets() {
      if (status !== 'authenticated' || !userId) return;

      setIsLoadingBanner(true);
      setIsLoadingProfilePic(true);

      try {
        // Load banner
        const bannerUrl = await getImageUrl(userId, 'banner');
        if (bannerUrl) {
          setBannerUrl(bannerUrl);
        }

        // Load profile picture from Supabase if exists, otherwise use Google profile pic
        const profilePicUrl = await getImageUrl(userId, 'profile-pic');
        if (profilePicUrl) {
          setProfilePicUrl(profilePicUrl);
        } else if (session?.user?.image) {
          setProfilePicUrl(session.user.image);
        }
      } catch (error) {
        console.error('Error loading user assets:', error);
      } finally {
        setIsLoadingBanner(false);
        setIsLoadingProfilePic(false);
      }
    }

    loadUserAssets();
  }, [status, userId, session?.user?.image]);

  const handleImageUpload = async (file: File, type: ImageType) => {
    if (!file || !userId) return;

    try {
      console.log(`Starting ${type} upload for user ${userId}`);
      const url = await uploadImage(file, userId, type);
      
      if (url) {
        console.log(`Successfully uploaded ${type}, new URL:`, url);
        if (type === 'banner') {
          setBannerUrl(`${url}?t=${Date.now()}`);
        } else {
          setProfilePicUrl(`${url}?t=${Date.now()}`);
        }
      } else {
        console.error(`Failed to upload ${type}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
    </div>;
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      {/* Banner */}
      <div
        className="w-full h-80 relative flex items-center justify-center"
        onMouseEnter={() => setHoveringBanner(true)}
        onMouseLeave={() => setHoveringBanner(false)}
      >
        {isLoadingBanner ? (
          <div className="w-full h-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        ) : (
          <img
            src={bannerUrl}
            onError={() => setBannerUrl('/images/default-banner.jpg')}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        )}

        {isOwner && hoveringBanner && (
          <label className="absolute bottom-4 bg-white text-black px-3 py-1 rounded cursor-pointer shadow text-sm transition-all hover:shadow-lg">
            Change Banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'banner');
              }}
            />
          </label>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center px-6 py-6 space-x-6">
        <div 
          className="relative"
          onMouseEnter={() => setHoveringProfilePic(true)}
          onMouseLeave={() => setHoveringProfilePic(false)}
        >
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-neutral-200">
            {isLoadingProfilePic ? (
              <div className="w-full h-full animate-pulse bg-neutral-300" />
            ) : (
              <Image
                src={profilePicUrl}
                alt="Profile"
                width={144}
                height={144}
                className="object-cover w-full h-full"
                unoptimized
              />
            )}
          </div>
          {isOwner && hoveringProfilePic && (
            <label className="absolute bottom-0 right-0 bg-white text-black px-3 py-1 rounded cursor-pointer shadow text-sm transition-all hover:shadow-lg">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'profile-pic');
                }}
              />
            </label>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white">
            {session?.user?.name || 'Guest'}
          </h2>
          <div className="text-sm mt-1 flex gap-2 text-black dark:text-white">
            <span>🌱 0 hits</span>
            <span>🌿 0</span>
            <span>🌳 0</span>
          </div>
          <button className="mt-2 px-4 py-1 text-sm bg-white text-pink-600 rounded-full shadow hover:shadow-lg transition-all">
            🌸 Pick (0)
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-8">
        <CardGrid
          cards={[]}
          onImageClick={() => {}}
        />
      </div>
    </div>
  );
} 