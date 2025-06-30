
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingFormData } from '@/pages/BookSpacePage';

interface DateTimePickerProps {
  formData: BookingFormData;
  onFormChange: (updates: Partial<BookingFormData>) => void;
}

export function DateTimePicker({ formData, onFormChange }: DateTimePickerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Date & Time
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => onFormChange({ date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 mb-2 block">
            Start Time
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => onFormChange({ startTime: e.target.value })}
            className="w-full"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 mb-2 block">
            End Time
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => onFormChange({ endTime: e.target.value })}
            min={formData.startTime}
            className="w-full"
            required
          />
        </div>
      </div>
      
      {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
        <div className="mt-2 text-sm text-red-600">
          End time must be after start time
        </div>
      )}
    </div>
  );
}
