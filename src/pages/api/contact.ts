import type { APIRoute } from 'astro';
import { Resend } from 'resend';

/**
 * Astro API endpoint to handle contact form submissions
 * 
 * This endpoint receives POST requests from the contact form and:
 * - Validates the form data
 * - Sends email notifications using Resend
 * - Returns appropriate responses
 * 
 * Route: /api/contact
 * 
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - CONTACT_FROM: Email address to send from (e.g., "Portfolio <noreply@yourdomain.com>")
 * - CONTACT_TO: Email address to receive contact form submissions
 */

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the request body
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get environment variables
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const contactFrom = import.meta.env.CONTACT_FROM;
    const contactTo = import.meta.env.CONTACT_TO;

    // Validate environment variables
    if (!resendApiKey || !contactFrom || !contactTo) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({
          error: 'Server configuration error',
          message: 'Email service is not properly configured. Please try again later.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Escape HTML to prevent XSS attacks
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Send email notification
    try {
      const emailResult = await resend.emails.send({
        from: contactFrom,
        to: contactTo,
        replyTo: email,
        subject: `New Contact Form: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #555; }
                .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
                .message { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Contact Form Submission</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${safeName}</div>
                  </div>
                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
                  </div>
                  <div class="field">
                    <div class="label">Subject:</div>
                    <div class="value">${safeSubject}</div>
                  </div>
                  <div class="field">
                    <div class="label">Message:</div>
                    <div class="value message">${safeMessage}</div>
                  </div>
                  <div class="field">
                    <div class="label">Timestamp:</div>
                    <div class="value">${new Date().toISOString()}</div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Timestamp: ${new Date().toISOString()}
        `.trim(),
      });

      if (emailResult.error) {
        console.error('Resend API error:', emailResult.error);
        return new Response(
          JSON.stringify({
            error: 'Failed to send email',
            message: 'Your message was received but we encountered an issue sending the notification. Please try again later.'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('Contact form submission sent successfully:', {
        name,
        email,
        subject,
        emailId: emailResult.data?.id,
        timestamp: new Date().toISOString(),
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails, but log it
      // You might want to handle this differently depending on your requirements
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};