import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    try {
      // Fetch real data from database
      const [talentsCount, blogPostsCount, messagesCount] = await Promise.all([
        prisma.talent.count({
          where: {
            status: "ACTIVE"
          }
        }),
        prisma.blogPost.count({
          where: {
            isPublished: true
          }
        }),
        prisma.contactMessage.count({
          where: {
            isRead: false
          }
        })
      ]);
      
      const dashboardStats = {
        talents: talentsCount,
        blogPosts: blogPostsCount,
        messages: messagesCount,
      };
      
      // Return the stats
      return NextResponse.json(dashboardStats);
    } catch (dbError) {
      console.error("[DASHBOARD_STATS_API] Database error:", dbError);
      
      // Provide fallback mock data for development
      const fallbackStats = {
        talents: 8,
        blogPosts: 12,
        messages: 3,
        _fallback: true
      };
      
      return NextResponse.json(fallbackStats);
    }
  } catch (error) {
    console.error("[DASHBOARD_STATS_API]", error);
    
    // In case of error, return zeros
    return NextResponse.json({
      talents: 0,
      blogPosts: 0,
      messages: 0,
      error: "Error fetching dashboard stats",
    }, { status: 500 });
  }
} 