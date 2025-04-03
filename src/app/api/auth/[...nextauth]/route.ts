/// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth"
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

// FIX: Removed 'export' keyword here. authOptions is used locally but not exported.
const authOptions: AuthOptions = {
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
    async session({ session, token }) { // Correct signature without user
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
}; // Ensure this closing brace for authOptions is present

// Initialize the NextAuth handler using the local authOptions
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests, which is correct
export { handler as GET, handler as POST };
