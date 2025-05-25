import { Resend } from 'resend';

// Initialize Resend with API key, with build-time fallback
const apiKey = process.env.RESEND_API_KEY || 'placeholder_during_build';
const resend = new Resend(apiKey);

export default resend; 