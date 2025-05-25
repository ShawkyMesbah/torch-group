import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// GET /api/contact/[id] - Get a specific contact message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });
    
    if (!message) {
      return new NextResponse(
        JSON.stringify({ message: "Contact message not found" }),
        { status: 404 }
      );
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to fetch contact message:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/contact/[id] - Delete a contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });
    
    if (!existingMessage) {
      return new NextResponse(
        JSON.stringify({ message: "Contact message not found" }),
        { status: 404 }
      );
    }
    
    // Delete message
    await prisma.contactMessage.delete({
      where: { id },
    });
    
    return new NextResponse(
      JSON.stringify({ message: "Contact message deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 