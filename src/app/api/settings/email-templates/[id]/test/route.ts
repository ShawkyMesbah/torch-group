import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define template type
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

// File path for templates storage
const templatesPath = path.join(process.cwd(), 'public', 'settings', 'email-templates.json');

// Get templates
function getTemplates(): Template[] {
  try {
    if (fs.existsSync(templatesPath)) {
      const data = fs.readFileSync(templatesPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading templates file:', error);
    return [];
  }
}

// Get a specific template
function getTemplate(id: string): Template | null {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);
  return template || null;
}

// Process a template with test data
function processTemplate(template: Template, testData: Record<string, string>) {
  let subject = template.subject;
  let html = template.html;
  let text = template.text;
  
  // Replace variables in all template parts
  Object.entries(testData).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}(\\s\\|\\|\\s[^}]+)?\\}`, "g");
    subject = subject.replace(regex, value);
    html = html.replace(regex, value);
    text = text.replace(regex, value);
  });
  
  return {
    subject,
    html,
    text
  };
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the template ID from the URL
    const { id } = params;
    
    // Get the template
    const template = getTemplate(id);
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Get test data from request body
    const body = await request.json();
    const { testEmail, testData = {} } = body;
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email is required' },
        { status: 400 }
      );
    }
    
    // Process the template with test data
    const processedTemplate = processTemplate(template, testData);
    
    // In a real implementation, this would send an actual email
    // For now, we'll just simulate success and return the processed template
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return success response with processed template
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      processedTemplate
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}

// Configure this route to run in the Node.js runtime
export const runtime = 'nodejs'; 