import { supabase, STORAGE_BUCKET } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export type ImageType = 'banner' | 'profile-pic';

function sanitizeEmail(email: string): string {
  return email.replace('@', '_').replace(/\./g, '_');
}

export async function uploadImage(
  supabaseClient: SupabaseClient,
  file: File,
  userId: string,
  type: ImageType
): Promise<string> {
  try {
    const sanitizedId = sanitizeEmail(userId);
    const filePath = `${type}s/${sanitizedId}/${file.name}`;

    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error.message);
      throw error;
    }

    if (!data?.path) {
      throw new Error('Upload successful but no path returned');
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);
    if (!publicUrlData.publicUrl) {
      throw new Error('No public url returned');
    }
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function getImageUrl(
  supabaseClient: SupabaseClient,
  userId: string,
  type: ImageType
): Promise<string | null> {
  try {
    const sanitizedId = sanitizeEmail(userId);
    const { data: files, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .list(`${type}s/${sanitizedId}`);

    if (error) {
      console.error('Error listing files:', error.message);
      throw error;
    }

    if (!files || files.length === 0) {
      console.log('No images found for user');
      return null;
    }

    const latestFile = files[files.length - 1];
    const { data: publicUrlData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`${type}s/${sanitizedId}/${latestFile.name}`);
      if (!publicUrlData.publicUrl) {
        throw new Error('No public url returned');
      }
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in getImageUrl:', error);
    throw error;
  }
}

export async function updateUserProfile(
  supabaseClient: SupabaseClient,
  userId: string,
  profilePicUrl: string
): Promise<void> {
  try {
    const { error } = await supabaseClient
      .from('users')
      .update({ pfp: profilePicUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}