import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get all cookie names - don't expose values
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map((cookie: { name: string }) => cookie.name);
    
    // Check for specific cookies
    const hasSessionCookie = cookieStore.has("next-auth.session-token");
    const hasSecureSessionCookie = cookieStore.has("__Secure-next-auth.session-token");
    const hasCsrfCookie = cookieStore.has("next-auth.csrf-token");
    const hasCallbackCookie = cookieStore.has("next-auth.callback-url");
    
    // Check environment variables (do not expose actual values)
    const envChecks = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    };
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      cookies: {
        count: cookieNames.length,
        names: cookieNames,
        auth: {
          hasSessionCookie,
          hasSecureSessionCookie,
          hasCsrfCookie,
          hasCallbackCookie
        }
      },
      envChecks
    });
  } catch (error: any) {
    console.error("Auth config check error:", error);
    return NextResponse.json({ 
      error: "Error checking authentication configuration",
      message: error.message
    }, { status: 500 });
  }
} 