import { NextRequest, NextResponse } from 'next/server';
import { codes } from '../send-code/route';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required.' }, { status: 400 });
    }
    if (codes[phone] && codes[phone] === code) {
      delete codes[phone]; // Invalidate code after use
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to verify code.' }, { status: 500 });
  }
} 