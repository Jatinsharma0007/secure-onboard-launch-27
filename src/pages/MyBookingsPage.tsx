
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BookingListItem } from '@/components/bookings/BookingListItem';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import { useBookings } from '@/hooks/useBookings';
import { DataStateWrapper } from '@/components/ui/DataStateWrapper';
import { Button } from '@/components/ui/button';

export interface Booking {
  id: string;
  spaceName: string;
  spaceType: 'desk' | 'room';
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  notes: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { bookings, loading, error, refetch } = useBookings();

  // Transform bookings data for display
  const transformedBookings = bookings.map(booking => ({
    id: booking.id,
    spaceName: `Space ${booking.space_id.slice(-4)}`,
    spaceType: (booking.space_type as 'desk' | 'room') || 'desk',
    location: booking.location || 'Unknown Location',
    date: new Date(booking.booking_date).toDateString(),
    startTime: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    purpose: booking.purpose || 'No purpose specified',
    notes: booking.notes || '',
    status: booking.status as 'confirmed' | 'completed' | 'cancelled',
  }));

  const now = new Date();
  const upcomingBookings = transformedBookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.date) >= now
  );
  
  const pastBookings = transformedBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled' || new Date(booking.date) < now
  );

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your workspace reservations</p>
          </div>

          <DataStateWrapper
            loading={loading}
            error={error}
            data={bookings}
            emptyTitle="No bookings found"
            emptyDescription="You haven't made any bookings yet. Book a space to get started!"
            emptyIcon="info"
            emptyActionText="Book a Space"
            onEmptyAction={() => navigate('/book-space')}
            onRetry={refetch}
          >
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'upcoming'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'past'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Past ({pastBookings.length})
                  </button>
                </nav>
              </div>

              {/* Bookings List */}
              <div className="p-6">
                {currentBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {activeTab} bookings
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {activeTab === 'upcoming' 
                        ? "You don't have any upcoming bookings."
                        : "No past bookings to show."
                      }
                    </p>
                    {activeTab === 'upcoming' && (
                      <Button onClick={() => navigate('/book-space')}>
                        Book a Space
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBookings.map(booking => (
                      <BookingListItem
                        key={booking.id}
                        booking={booking}
                        onViewDetails={() => setSelectedBooking(booking)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DataStateWrapper>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
