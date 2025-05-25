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
    
    // Count total users
    const totalUsers = await prisma.user.count();
    
    // Count new users in the last 30 days for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Calculate rough growth percentage
    const growth = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;
    
    return NextResponse.json({
      total: totalUsers,
      newUsers,
      growth
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json(
      { error: "Failed to fetch user count" },
      { status: 500 }
    );
  }
} 