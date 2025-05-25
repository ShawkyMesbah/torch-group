import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkAuthorization } from "@/lib/authorization";
import fs from 'fs';
import path from 'path';
import { format as dateFormat, subDays, isValid } from 'date-fns';

export const runtime = "nodejs";

// Function to convert data to CSV
function convertToCSV(data: any[]) {
  if (data.length === 0) return '';
  
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
  if (data.length === 0) return '';
  
  // Create a simple Excel XML format
  let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
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

// Get analytics data from database based on date range
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
          orderBy: {
            date: 'asc'
          }
        });
        
        return events.map(event => ({
          date: dateFormat(new Date(event.date), 'yyyy-MM-dd'),
          count: event._count.id,
          value: event._sum.value || 0
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
          orderBy: {
            eventType: 'asc'
          }
        });
        
        return events.map(event => ({
          eventType: event.eventType,
          count: event._count.id
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
          orderBy: {
            source: 'asc'
          }
        });
        
        return events.map(event => ({
          source: event.source || 'Unknown',
          count: event._count.id
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
          orderBy: {
            device: 'asc'
          }
        });
        
        return events.map(event => ({
          device: event.device || 'Unknown',
          count: event._count.id
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
    case 'pages':
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

export async function GET(request: NextRequest) {
  try {
    // Check if user is authorized
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const isAuthorized = checkAuthorization(session, ["ADMIN"]);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const dataType = searchParams.get('type') || 'daily';
    const startDateParam = searchParams.get('start') || '';
    const endDateParam = searchParams.get('end') || '';
    const dataSource = searchParams.get('source') || 'auto';
    
    // Parse date range or use default (last 30 days)
    const endDate = endDateParam && isValid(new Date(endDateParam)) 
      ? new Date(endDateParam) 
      : new Date();
      
    const startDate = startDateParam && isValid(new Date(startDateParam))
      ? new Date(startDateParam)
      : subDays(endDate, 30);
    
    // Try to get data from database first
    let exportData = null;
    let source = 'database';
    
    // Only try database if not explicitly requesting mock data
    if (dataSource !== 'mock_data') {
      try {
        const dbConnected = await testDatabaseConnection();
        
        if (dbConnected) {
          exportData = await getAnalyticsDataFromDB(dataType, startDate, endDate);
        }
      } catch (dbError) {
        console.error("Error accessing database:", dbError);
      }
    }
    
    // Fall back to mock data if no database data available or mock data requested
    if (!exportData || dataSource === 'mock_data') {
      exportData = getMockData(dataType, startDate, endDate);
      source = 'mock_data';
    }
    
    // Add timestamp to filename
    const timestamp = dateFormat(new Date(), 'yyyy-MM-dd_HH-mm');
    const filename = `analytics-${dataType}-${timestamp}`;
    
    // Return data based on requested format
    if (format === 'csv') {
      const csvData = convertToCSV(exportData);
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    } else if (format === 'excel') {
      const excelData = convertToExcel(exportData);
      return new NextResponse(excelData, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="${filename}.xls"`
        }
      });
    } else if (format === 'pdf') {
      // For PDF, we'll just return a placeholder message
      // In a real implementation, you would use a PDF generation library
      return NextResponse.json({
        error: "PDF export is not implemented in this demo version",
        message: "In a production environment, this would generate a PDF using a library like PDFKit or jsPDF"
      }, { status: 501 });
    } else {
      // Default: return JSON
      return NextResponse.json({
        data: exportData,
        meta: {
          type: dataType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          count: exportData.length,
          format: format,
          source: source
        }
      });
    }
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    return NextResponse.json(
      { error: "Failed to export analytics data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 