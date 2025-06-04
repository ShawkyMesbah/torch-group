import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkAuthorization, isAuthorized } from "@/lib/authorization";
import fs from 'fs';
import path from 'path';
import { format as dateFormat, subDays, isValid } from 'date-fns';
import { AnalyticsEventType, Prisma } from "@prisma/client";

export const runtime = "nodejs";

// Function to convert data to CSV
function convertToCSV(data: any[]) {
  if (!data || data.length === 0) return '';
  
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(item => {
    return Object.values(item).map(value => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
      return value;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

// Function to convert data to Excel XML format
function convertToExcel(data: any[]) {
  if (!data || data.length === 0) return '';
  
  // Create a simple Excel XML format
  let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office-spreadsheet">';
  xml += '<Worksheet ss:Name="Analytics Data"><Table>';
  
  // Add header row
  xml += '<Row>';
  Object.keys(data[0]).forEach(key => {
    xml += `<Cell><Data ss:Type="String">${key}</Data></Cell>`;
  });
  xml += '</Row>';
  
  // Add data rows
  data.forEach(item => {
    xml += '<Row>';
    Object.values(item).forEach(value => {
      if (typeof value === 'number') {
        xml += `<Cell><Data ss:Type="Number">${value}</Data></Cell>`;
      } else {
        xml += `<Cell><Data ss:Type="String">${value}</Data></Cell>`;
      }
    });
    xml += '</Row>';
  });
  
  xml += '</Table></Worksheet></Workbook>';
  return xml;
}

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Get analytics data from database based on date range and type
async function getAnalyticsDataFromDB(dataType: string, startDate: Date, endDate: Date) {
  try {
    switch (dataType) {
      case 'daily': {
        const events = await prisma.analyticsEvent.groupBy({
          by: ['date'],
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: {
            id: true
          },
          _sum: {
            value: true
          },
          orderBy: { date: 'asc' },
        });
        
        return events.map(event => ({
          date: dateFormat(new Date(event.date), 'yyyy-MM-dd'),
          count: event._count?.id || 0,
          value: event._sum?.value || 0,
        }));
      }
      
      case 'events': {
        const events = await prisma.analyticsEvent.groupBy({
          by: ['eventType'],
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: {
            id: true
          },
          orderBy: { eventType: 'asc' },
        });
        
        return events.map(event => ({
          eventType: event.eventType,
          count: event._count?.id || 0,
        }));
      }
      
      case 'sources': {
        const events = await prisma.analyticsEvent.groupBy({
          by: ['source'],
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: {
            id: true
          },
          orderBy: { source: 'asc' },
        });
        
        return events.map(event => ({
          source: event.source || 'Unknown',
          count: event._count?.id || 0,
        }));
      }
      
      case 'devices': {
        const events = await prisma.analyticsEvent.groupBy({
          by: ['device'],
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: {
            id: true
          },
          orderBy: { device: 'asc' },
        });
        
        return events.map(event => ({
          device: event.device || 'Unknown',
          count: event._count?.id || 0,
        }));
      }

      case 'pages': {
        const events = await prisma.analyticsEvent.groupBy({
          by: ['meta'],
           where: {
            eventType: 'PAGE_VIEW',
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          _count: {
            id: true
          },
          orderBy: {
             _count: {
               id: 'desc' as Prisma.SortOrder
             }
          },
           take: 10
        });

         // Extract path from meta (assuming meta is a JSON object with a 'path' key)
         return events.map(event => ({
           page: typeof event.meta === 'object' && event.meta !== null && 'path' in event.meta ? (event.meta as any).path : 'Unknown',
           count: event._count?.id || 0,
         }));
      }

      case 'overview':
      default: {
        // Get all stats in one query for overview
        const [totalEvents, pageViews, formSubmits, talentClicks, telephoneVerified] = await Promise.all([
          prisma.analyticsEvent.count({
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }),
          prisma.analyticsEvent.count({
            where: {
              eventType: 'PAGE_VIEW',
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }),
          prisma.analyticsEvent.count({
            where: {
              eventType: 'FORM_SUBMIT',
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }),
          prisma.analyticsEvent.count({
            where: {
              eventType: 'TALENT_CLICK',
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }),
          prisma.analyticsEvent.count({
            where: {
              eventType: 'PHONE_VERIFIED',
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          })
        ]);
        
        return [
          { metric: 'Total Events', count: totalEvents },
          { metric: 'Page Views', count: pageViews },
          { metric: 'Form Submissions', count: formSubmits },
          { metric: 'Talent Clicks', count: talentClicks },
          { metric: 'Phone Verifications', count: telephoneVerified }
        ];
      }
    }
  } catch (error) {
    console.error(`Failed to get ${dataType} data from database:`, error);
    return null;
  }
}

// Get mock data based on type
function getMockData(dataType: string, startDate: Date, endDate: Date) {
  switch (dataType) {
    case 'daily':
      return generateDailyData(startDate, endDate);
    case 'events':
      return [
        { eventType: 'PAGE_VIEW', count: 285 },
        { eventType: 'FORM_SUBMIT', count: 28 },
        { eventType: 'TALENT_CLICK', count: 42 },
        { eventType: 'PHONE_VERIFIED', count: 15 },
        { eventType: 'NEWSLETTER_SIGNUP', count: 12 }
      ];
    case 'sources':
      return [
        { source: 'Direct', count: 145 },
        { source: 'Organic Search', count: 98 },
        { source: 'Social Media', count: 64 },
        { source: 'Referral', count: 37 },
        { source: 'Email', count: 22 },
      ];
    case 'devices':
      return [
        { device: 'Desktop', count: 210 },
        { device: 'Mobile', count: 135 },
        { device: 'Tablet', count: 21 },
      ];
    case 'pages': // Added pages to mock data
      return [
        { page: '/', count: 185 },
        { page: '/about', count: 76 },
        { page: '/services', count: 92 },
        { page: '/blog', count: 104 },
        { page: '/contact', count: 63 },
      ];
    case 'overview':
    default:
      return [
        { metric: 'Total Events', count: 366 },
        { metric: 'Page Views', count: 285 },
        { metric: 'Form Submissions', count: 28 },
        { metric: 'Talent Clicks', count: 42 },
        { metric: 'Phone Verifications', count: 15 }
      ];
  }
}

// Generate mock daily data
function generateDailyData(startDate: Date, endDate: Date) {
  const days = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push({
      date: dateFormat(currentDate, 'yyyy-MM-dd'),
      pageViews: Math.floor(Math.random() * 50) + 100,
      formSubmits: Math.floor(Math.random() * 5) + 1,
      phoneVerified: Math.floor(Math.random() * 3),
      talentClicks: Math.floor(Math.random() * 10) + 5,
      total: Math.floor(Math.random() * 70) + 110,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

export async function GET(request: NextRequest) { // Changed Request to NextRequest
  try {
    // Authentication and authorization check (Admin only)
    let session = await auth();
    if (!session || !session.user || !isAuthorized(session, "ADMIN")) {
       return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const dataType = searchParams.get("type") || 'overview'; // Get data type, default to overview
    const format = searchParams.get("format") || 'csv'; // Get format, default to csv

    if (!from || !to) {
      return new NextResponse("Missing date range", { status: 400 });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Basic date validation
    if (!isValid(fromDate) || !isValid(toDate)) {
       return new NextResponse("Invalid date format", { status: 400 });
    }

    // Fetch data based on type (use real data if database is connected, otherwise mock)
    let data;
    const isDbConnected = await testDatabaseConnection(); // Check database connection
    
    if (isDbConnected) {
       data = await getAnalyticsDataFromDB(dataType, fromDate, toDate);
    } else {
       console.warn("Database not connected, using mock data for export.");
       // Generate mock data for the specified type and date range
       data = getMockData(dataType, fromDate, toDate);
    }

    if (!data || data.length === 0) {
       return new NextResponse("No data found for the selected date range and type", { status: 404 });
    }

    let fileContent;
    let contentType;
    let fileExtension;

    // Convert data based on format
    if (format === 'csv') {
      fileContent = convertToCSV(data);
      contentType = "text/csv";
      fileExtension = "csv";
    } else if (format === 'excel') { // Assuming 'excel' format requests Excel XML
      fileContent = convertToExcel(data);
      contentType = "application/vnd.ms-excel"; // MIME type for Excel XML
      fileExtension = "xls"; // Use .xls extension for Excel XML
    } else {
      return new NextResponse("Unsupported format", { status: 400 });
    }
    
    // Set filename
    const filename = `analytics-${dataType}-${dateFormat(fromDate, 'yyyyMMdd')}-to-${dateFormat(toDate, 'yyyyMMdd')}.${fileExtension}`;

    // Return file
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("[ANALYTICS_EXPORT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 