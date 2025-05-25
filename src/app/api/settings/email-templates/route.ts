import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Template types
type TemplateType = 
  | "contact_notification" 
  | "contact_confirmation" 
  | "newsletter_confirmation" 
  | "newsletter_notification";

// Template interface
interface Template {
  id: TemplateType;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
  description: string;
  lastUpdated?: string;
}

// Validation schema for templates
const TemplateSchema = z.object({
  id: z.enum([
    "contact_notification", 
    "contact_confirmation", 
    "newsletter_confirmation", 
    "newsletter_notification"
  ]),
  name: z.string().min(1),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().min(1),
  variables: z.array(z.string()),
  description: z.string(),
  lastUpdated: z.string().optional()
});

// File path for templates storage
const templatesPath = path.join(process.cwd(), 'public', 'settings', 'email-templates.json');

// Ensure the directory exists
function ensureDirectoryExists() {
  const dir = path.dirname(templatesPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Default templates
const defaultTemplates: Template[] = [
  {
    id: "contact_notification",
    name: "Contact Form Notification",
    subject: "New Contact Form: ${subject}",
    html: `
      <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #dc2626;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> \${name}</p>
        <p><strong>Email:</strong> \${email}</p>
        <p><strong>Phone:</strong> \${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> \${subject}</p>
        <p style="margin-top: 16px;"><strong>Message:</strong></p>
        <div style="background: #232326; color: #fff; padding: 16px; border-radius: 6px;">\${message.replace(/\\n/g, '<br>')}</div>
        \${attachment ? \`
        <p style="margin-top: 16px;"><strong>Attachment:</strong></p>
        <p><a href="\${attachment}" target="_blank" style="color: #dc2626; text-decoration: underline;">View attached file</a></p>
        \` : ''}
      </div>
    `,
    text: `
      New contact form submission:
      Name: \${name}
      Email: \${email}
      Phone: \${phone || 'Not provided'}
      Subject: \${subject}
      Message:
      \${message}
      \${attachment ? \`Attachment: \${attachment}\` : ''}
    `,
    variables: ["name", "email", "phone", "subject", "message", "attachment"],
    description: "Email sent to admin when a user submits a contact form",
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: "contact_confirmation",
    name: "Contact Form Confirmation",
    subject: "We've received your message: ${subject}",
    html: `
      <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #dc2626;">Thank you for contacting Torch Group</h2>
        <p>Hello <strong>\${name}</strong>,</p>
        <p>We've received your message regarding <strong>"\${subject}"</strong>.</p>
        <p>Our team will review your inquiry and get back to you as soon as possible.</p>
        <p style="margin-top: 24px;">Best regards,<br><strong>The Torch Group Team</strong></p>
      </div>
    `,
    text: `
      Hello \${name},
      Thank you for contacting Torch Group. We've received your message regarding "\${subject}".
      Our team will review your inquiry and get back to you as soon as possible.
      Best regards,
      The Torch Group Team
    `,
    variables: ["name", "subject"],
    description: "Email sent to user when they submit a contact form",
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: "newsletter_confirmation",
    name: "Newsletter Subscription",
    subject: "Welcome to Torch Group Newsletter",
    html: `
      <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #dc2626;">Welcome to Torch Group Newsletter</h2>
        <p>Hello <strong>\${name ? name : 'there'}</strong>,</p>
        <p>Thank you for subscribing to the Torch Group newsletter.</p>
        <p>You'll now receive our latest updates, insights, and announcements directly to your inbox.</p>
        <p style="margin-top: 24px;">Best regards,<br><strong>The Torch Group Team</strong></p>
      </div>
    `,
    text: `
      Hello \${name ? name : 'there'},
      Thank you for subscribing to the Torch Group newsletter.
      You'll now receive our latest updates, insights, and announcements directly to your inbox.
      Best regards,
      The Torch Group Team
    `,
    variables: ["name", "email"],
    description: "Email sent to user when they subscribe to the newsletter",
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    id: "newsletter_notification",
    name: "Newsletter Admin Notification",
    subject: "New Newsletter Subscription",
    html: `
      <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #dc2626;">New Newsletter Subscription</h2>
        <p><strong>Email:</strong> \${email}</p>
        <p><strong>Name:</strong> \${name || 'Not provided'}</p>
      </div>
    `,
    text: `
      New newsletter subscription:
      Email: \${email}
      Name: \${name || 'Not provided'}
    `,
    variables: ["name", "email"],
    description: "Email sent to admin when a user subscribes to the newsletter",
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

// Initialize template file if it doesn't exist
function initializeTemplatesFile() {
  ensureDirectoryExists();
  
  if (!fs.existsSync(templatesPath)) {
    fs.writeFileSync(templatesPath, JSON.stringify(defaultTemplates, null, 2));
  }
}

// Get all templates
function getTemplates(): Template[] {
  try {
    initializeTemplatesFile();
    const data = fs.readFileSync(templatesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading templates file:', error);
    return defaultTemplates;
  }
}

// Save templates
function saveTemplates(templates: Template[]) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing templates file:', error);
    return false;
  }
}

export async function GET() {
  try {
    const templates = getTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error in GET method:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = TemplateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const template = result.data;
    
    // Set or update the last updated date
    template.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Get all templates
    const templates = getTemplates();
    
    // Find and replace the template with matching ID
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index !== -1) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    
    // Save updated templates
    const saved = saveTemplates(templates);
    
    if (saved) {
      return NextResponse.json(template);
    } else {
      return NextResponse.json(
        { error: 'Failed to save template' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST method:', error);
    return NextResponse.json(
      { error: 'Failed to save email template' },
      { status: 500 }
    );
  }
}

// Configure this route to run in the Node.js runtime
export const runtime = 'nodejs'; 