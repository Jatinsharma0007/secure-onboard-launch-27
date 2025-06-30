import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DateTimePicker } from '@/components/bookings/DateTimePicker';
import { FilterPanel } from '@/components/bookings/FilterPanel';
import { SpaceCardSelectable } from '@/components/bookings/SpaceCardSelectable';
import { SuggestionBanner } from '@/components/bookings/SuggestionBanner';
import { toast } from '@/components/ui/use-toast';
import { useSpaces } from '@/hooks/useSpaces';
import { useBookings } from '@/hooks/useBookings';
import { useAvailability } from '@/hooks/useAvailability';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export interface BookingFormData {
  date: string;
  startTime: string;
  endTime: string;
  spaceType: 'desk' | 'room';
  location: string;
  purpose: string;
  notes: string;
  selectedSpace?: string;
}

export default function BookSpacePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { spaces, isLoading: spacesLoading, error: spacesError, fetchSpaces } = useSpaces();
  const { createBooking } = useBookings();
  const { checkAvailability, isChecking } = useAvailability();
  
  // Get spaceId from URL query params if available
  const searchParams = new URLSearchParams(location.search);
  const urlSpaceId = searchParams.get('spaceId');
  
  const [formData, setFormData] = useState<BookingFormData>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    spaceType: 'desk',
    location: '',
    purpose: '',
    notes: '',
    selectedSpace: urlSpaceId || undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [filteredSpaces, setFilteredSpaces] = useState(spaces);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update filtered spaces when spaces or form data changes
  useEffect(() => {
    if (!spaces.length) return;
    
    let filtered = [...spaces];
    
    // Filter by space type
    if (formData.spaceType) {
      filtered = filtered.filter(space => space.space_type === formData.spaceType);
    }
    
    // Filter by location using the places column data
    if (formData.location) {
      filtered = filtered.filter(space => 
        space.places && space.places.toLowerCase().includes(formData.location.toLowerCase())
      );
    }
    
    // Only show bookable spaces
    filtered = filtered.filter(space => space.is_bookable && space.status === 'available');
    
    setFilteredSpaces(filtered);
    
    // If there's a selected space that doesn't match filters, clear it
    if (formData.selectedSpace) {
      const spaceStillValid = filtered.some(space => space.id === formData.selectedSpace);
      if (!spaceStillValid) {
        setFormData(prev => ({ ...prev, selectedSpace: undefined }));
      }
    }
  }, [spaces, formData.spaceType, formData.location, formData.selectedSpace]);

  const handleFormChange = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setValidationErrors([]); // Clear validation errors when form changes
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.date) errors.push('Date is required');
    if (!formData.startTime) errors.push('Start time is required');
    if (!formData.endTime) errors.push('End time is required');
    if (!formData.location) errors.push('Location is required');
    if (!formData.selectedSpace) errors.push('Please select a space');
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.push('End time must be after start time');
    }
    
    // Check if booking is in the past
    if (formData.date && formData.startTime) {
      const bookingDateTime = new Date(`${formData.date}T${formData.startTime}`);
      if (bookingDateTime < new Date()) {
        errors.push('Cannot book in the past');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book a space",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors and try again",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check availability before booking
      const isAvailable = await checkAvailability({
        spaceId: formData.selectedSpace!,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      if (!isAvailable) {
        toast({
          title: "Booking Failed",
          description: "This space is not available at the selected time. Please choose a different time or space.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      await createBooking({
        space_id: formData.selectedSpace!,
        booking_date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        space_type: formData.spaceType,
        location: formData.location,
        purpose: formData.purpose,
        notes: formData.notes
      });
      
      toast({
        title: "Booking Successful!",
        description: "Your space has been successfully booked.",
      });
      
      // Navigate to my bookings page
      navigate('/my-bookings');
    } catch (error: any) {
      const errorMessage = error.message || "Please try again later";
      toast({
        title: "Booking Failed",
        description: errorMessage.includes("available") 
          ? "No rooms are available at the selected time. Please choose a different time slot."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get suggestions based on user preferences and availability
  const mockSuggestions = [
    {
      title: "Optimal Focus Time",
      icon: "🧠",
      message: "Based on your patterns, book between 10-11 AM for peak productivity.",
      actionText: "Book Now",
    },
    {
      title: "Quiet Zone Available",
      icon: "🤫",
      message: "Peaceful workspace available in the quiet zone this afternoon.",
      actionText: "Reserve",
    }
  ];

  // Find the selected space details
  const selectedSpace = spaces.find(space => space.id === formData.selectedSpace);

  if (spacesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Spaces</h2>
              <p className="text-gray-600 mb-6">{spacesError}</p>
              <Button onClick={fetchSpaces} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Space</h1>
            <p className="text-gray-600">Find and reserve your perfect workspace</p>
            {!spacesLoading && spaces.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <strong>No spaces found in database.</strong> Please contact your administrator to add spaces.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <DateTimePicker 
                formData={formData}
                onFormChange={handleFormChange}
              />
              
              <FilterPanel 
                formData={formData}
                onFormChange={handleFormChange}
              />

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <SuggestionBanner 
                suggestions={mockSuggestions}
                onSuggestionClick={(suggestion) => {
                  toast({
                    title: "Smart Suggestion",
                    description: suggestion.message,
                  });
                }}
              />

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available {formData.spaceType === 'desk' ? 'Desks' : 'Rooms'}
                  {formData.location && ` in ${formData.location}`}
                </h3>
                
                {spacesLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : filteredSpaces.length === 0 ? (
                  <EmptyState 
                    title="No spaces available"
                    description="Try changing your filters or selecting a different date/time"
                    icon="search"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpaces.map(space => (
                      <SpaceCardSelectable
                        key={space.id}
                        space={{
                          id: space.id,
                          name: space.name,
                          type: space.space_type,
                          zone: space.places || space.location,
                          available: space.status === 'available',
                          price: space.space_type === 'desk' ? '$25/hour' : '$50/hour'
                        }}
                        isSelected={formData.selectedSpace === space.id}
                        onSelect={(spaceId) => handleFormChange({ selectedSpace: spaceId })}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formData.date || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {formData.startTime && formData.endTime 
                        ? `${formData.startTime} - ${formData.endTime}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{formData.spaceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{formData.location || 'Not selected'}</span>
                  </div>
                  {formData.purpose && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium">{formData.purpose}</span>
                    </div>
                  )}
                  {selectedSpace && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected:</span>
                      <span className="font-medium">{selectedSpace.name}</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleBookNow}
                  disabled={isLoading || isChecking || validationErrors.length > 0}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {(isLoading || isChecking) ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>{isChecking ? 'Checking...' : 'Booking...'}</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>Book Now</span>
                    </>
                  )}
                </Button>

                {validationErrors.length > 0 && (
                  <div className="mt-2 text-xs text-red-600 text-center">
                    Please fix the errors above to proceed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
