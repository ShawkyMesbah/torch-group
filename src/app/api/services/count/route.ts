import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, published] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { isPublished: true } })
    ]);

    return NextResponse.json({ total, published });
  } catch (error) {
    console.error('Error fetching service count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service count' },
      { status: 500 }
    );
  }
} 