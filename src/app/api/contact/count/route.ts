import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAuthorization } from "@/lib/authorization";

export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is authorized (minimum STAFF role)
    try {
      await checkAuthorization(session, "STAFF");
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Count total contact messages
    const totalMessages = await prisma.contactMessage.count();
    
    // Count unread messages
    const unreadMessages = await prisma.contactMessage.count({
      where: {
        isRead: false
      }
    });
    
    // Count new messages in the last 30 days for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newMessages = await prisma.contactMessage.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Calculate growth percentage
    const growth = totalMessages > 0 ? Math.round((newMessages / totalMessages) * 100) : 0;
    
    return NextResponse.json({
      total: totalMessages,
      unread: unreadMessages,
      new: newMessages,
      growth
    });
  } catch (error) {
    console.error("Error fetching contact message count:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact message count" },
      { status: 500 }
    );
  }
} 