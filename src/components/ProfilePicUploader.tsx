'use client';

import { useState, useEffect } from 'react';
import { uploadImage, getImageUrl, updateUserProfile } from '../lib/storage';
import { createClient } from '@supabase/supabase-js';

export default function ProfilePicUploader({supabase}: {supabase: ReturnType<typeof createClient>}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserProfilePic = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (!data?.user) {
        console.log("No user session found.");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('pfp')
        .eq('id', data.user.id)
        .single(); // Use single() to expect only one row
      if (profileData?.pfp) {
        setCurrentImageUrl(profileData.pfp);
      }
    };

    fetchCurrentUserProfilePic();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newUrl = await uploadImage(file, 'profilepic');
      setCurrentImageUrl(newUrl);
      setPreviewUrl(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      if (currentImageUrl) await updateUserProfile(supabase, currentImageUrl)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
      {currentImageUrl && (
        <img
          src={currentImageUrl}
          alt="Current Profile"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}