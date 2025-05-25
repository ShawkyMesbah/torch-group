import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";

/**
 * Admin login endpoint that bypasses NextAuth
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body received:", body ? "yes" : "no");
    
    const { email, password } = body || {};
    
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    
    // Check if we're in development mode without a database
    const isDevelopmentModeWithoutDB = process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;
    let user;
    
    if (isDevelopmentModeWithoutDB) {
      console.log("Development mode: Using mock admin user");
      
      // Only allow specific development credentials
      if (email === "admin@torchgroup.co" && password === "admin") {
        // Create a mock admin user
        user = {
          id: "dev-admin-id",
          email: "admin@torchgroup.co",
          name: "Admin User",
          role: "ADMIN",
          password: "hashed-password-not-used-in-dev-mode",
        };
        console.log("Mock admin user created for development");
      } else {
        console.log("Development login failed: Invalid credentials");
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else {
      // Production mode - find the user by email - wrapped in try/catch
      console.log(`Looking up user with email: ${email}`);
      try {
        user = await prisma.user.findUnique({
          where: { email },
        });
      } catch (dbError) {
        console.error("Database error when finding user:", dbError);
        return NextResponse.json({ 
          error: "Database error", 
          message: "Could not query the database. Please try again later." 
        }, { status: 500 });
      }
      
      if (!user) {
        console.log(`Admin login failed: User not found for email ${email}`);
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      
      // Verify the password
      console.log("Verifying password");
      const passwordValid = await compare(password, user.password);
      if (!passwordValid) {
        console.log(`Admin login failed: Invalid password for email ${email}`);
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      
      // Verify the user is an admin
      console.log(`User role: ${user.role}`);
      if (user.role !== "ADMIN") {
        console.log(`Admin login failed: User is not admin. Role: ${user.role}`);
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
    }
    
    console.log(`Admin login successful for ${email}`);
    
    // Create a JWT token
    // Use a development secret if NEXTAUTH_SECRET is not defined
    const secret = process.env.NEXTAUTH_SECRET || "dev-secret-do-not-use-in-production";
    
    // Create the token with a format compatible with NextAuth
    const tokenPayload = {
      sub: user.id,
      name: user.name || "",
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    };
    
    console.log("Creating JWT token with payload:", tokenPayload);
    
    try {
      const token = jwt.sign(tokenPayload, secret);
      console.log("JWT token created successfully");
      
      // Create a response with success message
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
      
      try {
        // Set cookies that match what NextAuth would set
        // Use both standard and secure cookie names to support different environments
        // Set the session token
        response.cookies.set({
          name: "next-auth.session-token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        // Also set the secure version for HTTPS environments
        response.cookies.set({
          name: "__Secure-next-auth.session-token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        // Set CSRF token
        response.cookies.set({
          name: "next-auth.csrf-token",
          value: `${Math.random()}|${Math.random()}`,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        // Set callback URL
        response.cookies.set({
          name: "next-auth.callback-url",
          value: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        console.log("Admin login response created successfully");
      } catch (cookieError) {
        console.error("Error setting cookies:", cookieError);
        // Still return response even if cookie setting failed
      }
      
      return response;
    } catch (jwtError: unknown) {
      const error = jwtError instanceof Error ? jwtError : new Error(String(jwtError));
      return NextResponse.json({ 
        error: "Token creation failed", 
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ 
      error: "Internal server error", 
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    }, { status: 500 });
  }
} 