import type { APIRoute } from 'astro';

/**
 * Astro API endpoint to handle contact form submissions
 * 
 * This endpoint receives POST requests from the contact form and can:
 * - Validate the form data
 * - Send emails (using a service like Resend, SendGrid, etc.)
 * - Store submissions in a database (like D1, KV, or external DB)
 * - Return appropriate responses
 * 
 * Route: /api/contact
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

    // TODO: Implement your logic here:
    // 1. Send email notification (using Resend, SendGrid, etc.)
    // 2. Store in database (D1, KV, or external DB)
    // 3. Log submission
    
    // Example: Log the submission (you can replace this with actual logic)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // For now, just return success
    // In production, you would:
    // - Send email using a service like Resend (recommended for Cloudflare)
    // - Store in D1 database or KV store
    // - Set up webhook notifications
    
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