// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// Import the options from your new lib file
import { authOptions } from "@/lib/authOptions"; // Adjust path if necessary ('@/' assumes path alias is set up)

// NO duplicate environment variable checks needed here
// NO duplicate definition of authOptions needed here

// Initialize the NextAuth handler using the IMPORTED options
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };