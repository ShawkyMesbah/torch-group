import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { AnalyticsEventType } from '@prisma/client';

// Set runtime to nodejs to support file operations
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Read analytics data from local storage
    const analyticsDir = path.join(process.cwd(), 'data', 'analytics');
    const files = await fs.readdir(analyticsDir);
    const analyticsFiles = files.filter((file) => file.endsWith('.json'));

    let totalSynced = 0;

    for (const file of analyticsFiles) {
      const filePath = path.join(analyticsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const events = JSON.parse(fileContent);

      // Insert events into database
      for (const event of events) {
        await prisma.analyticsEvent.create({
          data: {
            type: event.type as AnalyticsEventType,
            meta: event.meta || {},
            createdAt: new Date(event.timestamp),
          },
        });
        totalSynced++;
      }

      // Delete the file after successful sync
      await fs.unlink(filePath);
    }

    return NextResponse.json({
      message: `Successfully synced ${totalSynced} events`,
      totalSynced,
    });
  } catch (error) {
    console.error('[ANALYTICS_SYNC]', error);
    return new NextResponse('Internal error', { status: 500 });
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