import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Define about content type
interface AboutContent {
  title: string;
  content: string;
}

// Validation schema for about content updates
const AboutContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

// Get the path to the settings file
const getSettingsFilePath = () => {
  return path.join(process.cwd(), 'public', 'settings', 'torch-about.json');
};

// Get current settings
const getSettings = (): AboutContent => {
  try {
    // Make sure the directory exists
    const dir = path.join(process.cwd(), 'public', 'settings');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = getSettingsFilePath();
    
    // Return default settings if file doesn't exist
    if (!fs.existsSync(filePath)) {
      const defaultContent: AboutContent = {
        title: "About Torch",
        content: "Torch Group is a collective of specialized service divisions designed to deliver excellence across multiple disciplines. Our integrated approach brings together experts in digital transformation, legal services, creative design, and business strategy to provide comprehensive solutions for modern businesses. We believe in the power of specialized expertise working in harmony to elevate your brand and drive sustainable growth."
      };
      
      fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
      return defaultContent;
    }
    
    // Read and parse the settings file
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings file:', error);
    
    // Return fallback default settings in case of error
    return {
      title: "About Torch",
      content: "Torch Group is a collective of specialized service divisions designed to deliver excellence across multiple disciplines."
    };
  }
};

// Save settings
const saveSettings = (content: AboutContent) => {
  try {
    const filePath = getSettingsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings file:', error);
    return false;
  }
};

// GET /api/settings/about-torch - Fetch about content
export async function GET(request: NextRequest) {
  try {
    const content = getSettings();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// PUT /api/settings/about-torch - Update about content
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    // Validate that user is authenticated
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    
    // Check if user is an ADMIN
    if (!isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Forbidden: Admin permission required" }), {
        status: 403,
      });
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = AboutContentSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const content = validationResult.data;
    
    // Save the updated content
    const success = saveSettings(content);
    if (!success) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to save settings" }),
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Settings updated successfully", content });
  } catch (error) {
    console.error("Failed to update about content:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
} 