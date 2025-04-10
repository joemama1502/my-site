import { createClient } from '@supabase/supabase-js';
import { getSession } from 'next-auth/react';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create the base Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const STORAGE_BUCKET = 'profile-assets';

// Get an authenticated Supabase client
export async function getSupabaseClient() {
  const session = await getSession();
  
  // If no session or no Supabase token, return the anonymous client
  if (!session?.user?.supabaseToken) {
    console.log('No session or Supabase token found, using anonymous client');
    return supabase;
  }

  try {
    // Create a new client with the JWT token
    const authenticatedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${session.user.supabaseToken}`,
          },
        },
      }
    );

    return authenticatedClient;
  } catch (error) {
    console.error('Error creating authenticated client:', error);
    return supabase;
  }
} 