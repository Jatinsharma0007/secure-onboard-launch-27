
import React from 'react';
import { X, Calendar, Clock, MapPin, Target, FileText, Monitor, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Booking } from '@/pages/MyBookingsPage';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const { toast } = useToast();
  
  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  const Icon = booking.spaceType === 'desk' ? Monitor : Users;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleLeaveFeedback = () => {
    toast({
      title: "Feedback",
      description: "Feedback functionality would be implemented here.",
    });
  };

  const handleCancelBooking = () => {
    toast({
      title: "Cancel Booking",
      description: "Booking cancellation would be processed here.",
      variant: "destructive",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Space Info */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {booking.spaceName || 'Unknown Space'}
              </h3>
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-sm text-gray-600">{formatDate(booking.date)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time</p>
                <p className="text-sm text-gray-600">
                  {booking.startTime || 'N/A'} - {booking.endTime || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{booking.location || 'Unknown Location'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Purpose</p>
                <p className="text-sm text-gray-600">{booking.purpose || 'No purpose specified'}</p>
              </div>
            </div>

            {booking.notes && (
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Notes</p>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {booking.status === 'completed' && (
              <Button
                onClick={handleLeaveFeedback}
                variant="outline"
                className="flex-1"
              >
                Leave Feedback
              </Button>
            )}
            
            {booking.status === 'confirmed' && (
              <Button
                onClick={handleCancelBooking}
                variant="destructive"
                className="flex-1"
              >
                Cancel Booking
              </Button>
            )}
            
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
