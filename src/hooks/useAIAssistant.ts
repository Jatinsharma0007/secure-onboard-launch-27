import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookingConfirmation } from './useBookingConfirmation';

export interface BookingRequest {
  date: string;
  startTime: string;
  endTime: string;
  spaceType?: string;
  purpose?: string;
  notes?: string;
}

export interface AvailableSpace {
  id: string;
  name: string;
  space_type: string;
  capacity: number;
  location: string;
  features: string[];
  equipment: string[];
}

export function useAIAssistant() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { sendConfirmationEmail } = useBookingConfirmation();
  const [isProcessing, setIsProcessing] = useState(false);

  const getAvailableSpaces = useCallback(async (date: string, startTime: string, endTime: string) => {
    try {
      // Get all bookable spaces
      const { data: spaces, error: spacesError } = await supabase
        .from('spaces')
        .select('*')
        .eq('is_bookable', true)
        .eq('status', 'available');

      if (spacesError) throw spacesError;

      // Check for conflicts with existing bookings
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

      const { data: conflicts, error: conflictsError } = await supabase
        .from('bookings')
        .select('space_id')
        .eq('booking_date', date)
        .eq('status', 'confirmed')
        .or(`start_time.lte.${endDateTime},end_time.gte.${startDateTime}`);

      if (conflictsError) throw conflictsError;

      const conflictSpaceIds = conflicts?.map(c => c.space_id) || [];
      const availableSpaces = spaces?.filter(space => !conflictSpaceIds.includes(space.id)) || [];

      return availableSpaces;
    } catch (error) {
      console.error('Error fetching available spaces:', error);
      return [];
    }
  }, []);

  const createBooking = useCallback(async (spaceId: string, bookingRequest: BookingRequest) => {
    if (!user || !profile) {
      throw new Error('User not authenticated');
    }

    try {
      setIsProcessing(true);

      const startDateTime = `${bookingRequest.date}T${bookingRequest.startTime}:00`;
      const endDateTime = `${bookingRequest.date}T${bookingRequest.endTime}:00`;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          space_id: spaceId,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone || '',
          role: profile.role,
          booking_date: bookingRequest.date,
          start_time: startDateTime,
          end_time: endDateTime,
          space_type: bookingRequest.spaceType,
          purpose: bookingRequest.purpose,
          notes: bookingRequest.notes,
          status: 'confirmed',
          source: 'AI Assistant'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      if (data?.id) {
        await sendConfirmationEmail(data.id);
      }

      // Log suggestion as accepted
      await supabase
        .from('suggestions')
        .insert({
          user_id: user.id,
          space_id: spaceId,
          suggestion_type: 'book-now',
          message: `AI Assistant booking for ${bookingRequest.purpose || 'workspace'}`,
          origin: 'ai-assistant',
          status: 'accepted',
          delivered_via: 'AI Coach',
          suggested_time: startDateTime
        });

      toast({
        title: "Booking Confirmed!",
        description: "Your space has been successfully booked. Check your email for confirmation.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [user, profile, toast, sendConfirmationEmail]);

  const getUserBookings = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          spaces!inner(name, location, space_type)
        `)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }, [user]);

  const getSiteInformation = useCallback(async () => {
    try {
      // Get general site statistics
      const [spacesResult, bookingsResult, locationsResult] = await Promise.all([
        supabase.from('spaces').select('count', { count: 'exact' }).eq('is_bookable', true),
        supabase.from('bookings').select('count', { count: 'exact' }).eq('status', 'confirmed'),
        supabase.from('locations').select('*').eq('is_active', true)
      ]);

      return {
        totalSpaces: spacesResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        locations: locationsResult.data || []
      };
    } catch (error) {
      console.error('Error fetching site information:', error);
      return {
        totalSpaces: 0,
        totalBookings: 0,
        locations: []
      };
    }
  }, []);

  return {
    getAvailableSpaces,
    createBooking,
    getUserBookings,
    getSiteInformation,
    isProcessing
  };
}
