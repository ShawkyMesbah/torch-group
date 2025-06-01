import { NextResponse } from 'next/server';
import { z } from 'zod';

const errorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedError = errorSchema.parse(body);

    // In a real app, you would send this to your error tracking service
    // For MVP, we'll just log to console and store in a file
    console.error('Error logged:', validatedError);

    // You could also store in a database if needed
    // await prisma.errorLog.create({ data: validatedError });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
} 