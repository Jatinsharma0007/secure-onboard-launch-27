
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useBookingConfirmation() {
  const sendConfirmationEmail = useCallback(async (bookingId: string) => {
    try {
      console.log('Sending booking confirmation email for booking:', bookingId);
      
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId }
      });

      if (error) {
        console.error('Error sending confirmation email:', error);
        toast({
          title: "Email notification failed",
          description: "Your booking is confirmed, but we couldn't send the confirmation email.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Confirmation email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in sendConfirmationEmail:', error);
      toast({
        title: "Email notification failed",
        description: "Your booking is confirmed, but we couldn't send the confirmation email.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return { sendConfirmationEmail };
}
