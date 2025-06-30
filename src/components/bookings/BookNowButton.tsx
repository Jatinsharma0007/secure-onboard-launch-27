
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Calendar } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';

interface BookNowButtonProps {
  spaceId: string;
  spaceName: string;
  bookingData?: {
    date: string;
    startTime: string;
    endTime: string;
    spaceType?: string;
    location?: string;
    purpose?: string;
    notes?: string;
  };
  disabled?: boolean;
  fullWidth?: boolean;
}

export function BookNowButton({ 
  spaceId, 
  spaceName, 
  bookingData,
  disabled = false,
  fullWidth = false
}: BookNowButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  
  const handleBookNow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers (like modal open)
    
    if (!user) {
      toast.error("Please login to book a space");
      navigate('/login');
      return;
    }
    
    // If we have booking data, create the booking directly
    if (bookingData) {
      try {
        await createBooking({
          space_id: spaceId,
          booking_date: bookingData.date,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          space_type: bookingData.spaceType,
          location: bookingData.location,
          purpose: bookingData.purpose,
          notes: bookingData.notes
        });
        
        toast.success(`Successfully booked ${spaceName}`, {
          description: `Your booking has been confirmed. Check your email for details.`,
        });
        
        // Navigate to my bookings page
        navigate('/my-bookings');
      } catch (error: any) {
        toast.error("Booking failed", {
          description: error.message || "Please try again later."
        });
      }
    } else {
      // If no booking data, navigate to booking page
      toast.success(`Booking initiated for ${spaceName}`, {
        description: 'You can complete your booking details now.',
        action: {
          label: 'Cancel',
          onClick: () => toast.error('Booking cancelled')
        }
      });
      
      // Navigate to booking page with space ID
      navigate(`/book-space?spaceId=${spaceId}`);
    }
  };

  return (
    <Button 
      onClick={handleBookNow}
      disabled={disabled}
      className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
    >
      <Calendar className="h-4 w-4" />
      Book Now
    </Button>
  );
}
