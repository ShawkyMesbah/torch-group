import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const metricSchema = z.object({
  name: z.string(),
  duration: z.number(),
  timestamp: z.number(),
  context: z.record(z.any()).optional(),
});

const LOG_SECRET = process.env.LOG_SECRET;

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!LOG_SECRET || token !== LOG_SECRET) {
    if (token) {
      console.warn('Unauthorized log-performance attempt with token:', token);
    }
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  try {
    const body = await request.json();
    const validatedMetric = metricSchema.parse(body);

    // In a real app, you would send this to your analytics service
    // For MVP, we'll just log to console
    console.log('Performance metric logged:', validatedMetric);

    // You could also store in a database if needed
    // await prisma.performanceMetric.create({ data: validatedMetric });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Performance logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log performance metric' },
      { status: 500 }
    );
  }
} 