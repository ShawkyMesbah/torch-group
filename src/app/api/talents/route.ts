import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// GET /api/talents - Fetch all talents
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated and has appropriate role
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    const talents = await prisma.talent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(talents);
  } catch (error) {
    console.error("Failed to fetch talents:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/talents - Create a new talent
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated and has appropriate role
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.role || !body.category || !body.bio) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }
    
    const talent = await prisma.talent.create({
      data: {
        name: body.name,
        role: body.role,
        category: body.category,
        bio: body.bio,
        imageUrl: body.imageUrl,
        status: body.status || "PENDING",
      },
    });
    
    return NextResponse.json(talent, { status: 201 });
  } catch (error) {
    console.error("Failed to create talent:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 