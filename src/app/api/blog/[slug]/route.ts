import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";
import { z } from "zod";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Validation schema for blog post updates
const BlogPostUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").optional(),
  content: z.string().min(50, "Content must be at least 50 characters").optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/blog/[slug] - Fetch a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
      });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/blog/[slug] - Update a blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
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
    
    const { slug } = params;
    const body = await request.json();
    
    // Find the post first
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    
    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
      });
    }
    
    // Check if the user is the author or an admin
    if (post.authorId !== session.user.id && !isAuthorized(session, "ADMIN")) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden: You can only edit your own posts" }),
        { status: 403 }
      );
    }
    
    // Validate request body
    const validationResult = BlogPostUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    // Check if publishing status changed
    const publishingStatusChanged = 
      post.isPublished !== body.isPublished && body.isPublished !== undefined;
    
    // Update the post
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.content && { content: body.content }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        // Update publishedAt if the post is being published for the first time
        ...(publishingStatusChanged && body.isPublished && { publishedAt: new Date() }),
      },
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/blog/[slug] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    const { slug } = params;
    
    // Find the post first
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    
    if (!post) {
      return new NextResponse(JSON.stringify({ message: "Blog post not found" }), {
        status: 404,
      });
    }
    
    // Check if the user is the author or an admin
    if (post.authorId !== session.user.id && !isAuthorized(session, "ADMIN")) {
      return new NextResponse(
        JSON.stringify({ message: "Forbidden: You can only delete your own posts" }),
        { status: 403 }
      );
    }
    
    // Delete the post
    await prisma.blogPost.delete({
      where: { slug },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 