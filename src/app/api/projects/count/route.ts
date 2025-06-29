import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, published] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isPublished: true } })
    ]);

    return NextResponse.json({ total, published });
  } catch (error) {
    console.error('Error fetching project count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project count' },
      { status: 500 }
    );
  }
} 