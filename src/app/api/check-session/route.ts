// @ts-nocheck
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  
  // Get the actual JWT token for debugging
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value || "no-token-found";
  
  // Directly try to decode the token with getToken 
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Return the session data for debugging
  return NextResponse.json({
    authenticated: !!session,
    session,
    user: session?.user,
    userRole: session?.user?.role,
    hasSessionToken: !!sessionToken && sessionToken !== "no-token-found",
    tokenValue: sessionToken && sessionToken !== "no-token-found" ? sessionToken.substring(0, 10) + "..." : null,
    decodedToken: token,
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? "exists (length: " + process.env.NEXTAUTH_SECRET.length + ")" : "missing",
  });
} 