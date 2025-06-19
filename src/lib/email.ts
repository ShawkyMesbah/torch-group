import resend from './resend';

export interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  attachment?: string;
}

export interface NewsletterSubscriptionEmailProps {
  email: string;
  name?: string;
}

// Send email notification to admin when contact form is submitted
export async function sendContactFormNotification({
  name,
  email,
  phone,
  subject,
  message,
  attachment,
}: ContactEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Torch Group <onboarding@resend.dev>',
      to: [process.env.EMAIL_FROM || 'notifications@torchgroup.co'],
      subject: `New Contact Form: ${subject}`,
      text: `
        New contact form submission:
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        Subject: ${subject}
        Message:
        ${message}
        ${attachment ? `Attachment: ${attachment}` : ''}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #dc2626;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <div style="background: #232326; color: #fff; padding: 16px; border-radius: 6px;">${message.replace(/\n/g, '<br>')}</div>
          ${attachment ? `
          <p style="margin-top: 16px;"><strong>Attachment:</strong></p>
          <p><a href="${attachment}" target="_blank" style="color: #dc2626; text-decoration: underline;">View attached file</a></p>
          ` : ''}
        </div>
      `,
    });
    if (error) {
      console.error('Error sending contact form notification:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send contact form notification:', error);
    return { success: false, error };
  }
}

// Send confirmation email to user when contact form is submitted
export async function sendContactFormConfirmation({
  name,
  email,
  subject,
}: ContactEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Torch Group <onboarding@resend.dev>',
      to: [email],
      subject: `We've received your message: ${subject}`,
      text: `
        Hello ${name},
        Thank you for contacting Torch Group. We've received your message regarding "${subject}".
        Our team will review your inquiry and get back to you as soon as possible.
        Best regards,
        The Torch Group Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #dc2626;">Thank you for contacting Torch Group</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We've received your message regarding <strong>"${subject}"</strong>.</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <p style="margin-top: 24px;">Best regards,<br><strong>The Torch Group Team</strong></p>
        </div>
      `,
    });
    if (error) {
      console.error('Error sending contact form confirmation:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send contact form confirmation:', error);
    return { success: false, error };
  }
}

// Send newsletter subscription confirmation email
export async function sendNewsletterConfirmation({
  email,
  name,
}: NewsletterSubscriptionEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Torch Group <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Torch Group Newsletter',
      text: `
        Hello ${name ? name : 'there'},
        Thank you for subscribing to the Torch Group newsletter.
        You'll now receive our latest updates, insights, and announcements directly to your inbox.
        Best regards,
        The Torch Group Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #dc2626;">Welcome to Torch Group Newsletter</h2>
          <p>Hello <strong>${name ? name : 'there'}</strong>,</p>
          <p>Thank you for subscribing to the Torch Group newsletter.</p>
          <p>You'll now receive our latest updates, insights, and announcements directly to your inbox.</p>
          <p style="margin-top: 24px;">Best regards,<br><strong>The Torch Group Team</strong></p>
        </div>
      `,
    });
    if (error) {
      console.error('Error sending newsletter confirmation:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send newsletter confirmation:', error);
    return { success: false, error };
  }
}

// Send newsletter subscription notification to admin
export async function sendNewsletterSubscriptionNotification({
  email,
  name,
}: NewsletterSubscriptionEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Torch Group <onboarding@resend.dev>',
      to: [process.env.EMAIL_FROM || 'notifications@torchgroup.co'],
      subject: 'New Newsletter Subscription',
      text: `
        New newsletter subscription:
        Email: ${email}
        Name: ${name || 'Not provided'}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #18181b; color: #fff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #dc2626;">New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        </div>
      `,
    });
    if (error) {
      console.error('Error sending newsletter subscription notification:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send newsletter subscription notification:', error);
    return { success: false, error };
  }
} 