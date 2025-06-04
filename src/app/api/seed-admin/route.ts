import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SEED_SECRET = process.env.SEED_ADMIN_SECRET || "supersecret";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = "admin@torchgroup.co";
  const password = "$2b$10$Y4wWlMLV5rPlfLGVbi3QEOseR2zve1FWJIdnLSmbDwbBf4TuiXzE."; // 'Admin@1234'
  const name = "Admin";
  const role = "ADMIN";

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password, role, name },
      create: { email, password, name, role },
    });
    return NextResponse.json({ success: true, user });
  } catch (e) {
    return NextResponse.json({ error: (e as any).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}