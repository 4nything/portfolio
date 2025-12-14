import type { APIRoute } from 'astro';

/**
 * Astro API endpoint to handle contact form submissions
 * 
 * This endpoint receives POST requests from the contact form and:
 * - Validates the form data
 * - Sends email notifications using Resend API (direct fetch)
 * - Returns appropriate responses
 * 
 * Route: /api/contact
 * 
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - RESEND_BASE_URL: Resend API base URL
 * - RESEND_SANDBOX: Resend sandbox identifier
 * - CONTACT_FROM: Email address to send from
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
    const resendBaseUrl = import.meta.env.RESEND_BASE_URL;
    const resendSandbox = import.meta.env.RESEND_SANDBOX;
    const contactFrom = import.meta.env.CONTACT_FROM;
    const contactTo = import.meta.env.CONTACT_TO;

    // Validate environment variables
    if (!resendApiKey || !resendBaseUrl || !resendSandbox || !contactFrom || !contactTo) {
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

    // Build email text content
    const emailText = `
      New Contact Form Submission
        
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
        
      Message:
      ${message}
        
      Timestamp: ${new Date().toISOString()}
    `.trim();

    // Build URL with query parameters
    const url = new URL(`${resendBaseUrl}/v3/${resendSandbox}/messages`);
    url.searchParams.append('from', contactFrom);
    url.searchParams.append('to', contactTo);
    url.searchParams.append('subject', `New Contact Form: ${subject}`);
    url.searchParams.append('text', emailText);

    // Create Basic Auth header
    const authHeader = `Basic ${btoa(`api:${resendApiKey}`)}`;

    // Send email notification via Resend API
    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Resend API error:', response.status, errorData);
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

      const result = await response.json();
      console.log('Contact form submission sent successfully:', {
        name,
        email,
        subject,
        timestamp: new Date().toISOString(),
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);
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