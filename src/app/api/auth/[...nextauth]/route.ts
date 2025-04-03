// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Ensure your environment variables are loaded correctly
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  // Log the specific variables that are missing for clarity
  console.error("Missing environment variables:", {
      googleClientId: !!googleClientId,
      googleClientSecret: !!googleClientSecret,
      nextAuthSecret: !!nextAuthSecret
  });
  throw new Error("Missing Google OAuth or NEXTAUTH_SECRET environment variables");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: nextAuthSecret,

  // --- ADDED FOR DEBUGGING ---
  debug: process.env.NODE_ENV === 'development', // Show debug messages in terminal during development
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth Callback: signIn]', { user, account, profile });
      // Returning true allows the sign-in to proceed
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth Callback: redirect]', { url, baseUrl });
      // Default redirect behavior: Redirects to baseUrl (your homepage) after sign in
      return baseUrl;
    },
    async jwt({ token, user, account, profile }) {
      // This callback is called whenever a JWT is created or updated.
      console.log('[NextAuth Callback: jwt]', { token, user, account });
       // Add profile info or user ID to the token right after signin
       if (account && profile) {
          token.id = profile.sub; // Google ID
          token.accessToken = account.access_token; // Google Access Token
       }
       if (user) {
           token.id = user.id; // If you map to an internal user ID
       }
      return token;
    },
    async session({ session, token, user }) {
      // This callback is called whenever a session is checked.
      console.log('[NextAuth Callback: session]', { session, token });
      // Make user ID available on the session object
      if (token?.id) {
          session.user.id = token.id as string;
      }
      if (token?.accessToken) {
          // session.accessToken = token.accessToken; // Careful about exposing access tokens to client
      }
      return session; // The session object is then available via useSession() or getSession()
    }
  }
  // --- END DEBUGGING ADDITIONS ---
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }