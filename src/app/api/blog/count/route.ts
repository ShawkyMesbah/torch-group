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
    
    // Count total blog posts
    const totalBlogPosts = await prisma.blogPost.count();
    
    // Count published blog posts
    const publishedBlogPosts = await prisma.blogPost.count({
      where: {
        isPublished: true
      }
    });
    
    // Count new blog posts in the last 30 days for growth calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newBlogPosts = await prisma.blogPost.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Calculate growth percentage
    const growth = totalBlogPosts > 0 ? Math.round((newBlogPosts / totalBlogPosts) * 100) : 0;
    
    return NextResponse.json({
      total: totalBlogPosts,
      published: publishedBlogPosts,
      new: newBlogPosts,
      growth
    });
  } catch (error) {
    console.error("Error fetching blog post count:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post count" },
      { status: 500 }
    );
  }
} 