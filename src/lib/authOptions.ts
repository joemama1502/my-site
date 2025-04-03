// src/lib/authOptions.ts
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// These environment variables are needed HERE now
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

// Check for variables HERE
if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  console.error("Missing environment variables in authOptions:", {
    googleClientId: !!googleClientId,
    googleClientSecret: !!googleClientSecret,
    nextAuthSecret: !!nextAuthSecret,
  });
  throw new Error("Missing Google OAuth or NEXTAUTH_SECRET environment variables");
}

// Define AND EXPORT the options object HERE
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth Callback: signIn]', { user, account, profile });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth Callback: redirect]', { url, baseUrl });
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      console.log('[NextAuth Callback: jwt]', { token, user, account });
      if (account && profile) {
        token.id = profile.sub;
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[NextAuth Callback: session]', { session, token });
      if (token?.id) {
        if (!session.user) {
          session.user = {};
        }
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};