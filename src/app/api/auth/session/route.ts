// @ts-nocheck
import { NextResponse, NextRequest } from "next/server";

// Set runtime to Node.js to avoid Edge runtime issues
export const runtime = "nodejs";

// This handler redirects session requests to our custom basic-session endpoint
export async function GET(request: NextRequest) {
  try {
    // Fetch from basic-session
    const baseUrl = request.nextUrl.origin;
    const sessionUrl = `${baseUrl}/api/auth/basic-session`;
    
    const response = await fetch(sessionUrl, {
      headers: {
        // Forward authorization headers
        cookie: request.headers.get('cookie') || ''
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch from basic-session: ${response.status}`);
      return NextResponse.json({ user: null });
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session wrapper error:", error);
    return NextResponse.json({ user: null });
  }
} 