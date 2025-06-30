import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookingConfirmation } from './useBookingConfirmation';

export interface Booking {
  id: string;
  user_id: string;
  space_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  space_type?: string;
  location?: string;
  purpose?: string;
  notes?: string;
  status: string;
  checked_in?: boolean;
  check_in_time?: string;
  check_out_time?: string;
  no_show?: boolean;
  overbooked?: boolean;
  was_rescheduled?: boolean;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookingData {
  space_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  space_type?: string;
  location?: string;
  purpose?: string;
  notes?: string;
}

export function useBookings() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { sendConfirmationEmail } = useBookingConfirmation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingData) => {
    if (!user || !profile) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          space_id: bookingData.space_id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          booking_date: bookingData.booking_date,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          space_type: bookingData.space_type,
          location: bookingData.location,
          purpose: bookingData.purpose,
          notes: bookingData.notes,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      if (data?.id) {
        await sendConfirmationEmail(data.id);
      }

      await fetchBookings();
      toast({
        title: "Booking created",
        description: "Your space has been booked successfully. Check your email for confirmation.",
      });
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchBookings();
      toast({
        title: "Booking updated",
        description: "Your booking has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelBooking = async (id: string) => {
    await updateBooking(id, { status: 'cancelled' });
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
}
