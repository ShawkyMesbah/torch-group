// src/app/api/auth/[...nextauth]/route.ts
// This file handles all NextAuth API routes by initializing NextAuth directly.

// @ts-nocheck
import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Import authOptions

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 