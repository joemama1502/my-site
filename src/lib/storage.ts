import { v2 as cloudinary } from 'cloudinary';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true, cloudinary_url: process.env.CLOUDINARY_URL });
} else {
  console.warn('CLOUDINARY_URL environment variable not set. Cloudinary functionality may be limited.');
}

export async function uploadImage(file: File, type: string) {
  const fileBuffer = await file.arrayBuffer();
  const fileString = Buffer.from(fileBuffer).toString('base64');
  const dataURI = `data:${file.type};base64,${fileString}`;
  try {
    const res = await cloudinary.uploader.upload(dataURI, { folder: `${type}s` });
    return res.public_id;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function getImageUrl(
  path: string
) {
  try {
    const url = cloudinary.url(path);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}

export async function updateUserProfile(supabase: SupabaseClient, profilePicUrl: string) {
  const user = await supabase.auth.getUser();
  if (!user.data || !user.data.user) {
    throw new Error('Not authenticated');
  }
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { error } = await supabaseAdmin.from('users').update({ pfp: profilePicUrl }).eq('id', user.data.user.id);

  if (error) {
git add .
    throw error;
  }
}