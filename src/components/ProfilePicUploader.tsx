'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage, getImageUrl, updateUserProfile } from '../lib/storage';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function ProfilePicUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserProfilePic = async () => {
      const user = await supabase.auth.getUser();
      if (user.data && user.data.user) {
        const { data, error } = await supabase
          .from('users')
          .select('pfp')
          .eq('id', user.data.user.id);
        if (error) {
          setError(error.message);
        }
        if (data && data[0].pfp) {
          const url = await getImageUrl(supabase, data[0].pfp);
          setCurrentImageUrl(url);
        }
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
      const path = await uploadImage(supabase, file, 'profilepic');
      const user = await supabase.auth.getUser();
      if (!user.data || !user.data.user) {
        throw new Error('Not authenticated');
      }
      await updateUserProfile(supabase, user.data.user.id, path);
      const newUrl = await getImageUrl(supabase, path);
      setCurrentImageUrl(newUrl);
      setPreviewUrl(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
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