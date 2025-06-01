import { NextResponse } from 'next/server';
import { z } from 'zod';

const metricSchema = z.object({
  name: z.string(),
  duration: z.number(),
  timestamp: z.number(),
  context: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
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