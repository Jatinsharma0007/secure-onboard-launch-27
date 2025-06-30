import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SuggestionBanner } from '@/components/bookings/SuggestionBanner';
import { BookingCard } from '@/components/bookings/BookingCard';
import { QuickActionsPanel } from '@/components/bookings/QuickActionsPanel';
import { SpaceCard } from '@/components/bookings/SpaceCard';
import { BookNowButton } from '@/components/bookings/BookNowButton';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { useSpaces } from '@/hooks/useSpaces';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { DataStateWrapper } from '@/components/ui/DataStateWrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function BookingsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings();
  const { spaces, isLoading: spacesLoading, error: spacesError, refreshSpaces } = useSpaces();
  const { preferences } = useUserPreferences();

  // Get upcoming bookings
  const upcomingBookings = bookings
    .filter(booking => booking.status === 'confirmed' && new Date(booking.start_time) > new Date())
    .slice(0, 3)
    .map(booking => ({
      id: booking.id,
      space: `Space ${booking.space_id.slice(-4)}`,
      location: booking.location || 'Unknown Location',
      date: new Date(booking.booking_date).toLocaleDateString(),
      time: `${new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'confirmed' as const
    }));

  // Get available spaces
  const availableSpaces = spaces
    .filter(space => space.status === 'available')
    .slice(0, 4)
    .map(space => ({
      type: space.space_type === 'room' ? 'Room' as const : 'Desk' as const,
      name: space.name,
      availability: 'Available Now',
      status: 'available' as const
    }));

  // Smart suggestions based on user preferences
  const mockSuggestions = [
    {
      title: "Preferred Space Available",
      icon: "🎯",
      message: preferences?.preferred_space_type 
        ? `Your preferred ${preferences.preferred_space_type} is available now!`
        : "Discover your perfect workspace based on your preferences.",
      actionText: "Book Now",
    },
    {
      title: "AI-Powered Suggestion",
      icon: "🧠",
      message: preferences?.ai_persona_enabled 
        ? "Based on your work style, we suggest a quiet focus pod for your next session."
        : "Enable AI suggestions in your preferences for personalized recommendations.",
      actionText: "Book Now",
    },
    {
      title: "Quick Booking",
      icon: "⚡",
      message: "Popular spaces are filling up fast. Book your spot now!",
      actionText: "Book Now",
    }
  ];

  const quickActions = [
    { label: "Book Again", icon: "🔁" },
    { label: "Book for Tomorrow", icon: "📅" },
    { label: "Smart Booking", icon: "🧠" },
    { label: "1-Hour Desk", icon: "⏳" },
  ];

  const handleSuggestionClick = (suggestion: any) => {
    toast({
      title: "Smart Suggestion",
      description: `${suggestion.title}: ${suggestion.message}`,
    });
  };

  const handleQuickAction = (action: any) => {
    toast({
      title: "Quick Action",
      description: `${action.label} selected`,
    });
  };

  const handleSpaceBook = (space: any) => {
    toast({
      title: "Space Booking",
      description: `Booking ${space.name}...`,
    });
  };

  const handleBookNow = () => {
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      navigate('/book-space');
    }, 1000);
  };

  if (bookingsLoading || spacesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner className="py-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Dashboard</h1>
          <p className="text-gray-600">Manage your workspace and discover new opportunities</p>
        </div>

        <div className="space-y-8">
          {/* Smart Assistant Suggestions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Smart Assistant Suggestions</h2>
            <SuggestionBanner 
              suggestions={mockSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </section>

          {/* Upcoming Bookings */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
              <Link 
                to="/my-bookings" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                See all bookings →
              </Link>
            </div>
            
            <DataStateWrapper
              loading={false}
              error={bookingsError}
              data={upcomingBookings}
              emptyTitle="No upcoming bookings"
              emptyDescription="Book a space to get started!"
              emptyIcon="info"
              emptyActionText="Book a Space"
              onEmptyAction={() => navigate('/book-space')}
              onRetry={refetchBookings}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    space={booking.space}
                    location={booking.location}
                    date={booking.date}
                    time={booking.time}
                    status={booking.status}
                  />
                ))}
              </div>
            </DataStateWrapper>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <QuickActionsPanel 
              actions={quickActions}
              onActionClick={handleQuickAction}
            />
          </section>

          {/* Space Availability */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Now</h2>
            
            <DataStateWrapper
              loading={false}
              error={spacesError}
              data={availableSpaces}
              emptyTitle="No spaces available"
              emptyDescription="No spaces match your current filters. Try adjusting your preferences."
              emptyIcon="search"
              onRetry={refreshSpaces}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {availableSpaces.map((space, index) => (
                  <SpaceCard
                    key={index}
                    type={space.type}
                    name={space.name}
                    availability={space.availability}
                    status={space.status}
                    onBook={() => handleSpaceBook(space)}
                  />
                ))}
              </div>
            </DataStateWrapper>
          </section>
        </div>

        {/* Floating Book Now Button */}
        <div className="fixed bottom-6 right-6">
          <BookNowButton 
            spaceId="quick-book"
            spaceName="Quick Book"
            disabled={isBookingLoading}
          />
        </div>
      </div>
    </div>
  );
}
