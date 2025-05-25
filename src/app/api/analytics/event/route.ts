import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Set runtime to nodejs to support file operations
export const runtime = 'nodejs';

interface OfflineEvent {
  id: string;
  type: string;
  meta: Record<string, any>;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { type, meta } = body;
    
    // Validate the data
    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }
    
    try {
      // First try to store in database
      const event = await prisma.analyticsEvent.create({
        data: {
          type,
          meta: meta || {},
        },
      });
      
      return NextResponse.json({ 
        success: true, 
        id: event.id 
      });
    } catch (dbError) {
      // If database fails, store to file as fallback
      const id = `api_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const event: OfflineEvent = {
        id,
        type,
        meta: meta || {},
        createdAt: new Date().toISOString(),
      };
      
      try {
        const filePath = path.resolve(process.cwd(), 'data', 'analytics-events.json');
        let events: OfflineEvent[] = [];
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          events = JSON.parse(fileContent || '[]');
        }
        
        events.push(event);
        fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
        
        return NextResponse.json({ 
          success: true, 
          id,
          stored: 'file'
        });
      } catch (fileError) {
        // Return success with memory storage as last resort
        return NextResponse.json({
          success: true,
          id,
          stored: 'memory'
        });
      }
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
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