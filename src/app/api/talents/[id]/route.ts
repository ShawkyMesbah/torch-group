import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// GET /api/talents/[id] - Fetch a specific talent
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    // Check if user has at least STAFF role
    if (!isAuthorized(session, "STAFF")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Insufficient permissions" }), {
        status: 403,
      });
    }
    
    const talent = await prisma.talent.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!talent) {
      return new NextResponse(JSON.stringify({ message: "Talent not found" }), {
        status: 404,
      });
    }
    
    return NextResponse.json(talent);
  } catch (error) {
    console.error("Failed to fetch talent:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/talents/[id] - Update a talent
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    // Check if user has at least STAFF role
    if (!isAuthorized(session, "STAFF")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Insufficient permissions" }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    
    // Ensure talent exists
    const existingTalent = await prisma.talent.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingTalent) {
      return new NextResponse(JSON.stringify({ message: "Talent not found" }), {
        status: 404,
      });
    }
    
    const updatedTalent = await prisma.talent.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        role: body.role !== undefined ? body.role : undefined,
        category: body.category !== undefined ? body.category : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
        status: body.status !== undefined ? body.status : undefined,
      },
    });
    
    return NextResponse.json(updatedTalent);
  } catch (error) {
    console.error("Failed to update talent:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/talents/[id] - Delete a talent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    // For deletion, we require ADMIN role for extra security
    if (!isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Admin access required" }), {
        status: 403,
      });
    }
    
    // Ensure talent exists
    const existingTalent = await prisma.talent.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingTalent) {
      return new NextResponse(JSON.stringify({ message: "Talent not found" }), {
        status: 404,
      });
    }
    
    await prisma.talent.delete({
      where: {
        id: params.id,
      },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete talent:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 