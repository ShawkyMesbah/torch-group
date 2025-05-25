// @ts-nocheck
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Check if we're in development and should return mock data
const shouldUseMockAuth = () => {
  return (
    process.env.NODE_ENV !== "production" && 
    !process.env.NEXTAUTH_SECRET
  );
};

// Returns mock user data for development/testing
const getMockUserForDevelopment = () => {
  // Use FALLBACK_ADMIN_* environment variables if defined, otherwise use defaults
  const fallbackAdminId = process.env.FALLBACK_ADMIN_ID || 'mock-admin-id';
  const fallbackAdminEmail = process.env.FALLBACK_ADMIN_EMAIL || 'admin@example.com';
  const fallbackAdminName = process.env.FALLBACK_ADMIN_NAME || 'Development Admin';
  const fallbackAdminRole = process.env.FALLBACK_ADMIN_ROLE || 'ADMIN';

  return {
    id: fallbackAdminId,
    name: fallbackAdminName,
    email: fallbackAdminEmail,
    role: fallbackAdminRole,
  };
};

export async function GET() {
  try {
    // Check if we should use mock auth
    if (shouldUseMockAuth()) {
      console.warn("NEXTAUTH_SECRET not defined, using development mock authentication");
      const mockUser = getMockUserForDevelopment();
      return NextResponse.json({ user: mockUser }, { status: 200 });
    }

    // Get session token from cookie - await the cookies() call
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    // Verify the token using the secret
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    try {
      // Decode JWT token
      const payload = jwt.verify(sessionToken, secret);
      
      if (typeof payload === 'object' && payload !== null && 'sub' in payload) {
        // Find user by ID
        const userId = payload.sub as string;
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
        
        if (user) {
          return NextResponse.json({ user }, { status: 200 });
        }
      }
      
      return NextResponse.json({ user: null }, { status: 200 });
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 