import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Define section type
interface HomepageSection {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
}

// Validation schema for section updates
const SectionOrderSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    order: z.number(),
    enabled: z.boolean(),
  })
);

// Get the path to the settings file
const getSettingsFilePath = () => {
  return path.join(process.cwd(), 'public', 'settings', 'homepage-sections.json');
};

// Get current settings
const getSettings = (): HomepageSection[] => {
  try {
    // Make sure the directory exists
    const dir = path.join(process.cwd(), 'public', 'settings');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = getSettingsFilePath();
    
    // Return default settings if file doesn't exist
    if (!fs.existsSync(filePath)) {
      const defaultSections: HomepageSection[] = [
        { id: 'hero', title: 'Hero', order: 0, enabled: true },
        { id: 'torch-group', title: 'Torch Group', order: 1, enabled: true },
        { id: 'services', title: 'Services', order: 2, enabled: true },
        { id: 'blog', title: 'Blog', order: 3, enabled: true },
        { id: 'torch-talents', title: 'Torch Talents', order: 4, enabled: true },
        { id: 'contact', title: 'Contact', order: 5, enabled: true },
      ];
      
      fs.writeFileSync(filePath, JSON.stringify(defaultSections, null, 2));
      return defaultSections;
    }
    
    // Read and parse the settings file
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings file:', error);
    
    // Return fallback default settings in case of error
    return [
      { id: 'hero', title: 'Hero', order: 0, enabled: true },
      { id: 'torch-group', title: 'Torch Group', order: 1, enabled: true },
      { id: 'services', title: 'Services', order: 2, enabled: true },
      { id: 'blog', title: 'Blog', order: 3, enabled: true },
      { id: 'torch-talents', title: 'Torch Talents', order: 4, enabled: true },
      { id: 'contact', title: 'Contact', order: 5, enabled: true },
    ];
  }
};

// Save settings
const saveSettings = (sections: HomepageSection[]) => {
  try {
    const filePath = getSettingsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(sections, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings file:', error);
    return false;
  }
};

// GET /api/settings/homepage-sections - Fetch section order
export async function GET(request: NextRequest) {
  try {
    const sections = getSettings();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// PUT /api/settings/homepage-sections - Update section order
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
    const validationResult = SectionOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const sections = validationResult.data;
    
    // Save the updated sections
    const success = saveSettings(sections);
    if (!success) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to save settings" }),
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Settings updated successfully", sections });
  } catch (error) {
    console.error("Failed to update homepage sections:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
} 