import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkAuthorization } from "@/lib/authorization";
import fs from 'fs';
import path from 'path';
import { PrismaClient } from "@/generated/prisma";
import { Role } from "@/lib/authorization";

export const runtime = "nodejs";

// Test database connection and return true if connected, false otherwise
async function testDatabaseConnection() {
  try {
    // Try a simple query to check if the database is available
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Function to read events from the local file storage
async function getLocalEvents() {
  try {
    const localStoragePath = path.join(process.cwd(), 'data', 'analytics-events.json');
    
    if (fs.existsSync(localStoragePath)) {
      try {
        const fileContent = fs.readFileSync(localStoragePath, 'utf-8');
        return JSON.parse(fileContent);
      } catch (readError) {
        console.error("Error reading local analytics file:", readError);
        // Generate some sample data if file is corrupted
        return createSampleEvents();
      }
    }
    
    // If file doesn't exist, create sample data
    return createSampleEvents();
  } catch (error) {
    console.error("Failed to read local events:", error);
    return createSampleEvents();
  }
}

// Create sample events if file doesn't exist
function createSampleEvents() {
  const now = new Date();
  const events = [];
  
  // Create some sample page views
  for (let i = 0; i < 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    
    events.push({
      id: `sample_${i}_pv`,
      type: "PAGE_VIEW",
      meta: {
        path: ['/', '/about', '/services', '/contact'][Math.floor(Math.random() * 4)],
        referrer: '',
        userAgent: 'Sample Browser',
      },
      createdAt: date.toISOString()
    });
  }
  
  // Create some sample form submissions
  for (let i = 0; i < 8; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    
    events.push({
      id: `sample_${i}_fs`,
      type: "FORM_SUBMIT",
      meta: {
        formId: 'contact-form',
        path: '/contact',
      },
      createdAt: date.toISOString()
    });
  }
  
  // Create some sample phone verifications
  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    
    events.push({
      id: `sample_${i}_pv`,
      type: "PHONE_VERIFIED",
      meta: {
        phone: '+123***4567',
        path: '/contact',
      },
      createdAt: date.toISOString()
    });
  }
  
  // Create some sample talent clicks
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    
    events.push({
      id: `sample_${i}_tc`,
      type: "TALENT_CLICK",
      meta: {
        talentId: ['talent1', 'talent2', 'talent3'][Math.floor(Math.random() * 3)],
        talentName: ['John Doe', 'Jane Smith', 'Alex Johnson'][Math.floor(Math.random() * 3)],
        path: '/',
      },
      createdAt: date.toISOString()
    });
  }
  
  return events;
}

// Process local events to get overview stats
function processLocalEventsForOverview(events: any[], thirtyDaysAgo: Date) {
  const stats = {
    pageViews: { total: 0, recent: 0 },
    formSubmits: { total: 0, recent: 0 },
    phoneVerified: { total: 0, recent: 0 },
    talentClicks: { total: 0, recent: 0 }
  };
  
  for (const event of events) {
    const eventDate = new Date(event.createdAt);
    const isRecent = eventDate >= thirtyDaysAgo;
    
    switch (event.type) {
      case 'PAGE_VIEW':
        stats.pageViews.total++;
        if (isRecent) stats.pageViews.recent++;
        break;
      case 'FORM_SUBMIT':
        stats.formSubmits.total++;
        if (isRecent) stats.formSubmits.recent++;
        break;
      case 'PHONE_VERIFIED':
        stats.phoneVerified.total++;
        if (isRecent) stats.phoneVerified.recent++;
        break;
      case 'TALENT_CLICK':
        stats.talentClicks.total++;
        if (isRecent) stats.talentClicks.recent++;
        break;
    }
  }
  
  // Calculate growth percentages
  return {
    pageViews: {
      total: stats.pageViews.total,
      recent: stats.pageViews.recent,
      growth: calculateGrowth(stats.pageViews.total, stats.pageViews.recent)
    },
    formSubmits: {
      total: stats.formSubmits.total,
      recent: stats.formSubmits.recent,
      growth: calculateGrowth(stats.formSubmits.total, stats.formSubmits.recent)
    },
    phoneVerified: {
      total: stats.phoneVerified.total,
      recent: stats.phoneVerified.recent,
      growth: calculateGrowth(stats.phoneVerified.total, stats.phoneVerified.recent)
    },
    talentClicks: {
      total: stats.talentClicks.total,
      recent: stats.talentClicks.recent,
      growth: calculateGrowth(stats.talentClicks.total, stats.talentClicks.recent)
    }
  };
}

