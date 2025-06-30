
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
      // Create datetime strings for comparison
      const requestedStart = new Date(`${date}T${startTime}`);
      const requestedEnd = new Date(`${date}T${endTime}`);
      
      // Check for overlapping bookings
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('id, start_time, end_time')
        .eq('space_id', spaceId)
        .eq('booking_date', date)
        .in('status', ['confirmed', 'active'])
        .gte('end_time', requestedStart.toISOString())
        .lte('start_time', requestedEnd.toISOString());

      if (error) {
        console.error('Error checking availability:', error);
        throw error;
      }

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
