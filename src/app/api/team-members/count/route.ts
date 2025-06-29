import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, published] = await Promise.all([
      prisma.teamMember.count(),
      prisma.teamMember.count({ where: { isPublished: true } })
    ]);

    return NextResponse.json({ total, published });
  } catch (error) {
    console.error('Error fetching team member count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member count' },
      { status: 500 }
    );
  }
} 