import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, active] = await Promise.all([
      prisma.brand.count(),
      prisma.brand.count({ where: { isActive: true } })
    ]);

    return NextResponse.json({ total, active });
  } catch (error) {
    console.error('Error fetching brand count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand count' },
      { status: 500 }
    );
  }
} 