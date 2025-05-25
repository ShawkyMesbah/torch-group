import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import authOptions from "@/lib/auth";
import authConfig from "@/config/auth";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export const runtime = "nodejs";

/**
 * API endpoint to check if a user is authenticated
 * This is useful for debugging authentication issues
 */
export async function GET() {
  let dbStatus = "not tested";
  let dbError: string | null = null;
  
  try {
    // Test database connection
    await prisma.$connect();
    try {
      await prisma.$queryRaw`SELECT 1 as connected`;
      dbStatus = "connected";
    } catch (dbQueryError: unknown) {
      dbStatus = "connection failed - query error";
      dbError = dbQueryError instanceof Error 
        ? dbQueryError.message 
        : String(dbQueryError);
    }
  } catch (dbConnectError: unknown) {
    dbStatus = "connection failed";
    dbError = dbConnectError instanceof Error 
      ? dbConnectError.message 
      : String(dbConnectError);
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      // Ignore disconnect errors
    }
  }

  try {
    // Check for cookies in all possible formats
    const cookieStore = await cookies();
    const sessionToken = 
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ 
        authenticated: false,
        message: "No session token found",
        cookies: {
          count: cookieStore.getAll().length,
          names: cookieStore.getAll().map((c: { name: string }) => c.name)
        }
      });
    }
    
    // Try to decode the JWT token
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) {
        return NextResponse.json({ 
          authenticated: false,
          message: "NEXTAUTH_SECRET not set",
          hasToken: true
        });
      }
      
      const decoded = jwt.verify(sessionToken, secret) as jwt.JwtPayload;
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        },
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
      });
    } catch (tokenError: any) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Invalid token",
        error: tokenError.message
      });
    }
  } catch (error: any) {
    console.error("Auth check error:", error);
    return NextResponse.json({ 
      authenticated: false,
      message: "Error checking authentication",
      error: error.message
    }, { status: 500 });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Auth API is working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    database: {
      status: dbStatus,
      error: dbError,
      url: process.env.DATABASE_URL?.replace(/:.+@/, ':****@') // Hide password
    },
    authOptions: {
      pages: authOptions.pages
    },
    authConfig: {
      pages: authConfig.pages
    }
  });
} 