import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { AnalyticsEventType } from '@/generated/prisma';

// Set runtime to nodejs to support file operations
export const runtime = 'nodejs';

interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  meta: Record<string, any>;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { events } = body;
    
    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No events to process' 
      });
    }
    
    // Process each event
    const results = await Promise.all(
      events.map(async (event: AnalyticsEvent) => {
        try {
          // Try to store in database
          await prisma.analyticsEvent.create({
            data: {
              type: event.type,
              meta: event.meta || {},
              createdAt: new Date(event.createdAt),
            },
          });
          return true;
        } catch (dbError) {
          // If database fails, store to file as fallback
          try {
            const filePath = path.resolve(process.cwd(), 'data', 'analytics-events.json');
            let fileEvents: AnalyticsEvent[] = [];
            
            if (fs.existsSync(filePath)) {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              fileEvents = JSON.parse(fileContent || '[]');
            }
            
            fileEvents.push(event);
            fs.writeFileSync(filePath, JSON.stringify(fileEvents, null, 2));
            return true;
          } catch (fileError) {
            return false;
          }
        }
      })
    );
    
    const successCount = results.filter(Boolean).length;
    
    return NextResponse.json({
      success: true,
      total: events.length,
      processed: successCount,
      failed: events.length - successCount,
    });
  } catch (error) {
    console.error('Analytics sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync analytics events' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 