// Process local events to get daily stats
function processLocalEventsForDailyStats(events: any[]) {
  // Generate dates for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last7Days.push(date);
  }
  
  // Initialize daily stats with dates
  const dailyStats = last7Days.map(date => ({
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pageViews: 0,
    formSubmits: 0,
    phoneVerified: 0,
    talentClicks: 0,
    total: 0
  }));
  
  // Count events for each day
  for (const event of events) {
    const eventDate = new Date(event.createdAt);
    
    for (let i = 0; i < last7Days.length; i++) {
      const startDate = last7Days[i];
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      if (eventDate >= startDate && eventDate < endDate) {
        switch (event.type) {
          case 'PAGE_VIEW':
            dailyStats[i].pageViews++;
            break;
          case 'FORM_SUBMIT':
            dailyStats[i].formSubmits++;
            break;
          case 'PHONE_VERIFIED':
            dailyStats[i].phoneVerified++;
            break;
          case 'TALENT_CLICK':
            dailyStats[i].talentClicks++;
            break;
        }
        dailyStats[i].total++;
        break;
      }
    }
  }
  
  return dailyStats;
}

// Process local events to get talent stats
function processLocalEventsForTalentStats(events: any[]) {
  // Count talent clicks
  const talentClicksMap = new Map();
  
  for (const event of events) {
    if (event.type === 'TALENT_CLICK' && event.meta?.talentId) {
      const talentId = event.meta.talentId;
      const talentName = event.meta.talentName || 'Unknown Talent';
      
      const key = `${talentId}|${talentName}`;
      talentClicksMap.set(key, (talentClicksMap.get(key) || 0) + 1);
    }
  }
  
  // Convert to array and sort by clicks (descending)
  const talentStats = Array.from(talentClicksMap).map(([key, clicks]) => {
    const [talentId, talentName] = key.split('|');
    return { talentId, talentName, clicks };
  });
  
  return talentStats.sort((a, b) => b.clicks - a.clicks);
}

