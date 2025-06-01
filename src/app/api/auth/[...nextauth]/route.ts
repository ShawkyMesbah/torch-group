// src/app/api/auth/[...nextauth]/route.ts
// This file handles all NextAuth API routes using the handlers exported from src/auth.ts

// @ts-nocheck
import { handlers } from "@/auth";

export const dynamic = "force-dynamic";

export const { GET, POST } = handlers; 