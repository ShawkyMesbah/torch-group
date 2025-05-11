import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Define our own type for user with role
type UserWithRole = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
};

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user with type cast to avoid TS errors
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as UserWithRole;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cast as UserWithRole to access role property
        const userWithRole = user as UserWithRole;
        token.role = userWithRole.role;
        token.id = userWithRole.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Add custom properties to session
        session.user.role = token.role as "ADMIN" | "STAFF";
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig); 