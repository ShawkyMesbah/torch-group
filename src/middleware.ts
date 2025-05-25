import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { analyticsMiddleware } from "./middleware/analytics";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Run analytics middleware first
  const analyticsResponse = await analyticsMiddleware(request);
  
  // If analytics middleware returns a specific response, return it
  if (analyticsResponse && analyticsResponse !== NextResponse.next()) {
    return analyticsResponse;
  }

  // Allow all /api/auth/* and /api/test/* routes to bypass auth
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/test')) {
    return NextResponse.next();
  }

  // Try to get token using NextAuth's method
  let token = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (error) {
    // Silent error in production
  }

  // Check for admin cookie
  const hasAdminCookie = request.cookies.has("next-auth.session-token") || 
                       request.cookies.has("__Secure-next-auth.session-token");

  // For dashboard access, allow either a valid NextAuth token or our admin cookie
  if (pathname.startsWith("/dashboard")) {
    // Allow access if either condition is true:
    // 1. Valid NextAuth token with ADMIN role
    // 2. Our custom admin cookie exists
    if ((token && token.role === "ADMIN") || hasAdminCookie) {
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // For API routes, check auth
  if (pathname.startsWith("/api/")) {
    if (!token && !hasAdminCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include the homepage and all public paths for analytics
    '/',
    '/(public)/:path*',
    // Only run auth middleware on these specific paths
    '/dashboard/:path*',
    '/api/:path*'
  ],
}; 