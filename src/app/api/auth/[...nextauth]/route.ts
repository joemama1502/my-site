// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// Import the options from your new lib file
import { authOptions } from "@/lib/authOptions"; // Adjust path if necessary ('@/' assumes path alias is set up)

// Check environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  console.error("Missing environment variables in [...nextauth]/route.ts:", {
    googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
  throw new Error("Missing required environment variables");
}

// Initialize the NextAuth handler using the IMPORTED options
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };