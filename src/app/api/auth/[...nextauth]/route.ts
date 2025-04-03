// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth" // Import AuthOptions type
import GoogleProvider from "next-auth/providers/google"

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  console.error("Missing environment variables:", {
      googleClientId: !!googleClientId,
      googleClientSecret: !!googleClientSecret,
      nextAuthSecret: !!nextAuthSecret
  });
  throw new Error("Missing Google OAuth or NEXTAUTH_SECRET environment variables");
}

// Explicitly type authOptions for better intellisense and safety
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
    // Assuming the 'email' and 'credentials' errors were from old code,
    // this signature ({ user, account, profile }) looks correct for GoogleProvider
    // and uses all its parameters in the console.log below.
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
    // FIX: Removed the unused 'user' parameter from the session callback signature
    async session({ session, token /* removed user */ }) {
      console.log('[NextAuth Callback: session]', { session, token });
      if (token?.id) {
          // Ensure session.user exists before assigning to it
          if (!session.user) {
            session.user = {}; // Initialize if it doesn't exist
          }
          session.user.id = token.id as string;
      }
      // Example: If you wanted to add the access token (carefully)
      // if (token?.accessToken) {
      //    session.accessToken = token.accessToken as string;
      // }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }