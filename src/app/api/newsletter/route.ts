import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";
import { sendNewsletterConfirmation, sendNewsletterSubscriptionNotification } from "@/lib/email";

const prisma = new PrismaClient();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Newsletter Subscription Schema
const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
});

// Subscriber type
interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = NewsletterSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const { email, name } = validationResult.data;
    
    // Check if email is already subscribed
    // For this MVP version, we'll store subscribers in a JSON file
    // In a production system, this would be in the database with a proper table
    
    // Get the subscribers file path
    const fs = require('fs');
    const path = require('path');
    const subscribersPath = path.join(process.cwd(), 'public', 'data', 'newsletter-subscribers.json');
    
    // Ensure directory exists
    const dir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Read existing subscribers or create empty array
    let subscribers: Subscriber[] = [];
    if (fs.existsSync(subscribersPath)) {
      const data = fs.readFileSync(subscribersPath, 'utf8');
      subscribers = JSON.parse(data);
    }
    
    // Check if already subscribed
    const isSubscribed = subscribers.some((subscriber: Subscriber) => subscriber.email === email);
    if (isSubscribed) {
      return new NextResponse(
        JSON.stringify({ message: "Email already subscribed" }),
        { status: 409 }
      );
    }
    
    // Add new subscriber
    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email,
      name: name || '',
      subscribedAt: new Date().toISOString(),
    };
    
    subscribers.push(newSubscriber);
    
    // Write updated subscribers
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    // Send email notifications
    try {
      // Only attempt to send emails if RESEND_API_KEY is available
      // This prevents build failures if the key is not set
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'placeholder_key_for_build_only') {
        // Send confirmation to the subscriber
        await sendNewsletterConfirmation({ email, name });
        
        // Send notification to admin
        await sendNewsletterSubscriptionNotification({ email, name });
      } else {
        console.log("Skipping email sending: RESEND_API_KEY not configured or using placeholder");
      }
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error("Error sending newsletter email notifications:", emailError);
    }
    
    return new NextResponse(
      JSON.stringify({
        message: "Successfully subscribed to newsletter",
        subscriber: {
          email,
          name: name || '',
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/newsletter/subscribers - Get all subscribers (admin only)
// This would require proper authentication in production
export async function GET(request: NextRequest) {
  try {
    // Check if this is an authenticated admin request
    // For MVP, just returning a 501 Not Implemented
    return new NextResponse(
      JSON.stringify({ message: "This endpoint is not yet implemented" }),
      { status: 501 }
    );
    
    // In production implementation:
    // 1. Verify admin authentication
    // 2. Read subscribers file or database table
    // 3. Return subscriber list with pagination
  } catch (error) {
    console.error("Failed to fetch newsletter subscribers:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 