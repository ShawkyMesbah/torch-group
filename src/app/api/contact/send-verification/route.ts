import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import twilio from "twilio";

// Set runtime environment to Node.js
export const runtime = 'nodejs';

// In-memory verification code store with TTL
interface VerificationEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Rate limiting by IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Use global to persist across hot reloads in development
declare global {
  var __verificationCodes: Map<string, VerificationEntry> | undefined;
  var __rateLimits: Map<string, RateLimitEntry> | undefined;
}

const verificationCodes = globalThis.__verificationCodes ?? new Map<string, VerificationEntry>();
const rateLimits = globalThis.__rateLimits ?? new Map<string, RateLimitEntry>();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__verificationCodes = verificationCodes;
  globalThis.__rateLimits = rateLimits;
}

// Configuration
const VERIFICATION_TTL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3; // 3 requests per window
const CODE_LENGTH = 6;

// Twilio client initialization
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Phone number validation schema
const phoneSchema = z.object({
  phone: z.string().min(5, "Valid phone number required").max(20),
});

// Clean up expired verification codes
function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [phone, entry] of verificationCodes.entries()) {
    if (now > entry.expiresAt) {
      verificationCodes.delete(phone);
    }
  }
  
  // Clean up expired rate limits
  for (const [ip, limit] of rateLimits.entries()) {
    if (now > limit.resetAt) {
      rateLimits.delete(ip);
    }
  }
}

// Generate a random verification code
function generateVerificationCode(length: number): string {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * 10).toString()
  ).join("");
}

// Check if under rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  // No previous entries
  if (!limit) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  // Rate limit window expired, reset counter
  if (now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  // Within window, check count
  if (limit.count < RATE_LIMIT_MAX) {
    rateLimits.set(ip, { count: limit.count + 1, resetAt: limit.resetAt });
    return true;
  }

  // Rate limit exceeded
  return false;
}

// Send verification code via Twilio
async function sendTwilioSMS(phone: string, code: string): Promise<boolean> {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: `Your Torch Group verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error("Twilio SMS error:", error);
    return false;
  }
}

// POST /api/contact/send-verification - Send verification code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate phone number
    const validationResult = phoneSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        }),
        { status: 400 }
      );
    }
    
    const { phone } = validationResult.data;
    
    // Clean up expired codes first
    cleanupExpiredCodes();
    
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ message: "Rate limit exceeded. Try again later." }),
        { status: 429 }
      );
    }
    
    // Generate verification code
    const code = generateVerificationCode(CODE_LENGTH);
    
    // Store code with TTL
    verificationCodes.set(phone, {
      code,
      expiresAt: Date.now() + VERIFICATION_TTL,
      attempts: 0,
    });
    
    // Try to send via Twilio
    const sentViaTwilio = await sendTwilioSMS(phone, code);
    
    // If Twilio fails or is not configured, use mock delay
    if (!sentViaTwilio) {
      // Simulate delay for mock mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development/testing, return the code in the response
      if (process.env.NODE_ENV !== "production") {
        console.log(`[MOCK SMS] To ${phone}: Your verification code is ${code}`);
        console.log(`[DEBUG] Stored verification codes count: ${verificationCodes.size}`);
        return new NextResponse(
          JSON.stringify({ 
            message: "Verification code sent (mock mode)", 
            mockCode: code,
            debug: {
              phone,
              codeStored: verificationCodes.has(phone),
              expiresAt: new Date(Date.now() + VERIFICATION_TTL).toISOString()
            }
          }),
          { status: 200 }
        );
      }
    }
    
    return new NextResponse(
      JSON.stringify({ message: "Verification code sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send verification code:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// Export verification code store for verification endpoint
export { verificationCodes }; 