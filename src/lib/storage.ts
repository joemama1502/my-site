import { v2 as cloudinary } from 'cloudinary';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getUserId = async (supabaseClient: SupabaseClient) => {
  const user = await supabaseClient.auth.getUser();
  if (!user.data || !user.data.user) {
    throw new Error('Not authenticated');
  }
  return user.data.user.id;
};

export async function uploadImage(
  supabaseClient: SupabaseClient,
  file: File,
  type: 'profilepic' | 'banner'
): Promise<string | null> {
  try {
    const userId = await getUserId(supabaseClient);
    const timestamp = Date.now();
    const folder = `profile/${userId}/${type}`;

    const uploadResult = await cloudinary.uploader.upload(
      URL.createObjectURL(file),
      {
        folder: folder,
        public_id: `${type}_${timestamp}`,
        upload_preset: 'default_preset',
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function getImageUrl(
  _supabaseClient: SupabaseClient,
  type: 'profilepic' | 'banner'
): Promise<string | null> {
  try {
    // Since the URL is directly returned from uploadImage, this function might not be needed.
    // You might directly use the URL stored in the database.
    return null;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}

export async function updateUserProfile(
  supabaseClient: SupabaseClient,
  profilePicUrl: string,
  type: 'profilepic' | 'banner'
): Promise<void> {
  try {
    const userId = await getUserId(supabaseClient);
    const { error } = await supabaseClient.from('users').upsert({
      id: userId,
      [type]: profilePicUrl,
    });

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}