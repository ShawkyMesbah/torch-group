// src/auth.ts
// This file defines the core NextAuth configuration for the App Router.

// @ts-nocheck
import NextAuth, { NextAuthConfig, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Import prisma directly
import { PrismaAdapter } from "@auth/prisma-adapter"; // Import adapter directly

export const dynamic = "force-dynamic";

// Development mode flag
const isDevMode = process.env.NODE_ENV === 'development';

// Define authentication options
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Development mode authentication
          if (isDevMode && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost'))) {
            console.log('Using development mode authentication');
            // Allow admin@torchgroup.co/admin login in development mode
            if (credentials.email === 'admin@torchgroup.co' && credentials.password === 'admin') {
              return {
                id: '1',
                name: 'Admin User',
                email: 'admin@torchgroup.co',
                role: 'ADMIN',
              };
            }
            return null;
          }

          // Production mode - use database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) return null;

          const isValid = await compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token when signing in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === "development",
  // Add adapter if not in development mode and DATABASE_URL is set
  ...(isDevMode && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost'))
    ? {} // No adapter in dev mode without proper DB
    : { adapter: PrismaAdapter(prisma) } // Use adapter in production or dev with DB
  ),
};

// Create handler and export
export const { handlers, signIn, signOut } = NextAuth(authOptions);

// Explicit auth function for server components
export async function auth() {
  return getServerSession(authOptions);
} 