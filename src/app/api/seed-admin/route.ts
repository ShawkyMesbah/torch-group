// WARNING: Do not use this endpoint in production. Remove or disable after initial setup.
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SEED_SECRET = process.env.SEED_ADMIN_SECRET;
const ENABLE_SEED_ADMIN = process.env.ENABLE_SEED_ADMIN === "true";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!ENABLE_SEED_ADMIN) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (!SEED_SECRET) {
    console.error("SEED_ADMIN_SECRET is not set in environment variables.");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token !== SEED_SECRET) {
    console.warn("Unauthorized seed-admin attempt.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = "admin@torchgroup.co";
  const password = "$2b$10$aNpfKIAokXAnlpnRper77ev7MUsy0CI09XTuLtDL6ggrqeXLgivMu"; // 'admin123'
  const name = "Admin";
  const role = "ADMIN";

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password, role, name },
      create: { email, password, name, role },
    });
    console.info("Seeded admin user:", email);
    // Remove password from response
    const { password: _, ...userSafe } = user;
    return NextResponse.json({ success: true, user: userSafe });
  } catch (e) {
    console.error("Seed admin error:", (e as any).message);
    return NextResponse.json({ error: (e as any).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}