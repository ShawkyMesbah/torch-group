import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// GET /api/talents/active - Fetch up to 3 active talents for homepage
export async function GET(request: NextRequest) {
  try {
    try {
      const activeTalents = await prisma.talent.findMany({
        where: {
          status: "ACTIVE"
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 3 // Limit to 3 talents
      });
      
      const res = NextResponse.json(activeTalents);
      res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      return res;
    } catch (internalError) {
      console.warn("Using fallback mock data for active talents:", internalError);
      
      // Provide fallback mock data when the real database call fails
      const mockTalents = [
        {
          id: "mock-talent-1",
          name: "John Smith",
          role: "Designer",
          category: "DESIGN",
          bio: "Experienced UI/UX designer with a passion for creating beautiful interfaces",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          status: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-talent-2",
          name: "Sarah Johnson",
          role: "Developer",
          category: "DEVELOPMENT",
          bio: "Full-stack developer with expertise in React and Node.js",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          status: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-talent-3",
          name: "Michael Chen",
          role: "Marketing Specialist",
          category: "MARKETING",
          bio: "Digital marketing expert with experience in SEO and content strategy",
          imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          status: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      const res = NextResponse.json(mockTalents);
      res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      return res;
    }
  } catch (error) {
    console.error("Failed to fetch active talents:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 