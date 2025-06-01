import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { AnalyticsEventType } from '@prisma/client';

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
    const body = await request.json();
    const { type, meta = {} } = body;

    if (!type || !Object.values(AnalyticsEventType).includes(type)) {
      return new NextResponse("Invalid event type", { status: 400 });
    }

    try {
      // Try to store in database first
      await prisma.analyticsEvent.create({
        data: {
          type: type as AnalyticsEventType,
          meta,
          createdAt: new Date(),
        },
      });

      return NextResponse.json({ message: "Event logged successfully" });
    } catch (dbError) {
      // If database fails, store to file as fallback
      const analyticsDir = path.join(process.cwd(), "data", "analytics");
      const timestamp = new Date().toISOString().split("T")[0];
      const filePath = path.join(analyticsDir, `events-${timestamp}.json`);

      try {
        // Create analytics directory if it doesn't exist
        await fs.mkdir(analyticsDir, { recursive: true });

        // Read existing events or initialize empty array
        let events = [];
        try {
          const fileContent = await fs.readFile(filePath, "utf-8");
          events = JSON.parse(fileContent);
        } catch (readError) {
          // File doesn't exist or is invalid, start with empty array
        }

        // Add new event
        events.push({
          type,
          meta,
          timestamp: new Date().toISOString(),
        });

        // Write back to file
        await fs.writeFile(filePath, JSON.stringify(events, null, 2));

        return NextResponse.json({
          message: "Event logged to file storage",
          fallback: true,
        });
      } catch (fileError) {
        console.error("[ANALYTICS_EVENT_FILE]", fileError);
        throw fileError;
      }
    }
  } catch (error) {
    console.error("[ANALYTICS_EVENT]", error);
    return new NextResponse("Internal error", { status: 500 });
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