// GET /api/analytics/stats - Get analytics statistics
export async function GET() {
  try {
    // Set 30 days ago for recent stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Check if database is available
    const databaseAvailable = await testDatabaseConnection();
    
    try {
      // Check authentication
      const session = await auth();
      
      if (!session?.user) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      
      // Initialize Prisma client
      const prisma = new PrismaClient();
      
      // In development mode without a database, return mock data
      if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
        return NextResponse.json({
          talents: 8,
          projects: 5,
          blogPosts: 12,
          messages: 3,
        });
      }
      
      // Get counts with a single connection
      const [talents, projects, blogPosts, messages] = await Promise.all([
        prisma.talent.count({ where: { status: "ACTIVE" } }),
        prisma.project.count(),
        prisma.blogPost.count({ where: { publishedAt: { not: null } } }),
        prisma.contactMessage.count({ where: { readAt: null } }),
      ]);
      
      // Return the counts
      return NextResponse.json({
        talents,
        projects,
        blogPosts,
        messages,
      });
    } catch (error) {
      console.error("[ANALYTICS_STATS_API]", error);
      
      // In case of database error, return fallback data
      return NextResponse.json({
        talents: 0,
        projects: 0,
        blogPosts: 0,
        messages: 0,
        error: "Database error, showing fallback data",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[ANALYTICS_STATS_API]", error);
    
    // In case of database error, return fallback data
    return NextResponse.json({
      talents: 0,
      projects: 0,
      blogPosts: 0,
      messages: 0,
      error: "Database error, showing fallback data",
    }, { status: 500 });
  }
}

// Get stats for a specific event type from the database
async function getEventTypeStats(type: string, thirtyDaysAgo: Date) {
  // Get total count
  const totalCount = await prisma.analyticsEvent.count({
    where: {
      type,
    },
  });
  
  // Get recent count (last 30 days)
  const recentCount = await prisma.analyticsEvent.count({
    where: {
      type,
      createdAt: {
        gte: thirtyDaysAgo
      },
    },
  });
  
  // Calculate growth percentage
  const growth = calculateGrowth(totalCount, recentCount);
  
  return {
    total: totalCount,
    recent: recentCount,
    growth,
  };
}

// Get overview stats from the database
async function getOverviewStats(thirtyDaysAgo: Date) {
  const [pageViews, formSubmits, phoneVerified, talentClicks] = await Promise.all([
    getEventTypeStats("PAGE_VIEW", thirtyDaysAgo),
    getEventTypeStats("FORM_SUBMIT", thirtyDaysAgo),
    getEventTypeStats("PHONE_VERIFIED", thirtyDaysAgo),
    getEventTypeStats("TALENT_CLICK", thirtyDaysAgo),
  ]);
  
  return {
    pageViews,
    formSubmits,
    phoneVerified,
    talentClicks,
  };
}

// Get counts for event type by day for the last 7 days
async function getEventCountsByType(type: "PAGE_VIEW" | "FORM_SUBMIT" | "PHONE_VERIFIED" | "TALENT_CLICK", thirtyDaysAgo: Date) {
  // Get all events from the last 7 days
  const events = await prisma.analyticsEvent.findMany({
    where: {
      type,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    },
    select: {
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  
  return events;
}

// Get daily stats from the database
async function getDailyStats() {
  // Get all events from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Fetch events for each type  const [pageViewEvents, formSubmitEvents, phoneVerifiedEvents, talentClickEvents] = await Promise.all([    getEventCountsByType("PAGE_VIEW" as const, sevenDaysAgo),    getEventCountsByType("FORM_SUBMIT" as const, sevenDaysAgo),    getEventCountsByType("PHONE_VERIFIED" as const, sevenDaysAgo),    getEventCountsByType("TALENT_CLICK" as const, sevenDaysAgo),  ]);
  
  // Generate dates for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last7Days.push(date);
  }
  
  // Initialize daily stats with dates
  const dailyStats = last7Days.map(date => ({
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pageViews: 0,
    formSubmits: 0,
    phoneVerified: 0,
    talentClicks: 0,
    total: 0
  }));
  
  // Group events by day
  for (const event of pageViewEvents) {
    const eventDate = new Date(event.createdAt);
    for (let i = 0; i < last7Days.length; i++) {
      const startDate = last7Days[i];
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      if (eventDate >= startDate && eventDate < endDate) {
        dailyStats[i].pageViews++;
        dailyStats[i].total++;
        break;
      }
    }
  }
  
  for (const event of formSubmitEvents) {
    const eventDate = new Date(event.createdAt);
    for (let i = 0; i < last7Days.length; i++) {
      const startDate = last7Days[i];
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      if (eventDate >= startDate && eventDate < endDate) {
        dailyStats[i].formSubmits++;
        dailyStats[i].total++;
        break;
      }
    }
  }
  
  for (const event of phoneVerifiedEvents) {
    const eventDate = new Date(event.createdAt);
    for (let i = 0; i < last7Days.length; i++) {
      const startDate = last7Days[i];
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      if (eventDate >= startDate && eventDate < endDate) {
        dailyStats[i].phoneVerified++;
        dailyStats[i].total++;
        break;
      }
    }
  }
  
  for (const event of talentClickEvents) {
    const eventDate = new Date(event.createdAt);
    for (let i = 0; i < last7Days.length; i++) {
      const startDate = last7Days[i];
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      if (eventDate >= startDate && eventDate < endDate) {
        dailyStats[i].talentClicks++;
        dailyStats[i].total++;
        break;
      }
    }
  }
  
  return dailyStats;
}

// Get talent stats from the database
async function getTalentStats() {
  // Get all talent click events
  const events = await prisma.analyticsEvent.findMany({
    where: {
      type: "TALENT_CLICK"
    },
    select: {
      meta: true
    }
  });
  
  // Process talent stats from events
  const talentClicksMap = new Map();
  
  for (const event of events) {
    if (event.meta && typeof event.meta === 'object') {
      const meta = event.meta as Record<string, any>;
      if (meta.talentId) {
        const talentId = meta.talentId as string;
        const talentName = (meta.talentName as string) || 'Unknown Talent';
        
        const key = `${talentId}|${talentName}`;
        talentClicksMap.set(key, (talentClicksMap.get(key) || 0) + 1);
      }
    }
  }
  
  // Convert to array and sort by clicks (descending)
  const talentStats = Array.from(talentClicksMap).map(([key, clicks]) => {
    const [talentId, talentName] = key.split('|');
    return { talentId, talentName, clicks };
  });
  
  return talentStats.sort((a, b) => b.clicks - a.clicks);
}

function calculateGrowth(total: number, recent: number): number {
  if (total === 0) return 0;
  return Math.round((recent / total) * 100);
} 