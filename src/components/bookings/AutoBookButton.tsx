import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Suggestion {
  spaceId: string;
  spaceName: string;
  time: string;
}

interface AutoBookButtonProps {
  suggestion: Suggestion;
}

export function AutoBookButton({ suggestion }: AutoBookButtonProps) {
  const handleAutoBook = () => {
    // In a real implementation, this would call an API to create a booking
    // For now, we'll just show a success toast
    
    // Simulate inserting into suggestions table with status "accepted"
    const mockSuggestion = {
      user_id: 'current-user-id',
      space_id: suggestion.spaceId,
      suggestion_type: 'book-now',
      message: `Based on your focus trend, ${suggestion.spaceName} is ideal.`,
      suggested_time: new Date().toISOString(),
      origin: 'rule-based',
      status: 'accepted',
      delivered_via: 'AI Coach'
    };
    
    console.log('Suggestion accepted:', mockSuggestion);
    
    // Show success toast
    toast.success(`Booking confirmed: ${suggestion.spaceName} at ${suggestion.time}`, {
      description: 'Your booking has been confirmed. You can view it in My Bookings.',
      action: {
        label: 'View',
        onClick: () => console.log('Navigate to My Bookings')
      }
    });
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>Suggested space: <strong>{suggestion.spaceName}</strong></span>
        <Clock className="h-4 w-4 ml-2" />
        <span>Time: <strong>{suggestion.time}</strong></span>
      </div>
      
      <Button 
        onClick={handleAutoBook}
        className="w-full sm:w-auto"
      >
        Auto Book This Space
      </Button>
    </div>
  );
} 