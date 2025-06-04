import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from "@/lib/auth";
import { isAuthorized } from "@/lib/authorization";
import { z } from "zod";

// Set runtime environment to Node.js
export const runtime = 'nodejs';

const CONFIG_FILE_PATH = join(process.cwd(), 'public', 'data', 'site-config.json');
const DATA_DIR = join(process.cwd(), 'public', 'data');

// Schema for site configuration
const SiteConfigSchema = z.object({
  siteTitle: z.string().min(1, "Site title cannot be empty"),
  siteDescription: z.string().optional(),
  siteLogoUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

type SiteConfig = z.infer<typeof SiteConfigSchema>;

const defaultSiteConfig: SiteConfig = {
  siteTitle: "Torch Group",
  siteDescription: "",
  siteLogoUrl: "",
};

// Helper to read the config file
async function readConfig(): Promise<SiteConfig> {
  try {
    await access(CONFIG_FILE_PATH);
    const data = await readFile(CONFIG_FILE_PATH, 'utf8');
    return SiteConfigSchema.parse(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist or parsing fails, return default
    console.warn("Site config file not found or invalid, using default:", error);
    return defaultSiteConfig;
  }
}

// Helper to write the config file
async function writeConfig(config: SiteConfig): Promise<void> {
   try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
    throw new Error("Server error: Could not create data directory");
  }
  await writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf8');
}

// GET /api/settings/site-config - Fetch site configuration
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authorization check if config should only be fetched by authorized users
    // const session = await auth();
    // if (!session || !session.user) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    // }

    const config = await readConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// PATCH /api/settings/site-config - Update site configuration
export async function PATCH(request: NextRequest) {
  try {
    let session = await auth();
    
    // Workaround for potential type mismatch if auth() doesn't return full Session type
    if (session && session.user && !('expires' in session)) {
       session = { ...session, expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }; // Add dummy expires
    }

    // Validate that user is authenticated and is an ADMIN
    if (!session || !session.user || !isAuthorized(session, "ADMIN")) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized: Admin permission required" }), {
        status: 401,
      });
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = SiteConfigSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const updatedConfigData = validationResult.data;
    
    // Read current config to merge updates (optional, depending on desired behavior)
    // For this implementation, we'll just overwrite with the provided data
    
    await writeConfig(updatedConfigData);
    
    return NextResponse.json({ message: "Site configuration updated successfully" });
  } catch (error) {
    console.error("Failed to update site config:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
} 