import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Middleware to track page views
 * This runs on the edge runtime and records page views
 */
export async function analyticsMiddleware(req: NextRequest) {
  const isPublicPath = req.nextUrl.pathname.startsWith('/(public)') || 
                       req.nextUrl.pathname === '/';
  
  // Skip API routes, static files, and non-public pages
  if (req.nextUrl.pathname.startsWith('/api') || 
      req.nextUrl.pathname.includes('.') || 
      !isPublicPath) {
    return NextResponse.next();
  }
  
  try {
    // Record the page view asynchronously (fire and forget)
    fetch(`${req.nextUrl.origin}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'PAGE_VIEW',
        meta: {
          path: req.nextUrl.pathname,
          referrer: req.headers.get('referer') || '',
          userAgent: req.headers.get('user-agent') || '',
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(error => {
      console.error('Error recording analytics in middleware:', error);
    });
  } catch (error) {
    console.error('Error in analytics middleware:', error);
  }
  
  // Continue with the request regardless of analytics
  return NextResponse.next();
} 