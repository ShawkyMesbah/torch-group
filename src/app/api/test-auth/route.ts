import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    authConfigured: true,
    message: "NextAuth is configured. To fully test authentication, we need to setup the database connection.",
    timestamp: new Date().toISOString(),
  });
} 