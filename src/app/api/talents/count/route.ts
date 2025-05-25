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
    
    // Count total talents
    const totalTalents = await prisma.talent.count();
    
    // Count active talents
    const activeTalents = await prisma.talent.count({
      where: {
        status: "ACTIVE"
      }
    });
    
    // Count pending talents
    const pendingTalents = await prisma.talent.count({
      where: {
        status: "PENDING"
      }
    });
    
    // Count new talents in the last 30 days for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newTalents = await prisma.talent.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Calculate growth percentage
    const growth = totalTalents > 0 ? Math.round((newTalents / totalTalents) * 100) : 0;
    
    return NextResponse.json({
      total: totalTalents,
      active: activeTalents,
      pending: pendingTalents,
      new: newTalents,
      growth
    });
  } catch (error) {
    console.error("Error fetching talent count:", error);
    return NextResponse.json(
      { error: "Failed to fetch talent count" },
      { status: 500 }
    );
  }
} 