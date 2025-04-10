import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
} 