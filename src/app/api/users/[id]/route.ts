import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";
import { z } from "zod";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// User Update Schema
const UserUpdateSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
  image: z.string().optional(),
});

// GET /api/users/[id] - Fetch a single user (admin only)
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
    
    // Users can view their own details, but only admins can view others
    const isSelf = session.user.id === params.id;
    if (!isSelf && !isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Insufficient permissions" }), {
        status: 403,
      });
    }
    
    const { id } = params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/users/[id] - Update a user
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
    
    // Users can update their own details, but only admins can update others
    const isSelf = session.user.id === params.id;
    if (!isSelf && !isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Insufficient permissions" }), {
        status: 403,
      });
    }
    
    // Only admins can update roles
    const body = await request.json();
    if (body.role && !isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Cannot change role" }), {
        status: 403,
      });
    }
    
    const { id } = params;
    
    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    
    // Validate request body
    const validationResult = UserUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Check if email update would create a duplicate
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      
      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ message: "User with this email already exists" }),
          { status: 409 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.role) updateData.role = validatedData.role;
    if (validatedData.image !== undefined) updateData.image = validatedData.image;
    
    // Hash password if provided
    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 10);
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/users/[id] - Delete a user (admin only)
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
    
    // Only admins can delete users
    if (!isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Admin permission required" }), {
        status: 403,
      });
    }
    
    // Prevent self-deletion
    if (session.user.id === params.id) {
      return new NextResponse(JSON.stringify({ message: "Cannot delete your own account" }), {
        status: 400,
      });
    }
    
    const { id } = params;
    
    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    
    // Delete the user
    await prisma.user.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 