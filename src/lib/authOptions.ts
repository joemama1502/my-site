// src/lib/authOptions.ts
import type { AuthOptions, DefaultSession, Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      supabaseToken?: string;
    } & DefaultSession["user"]
  }
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret || !supabaseJwtSecret) {
  console.error("Missing environment variables in authOptions:", {
    googleClientId: !!googleClientId,
    googleClientSecret: !!googleClientSecret,
    nextAuthSecret: !!nextAuthSecret,
    supabaseJwtSecret: !!supabaseJwtSecret,
  });
  throw new Error("Missing required environment variables");
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  debug: true,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }: { 
      user: any, 
      account: Account | null, 
      profile?: Profile 
    }) {
      console.log('[NextAuth Callback: signIn]', { user, account, profile });
      return true;
    },
    async jwt({ token, user, account }: { 
      token: JWT, 
      user?: any, 
      account?: Account | null
    }) {
      console.log('[NextAuth Callback: jwt]', { token, user, account });
      
      if (user) {
        // On sign in
        token.id = user.id;
        token.email = user.email;
        
        // Generate Supabase token
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
          sub: user.id,
          email: user.email,
          role: 'authenticated',
        };

        const supabaseToken = jwt.sign(
          payload,
          supabaseJwtSecret,
          { algorithm: 'HS256' }
        );

        token.supabaseToken = supabaseToken;
      }

      // Always return a new Supabase token to keep it fresh
      if (token.email && !token.supabaseToken) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
          sub: token.sub,
          email: token.email,
          role: 'authenticated',
        };

        token.supabaseToken = jwt.sign(
          payload,
          supabaseJwtSecret,
          { algorithm: 'HS256' }
        );
      }

      return token;
    },
    async session({ session, token }: { 
      session: any, 
      token: JWT 
    }) {
      console.log('[NextAuth Callback: session]', { session, token });
      if (session.user) {
        session.user.id = token.id;
        session.user.supabaseToken = token.supabaseToken;
      }
      return session;
    }
  }
};