import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

export const runtime = "nodejs";

// Schema for analytics event payload
const analyticsEventSchema = z.object({
  type: z.enum(["PAGE_VIEW", "FORM_SUBMIT", "PHONE_VERIFIED", "TALENT_CLICK"]),
  meta: z.record(z.any()).optional(),
});

// Check if we're in development mode
const isDevelopmentMode = () => {
  return process.env.NODE_ENV !== "production";
};

// Test database connection and return true if connected, false otherwise
async function testDatabaseConnection() {
  try {
    // Skip real DB check in development with no DATABASE_URL
    if (isDevelopmentMode() && !process.env.DATABASE_URL) {
      console.log("Development mode: Skipping actual database connection test");
      return false;
    }

    // Try a simple query to check if the database is available
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Create a function to store events to a local file when DB is unavailable
async function storeEventLocally(event: { type: string; meta?: any }) {
  try {
    const localStoragePath = path.join(process.cwd(), 'data', 'analytics-events.json');
    const dirPath = path.join(process.cwd(), 'data');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Read existing events or create empty array
    let events = [];
    if (fs.existsSync(localStoragePath)) {
      try {
        const fileContent = fs.readFileSync(localStoragePath, 'utf-8');
        events = JSON.parse(fileContent);
      } catch (readError) {
        console.error("Error reading analytics file, creating new one:", readError);
        // If the file is corrupted, we'll create a new one
      }
    }
    
    // Add the new event with a timestamp and ID
    const newEvent = {
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: event.type,
      meta: event.meta || {},
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    
    // Write back to file with proper formatting for readability
    fs.writeFileSync(localStoragePath, JSON.stringify(events, null, 2));
    
    return { success: true, localId: newEvent.id };
  } catch (error) {
    console.error("Failed to store event locally:", error);
    return { success: false, error: String(error) };
  }
}

// POST /api/analytics - Record an analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = analyticsEventSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid event data", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { type, meta } = validation.data;
    
    // In development with no DATABASE_URL, always use local storage
    if (isDevelopmentMode() && !process.env.DATABASE_URL) {
      console.log("Development mode: Using local storage for analytics (no DATABASE_URL)");
      const localResult = await storeEventLocally({ type, meta });
      
      return NextResponse.json({
        success: true,
        environment: "development",
        locallyStored: true,
        localId: localResult.localId,
        source: 'local_file'
      }, { status: 202 });
    }
    
    // Check if database is available
    const isDatabaseConnected = await testDatabaseConnection();
    
    if (isDatabaseConnected) {
      try {
        // Try to insert using Prisma client first (safe for migrations)
        const event = await prisma.analyticsEvent.create({
          data: {
            type,
            meta: meta || {},
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          eventId: event.id,
          source: 'database' 
        }, { status: 201 });
      } catch (prismaError) {
        console.error("Prisma error recording analytics event:", prismaError);
        
        // Try raw SQL as fallback if Prisma model isn't yet migrated
        try {
          const sqlResult = await prisma.$executeRaw`
            INSERT INTO "AnalyticsEvent" ("id", "type", "meta", "createdAt")
            VALUES (gen_random_uuid(), ${type}, ${meta ? JSON.stringify(meta) : null}::jsonb, NOW())
            RETURNING "id"
          `;
          
          return NextResponse.json({ 
            success: true, 
            eventId: sqlResult,
            source: 'database_raw' 
          }, { status: 201 });
        } catch (sqlError) {
          console.error("SQL error recording analytics event:", sqlError);
          
          // Fall back to local storage
          const localResult = await storeEventLocally({ type, meta });
          
          return NextResponse.json({
            success: true,
            fallback: true,
            locallyStored: true,
            localId: localResult.localId,
            source: 'local_file'
          }, { status: 202 });
        }
      }
    } else {
      // Database disconnected, use local storage
      const localResult = await storeEventLocally({ type, meta });
      
      if (!localResult.success) {
        return NextResponse.json({
          success: false,
          error: "Failed to store event locally",
          details: localResult.error
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        fallback: true,
        locallyStored: true,
        localId: localResult.localId,
        source: 'local_file'
      }, { status: 202 });
    }
  } catch (error) {
    console.error("Error recording analytics event:", error);
    return NextResponse.json(
      { error: "Failed to record analytics event", details: String(error) },
      { status: 500 }
    );
  }
} 