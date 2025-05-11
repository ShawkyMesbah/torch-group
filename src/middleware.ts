import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const isPublicRoute = [
    "/",
    "/login",
    "/about",
    "/services",
    "/projects",
    "/team",
    "/blog",
    "/contact",
  ].includes(nextUrl.pathname);

  // API routes for public access
  const isPublicApiRoute = nextUrl.pathname.startsWith("/api/public");

  // Auth routes that nextauth manages
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // If the user is not logged in and tries to access a protected route
  if (!isLoggedIn && !isPublicRoute && !isPublicApiRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // If the user is logged in and tries to access login page
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

// Export middleware config
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.jpg$|.*\\.png$).*)",
  ],
}; 