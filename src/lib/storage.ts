import { getSession } from 'next-auth/react';
import { getSupabaseClient, STORAGE_BUCKET } from './supabase';

export type ImageType = 'banner' | 'profile-pic';

function sanitizeEmail(email: string): string {
  return email.replace('@', '_').replace(/\./g, '_');
}

export async function uploadImage(file: File, userId: string, type: ImageType) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      throw new Error('You must be logged in to upload images');
    }

    if (!session.user.supabaseToken) {
      throw new Error('No Supabase token found in session');
    }

    const sanitizedId = sanitizeEmail(session.user.email);
    const filePath = `${type}s/${sanitizedId}/${file.name}`;
    console.log('Starting upload to:', filePath, 'Content-Type:', file.type);

    // Get authenticated client
    const supabase = await getSupabaseClient();

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error.message);
      if (error.message.includes('Permission denied')) {
        throw new Error('Permission denied. Please check your authentication status.');
      }
      throw error;
    }

    if (!data?.path) {
      throw new Error('Upload successful but no path returned');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function getImageUrl(userId: string, type: ImageType) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      throw new Error('You must be logged in to view images');
    }

    if (!session.user.supabaseToken) {
      throw new Error('No Supabase token found in session');
    }

    const sanitizedId = sanitizeEmail(session.user.email);
    console.log('Fetching images for:', sanitizedId, 'type:', type);

    // Get authenticated client
    const supabase = await getSupabaseClient();

    // List files in the directory
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(`${type}s/${sanitizedId}`);

    if (error) {
      console.error('Error listing files:', error.message);
      if (error.message.includes('Permission denied')) {
        throw new Error('Permission denied. Please check your authentication status.');
      }
      throw error;
    }

    if (!files || files.length === 0) {
      console.log('No images found for user');
      return null;
    }

    // Get the most recent file
    const latestFile = files[files.length - 1];
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`${type}s/${sanitizedId}/${latestFile.name}`);

    console.log('Found image URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error in getImageUrl:', error);
    throw error;
  }
} 