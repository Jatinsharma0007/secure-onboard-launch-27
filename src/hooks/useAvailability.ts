
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilityCheck {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function useAvailability() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAvailability = useCallback(async ({
    spaceId,
    date,
    startTime,
    endTime
  }: AvailabilityCheck): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      // Create proper timestamp strings for comparison
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;
      
      console.log('Checking availability for:', { spaceId, startDateTime, endDateTime });
      
      // Check for overlapping bookings
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, booking_date')
        .eq('space_id', spaceId)
        .eq('booking_date', date)
        .in('status', ['confirmed', 'active'])
        .or(`and(start_time.lt.${endDateTime},end_time.gt.${startDateTime})`);

      if (error) {
        console.error('Error checking availability:', error);
        throw error;
      }

      console.log('Existing bookings found:', existingBookings);

      // If no overlapping bookings found, space is available
      return existingBookings.length === 0;
    } catch (error) {
      console.error('Availability check failed:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkAvailability,
    isChecking
  };
}
