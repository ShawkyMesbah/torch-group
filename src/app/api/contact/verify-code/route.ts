import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Import verification codes from global or create new map
interface VerificationEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

declare global {
  var __verificationCodes: Map<string, VerificationEntry> | undefined;
}

const verificationCodes = globalThis.__verificationCodes ?? new Map<string, VerificationEntry>();

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// Verification code validation schema
const verificationSchema = z.object({
  phone: z.string().min(5, "Valid phone number required").max(20),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

// Configuration
const MAX_VERIFICATION_ATTEMPTS = 5;

// POST /api/contact/verify-code - Verify a code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = verificationSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const { phone, code } = validationResult.data;
    
    // Check if there's a verification entry for this phone number
    const verificationEntry = verificationCodes.get(phone);
    
    // Debug logging in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] Verifying code for phone: ${phone}`);
      console.log(`[DEBUG] Stored verification codes count: ${verificationCodes.size}`);
      console.log(`[DEBUG] Entry found: ${!!verificationEntry}`);
      if (verificationEntry) {
        console.log(`[DEBUG] Code: ${verificationEntry.code}, Expires: ${new Date(verificationEntry.expiresAt).toISOString()}`);
      }
    }
    
    if (!verificationEntry) {
      return new NextResponse(
        JSON.stringify({ 
          message: "No verification code found for this phone number. Please request a new code.", 
          verified: false,
          debug: process.env.NODE_ENV !== "production" ? {
            phone,
            totalCodes: verificationCodes.size,
            availablePhones: Array.from(verificationCodes.keys())
          } : undefined
        }),
        { status: 400 }
      );
    }
    
    // Check if code is expired
    if (Date.now() > verificationEntry.expiresAt) {
      // Clean up expired code
      verificationCodes.delete(phone);
      
      return new NextResponse(
        JSON.stringify({ 
          message: "Verification code has expired. Please request a new one.", 
          verified: false,
        }),
        { status: 400 }
      );
    }
    
    // Check if max attempts reached
    if (verificationEntry.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      // Clean up after too many attempts
      verificationCodes.delete(phone);
      
      return new NextResponse(
        JSON.stringify({ 
          message: "Too many attempts. Please request a new verification code.", 
          verified: false,
        }),
        { status: 400 }
      );
    }
    
    // Increment attempt counter
    verificationEntry.attempts += 1;
    verificationCodes.set(phone, verificationEntry);
    
    // Check if code matches
    if (verificationEntry.code !== code) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Invalid verification code. Please try again.", 
          verified: false,
          attemptsRemaining: MAX_VERIFICATION_ATTEMPTS - verificationEntry.attempts,
        }),
        { status: 400 }
      );
    }
    
    // Success - clean up after successful verification
    verificationCodes.delete(phone);
    
    return new NextResponse(
      JSON.stringify({ 
        message: "Phone number verified successfully", 
        verified: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to verify code:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", verified: false }),
      { status: 500 }
    );
  }
} 