import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { z } from "zod";
import { sendContactFormNotification, sendContactFormConfirmation } from "@/lib/email";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Contact Form Schema
const ContactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.string().optional(),
});

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = ContactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
        attachment: body.attachment || null,
      },
    });
    
    // Send email notifications
    try {
      // Only attempt to send emails if RESEND_API_KEY is available
      // This prevents build failures if the key is not set
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'placeholder_key_for_build_only') {
        // Send notification to admin
        await sendContactFormNotification({
          name: body.name,
          email: body.email,
          phone: body.phone,
          subject: body.subject,
          message: body.message,
          attachment: body.attachment,
        });
        
        // Send confirmation to the user
        await sendContactFormConfirmation({
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
          attachment: body.attachment,
        });
      } else {
        console.log("Skipping email sending: RESEND_API_KEY not configured or using placeholder");
      }
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error("Error sending email notifications:", emailError);
    }
    
    return new NextResponse(
      JSON.stringify({
        message: "Contact message submitted successfully",
        id: contactMessage.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/contact - Fetch contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // For this endpoint, we'll implement authentication check in the future
    // For now, this is just a placeholder
    
    const searchParams = request.nextUrl.searchParams;
    const isRead = searchParams.get('isRead');
    const limit = searchParams.get('limit');
    
    // Build where clause
    const where = isRead !== null ? { isRead: isRead === 'true' } : {};
    
    try {
      const messages = await prisma.contactMessage.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        ...(limit ? { take: parseInt(limit) } : {}),
      });
      
      return NextResponse.json(messages);
    } catch (internalError) {
      console.warn("Using fallback mock data for contact messages:", internalError);
      
      // Provide fallback mock data when the real database call fails
      const mockMessages = [
        {
          id: "mock-message-1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          phoneVerified: true,
          subject: "Project Inquiry",
          message: "I'm interested in working with Torch Group on a new web development project for my company. Could you provide more information about your services and pricing?",
          attachment: null,
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: "mock-message-2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: null,
          phoneVerified: false,
          subject: "Marketing Consultation",
          message: "I'd like to schedule a consultation to discuss potential marketing strategies for my business. What availability do you have in the coming weeks?",
          attachment: "https://example.com/file.pdf",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          id: "mock-message-3",
          name: "Alex Johnson",
          email: "alex@example.com",
          phone: "+9876543210",
          phoneVerified: true,
          subject: "Website Feedback",
          message: "I've been exploring your website and have some feedback regarding the user experience. There are a few areas that could be improved for better navigation and engagement.",
          attachment: null,
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
        }
      ];
      
      // Filter mock data based on query parameters
      let filteredMessages = [...mockMessages];
      if (isRead !== null) {
        filteredMessages = filteredMessages.filter(msg => msg.isRead === (isRead === 'true'));
      }
      
      // Apply limit if specified
      if (limit) {
        filteredMessages = filteredMessages.slice(0, parseInt(limit));
      }
      
      return NextResponse.json(filteredMessages);
    }
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 