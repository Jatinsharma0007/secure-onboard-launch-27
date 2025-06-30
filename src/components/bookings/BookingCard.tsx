
import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { useToast } from '@/hooks/use-toast';

interface BookingCardProps {
  space: string;
  location: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export function BookingCard({ space, location, date, time, status }: BookingCardProps) {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Edit Booking",
      description: `Editing booking for ${space}`,
    });
  };

  const handleCancel = () => {
    toast({
      title: "Cancel Booking",
      description: `Canceling booking for ${space}`,
    });
  };

  const handleViewMap = () => {
    toast({
      title: "View Map",
      description: `Showing location for ${location}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{space || 'Unknown Space'}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {location || 'Unknown Location'}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {date || 'No date'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {time || 'No time specified'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {status === 'confirmed' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="text-xs"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="text-xs"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleViewMap}
          className="text-xs"
        >
          <MapPin className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
