import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const errorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  context: z.record(z.any()).optional(),
});

const LOG_SECRET = process.env.LOG_SECRET;

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!LOG_SECRET || token !== LOG_SECRET) {
    if (token) {
      console.warn('Unauthorized log-error attempt with token:', token);
    }
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
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