
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  userEmail: string;
  userName: string;
  spaceName: string;
  location: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  spaceType?: string;
  purpose?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { bookingId }: { bookingId: string } = await req.json();

    // Fetch booking details with space information
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        spaces!inner(name, location, space_type)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Error fetching booking:', error);
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format date and time for display
    const bookingDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const startTime = new Date(booking.start_time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const endTime = new Date(booking.end_time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Create booking confirmation email
    const emailResponse = await resend.emails.send({
      from: "SPARC Workspace <onboarding@resend.dev>",
      to: [booking.email],
      subject: `Booking Confirmed: ${booking.spaces.name} on ${bookingDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your workspace is reserved and ready</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Hello ${booking.full_name}!</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Your booking has been successfully confirmed. Here are the details:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0; margin-bottom: 15px;">📍 Booking Details</h3>
              
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                  <strong>Space:</strong>
                  <span>${booking.spaces.name}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                  <strong>Location:</strong>
                  <span>${booking.spaces.location}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                  <strong>Date:</strong>
                  <span>${bookingDate}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                  <strong>Time:</strong>
                  <span>${startTime} - ${endTime}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                  <strong>Type:</strong>
                  <span style="text-transform: capitalize;">${booking.spaces.space_type}</span>
                </div>
                
                ${booking.purpose ? `
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <strong>Purpose:</strong>
                  <span>${booking.purpose}</span>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0; margin-bottom: 10px;">🔔 Important Reminders</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Please arrive on time for your booking</li>
                <li>Remember to check in when you arrive</li>
                <li>If you need to cancel or reschedule, please do so at least 2 hours in advance</li>
                <li>Keep this email as your booking reference</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 16px; color: #666;">
                Need help? Contact us at <a href="mailto:support@sparc.com" style="color: #667eea;">support@sparc.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">
              This is an automated message from SPARC Workspace.<br>
              Booking ID: ${booking.id}
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Booking confirmation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: 'Booking confirmation email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error("Error sending booking confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send confirmation email',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
