
import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookingFormData } from '@/pages/BookSpacePage';
import { usePlaces } from '@/hooks/usePlaces';

interface FilterPanelProps {
  formData: BookingFormData;
  onFormChange: (updates: Partial<BookingFormData>) => void;
}

const purposes = [
  'Meeting',
  'Focus Work',
  'Team Collaboration',
  'Client Call',
  'Training',
  'Workshop',
  'Other'
];

export function FilterPanel({ formData, onFormChange }: FilterPanelProps) {
  const { places, isLoading: placesLoading } = usePlaces();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
      
      <div className="space-y-6">
        {/* Space Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Space Type
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="spaceType"
                value="desk"
                checked={formData.spaceType === 'desk'}
                onChange={(e) => onFormChange({ spaceType: e.target.value as 'desk' | 'room' })}
                className="mr-2"
              />
              <Users className="h-4 w-4 mr-1" />
              Desk
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="spaceType"
                value="room"
                checked={formData.spaceType === 'room'}
                onChange={(e) => onFormChange({ spaceType: e.target.value as 'desk' | 'room' })}
                className="mr-2"
              />
              <MapPin className="h-4 w-4 mr-1" />
              Room
            </label>
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
            <MapPin className="h-4 w-4 inline mr-1" />
            Location
          </Label>
          <Select 
            value={formData.location} 
            onValueChange={(value) => onFormChange({ location: value })}
            disabled={placesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placesLoading ? "Loading locations..." : "Select a location"} />
            </SelectTrigger>
            <SelectContent>
              {places.map((place) => (
                <SelectItem key={place} value={place}>
                  {place}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purpose */}
        <div>
          <Label htmlFor="purpose" className="text-sm font-medium text-gray-700 mb-2 block">
            Purpose
          </Label>
          <Select 
            value={formData.purpose} 
            onValueChange={(value) => onFormChange({ purpose: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special requirements or preferences..."
            value={formData.notes}
            onChange={(e) => onFormChange({ notes: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}
