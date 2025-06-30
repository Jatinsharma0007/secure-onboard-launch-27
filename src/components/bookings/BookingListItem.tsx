
import React from 'react';
import { Monitor, Users, Calendar, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Booking } from '@/pages/MyBookingsPage';
import { useToast } from '@/hooks/use-toast';

interface BookingListItemProps {
  booking: Booking;
  onViewDetails: () => void;
}

export function BookingListItem({ booking, onViewDetails }: BookingListItemProps) {
  const { toast } = useToast();
  const Icon = booking.spaceType === 'desk' ? Monitor : Users;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleEdit = () => {
    toast({
      title: "Edit Booking",
      description: "Editing functionality would be implemented here.",
    });
  };

  const handleCancel = () => {
    toast({
      title: "Cancel Booking",
      description: "Cancellation functionality would be implemented here.",
      variant: "destructive",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900">
                {booking.spaceName || 'Unknown Space'}
              </h4>
              <StatusBadge status={booking.status} />
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(booking.date)}
              </div>
              <div>
                {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.location || 'Unknown Location'}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              {booking.purpose || 'No purpose specified'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
