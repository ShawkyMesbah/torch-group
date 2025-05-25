import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// In-memory store for demo (replace with DB or cache in production)
const codes: Record<string, string> = {};

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes[phone] = code;
    // Send SMS
    await client.messages.create({
      body: `Your Torch verification code is: ${code}`,
      from: twilioNumber,
      to: `+${phone}`.replace(/[^\d+]/g, ''),
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send code.' }, { status: 500 });
  }
}

// For demo: export codes for verification route
export { codes }; 