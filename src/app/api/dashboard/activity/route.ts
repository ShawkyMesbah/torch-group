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
    
    // Fetch recent activities from multiple sources
    const [recentTalents, recentPosts, recentMessages] = await Promise.all([
      // Get recent talents
      prisma.talent.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }),
      
      // Get recent blog posts
      prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          publishedAt: true,
        },
        where: {
          isPublished: true
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: 1
      }),
      
      // Get recent messages
      prisma.contactMessage.findMany({
        select: {
          id: true,
          name: true,
          subject: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      })
    ]);
    
    // Transform data into activity format
    const activities = [
      ...recentTalents.map(talent => ({
        id: talent.id,
        action: "New talent added",
        timestamp: talent.createdAt,
        description: `${talent.name} was added to the talents database`,
        type: "talent"
      })),
      ...recentPosts.map(post => ({
        id: post.id,
        action: "Blog post published",
        timestamp: post.publishedAt || new Date(),
        description: `${post.title} was published`,
        type: "blog"
      })),
      ...recentMessages.map(message => ({
        id: message.id,
        action: "New message received",
        timestamp: message.createdAt,
        description: `Contact form message: ${message.subject}`,
        type: "message"
      }))
    ];
    
    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Take the 3 most recent activities
    const recentActivities = activities.slice(0, 3).map(activity => {
      // Calculate relative time
      const now = new Date();
      const activityTime = new Date(activity.timestamp);
      const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
      
      let relativeTime;
      if (diffInHours < 1) {
        relativeTime = "Just now";
      } else if (diffInHours < 24) {
        relativeTime = `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffInHours < 48) {
        relativeTime = "Yesterday";
      } else {
        relativeTime = `${Math.floor(diffInHours / 24)} days ago`;
      }
      
      return {
        ...activity,
        relativeTime
      };
    });
    
    return NextResponse.json(recentActivities);
  } catch (error) {
    console.error("[DASHBOARD_ACTIVITY_API]", error);
    
    // In case of error, return empty array
    return NextResponse.json([], { status: 500 });
  }
} 