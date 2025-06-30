
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Space } from '@/hooks/useSpaces';
import { StatusBadge } from '@/components/bookings/StatusBadge';
import { BookNowButton } from '@/components/bookings/BookNowButton';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  Clock
} from 'lucide-react';

interface SpaceDetailsModalProps {
  space: Space;
  isOpen: boolean;
  onClose: () => void;
}

export function SpaceDetailsModal({ space, isOpen, onClose }: SpaceDetailsModalProps) {
  // Format last used time
  const lastUsedText = space.last_used_at 
    ? `Last used ${formatDistanceToNow(new Date(space.last_used_at), { addSuffix: true })}`
    : 'Never used';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{space.name}</DialogTitle>
            <StatusBadge status={space.status} />
          </div>
          <DialogDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {space.places || space.location}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            {/* Space image or placeholder */}
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
              <div className="text-gray-400 text-lg font-medium">{space.name}</div>
            </div>
            
            {/* Basic details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>
                  Capacity: <strong>{space.capacity} {space.capacity === 1 ? 'person' : 'people'}</strong>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span>
                  Popularity: <strong>{space.usage_score}/10</strong>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{lastUsedText}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Type and privacy */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">
                {space.space_type === 'room' ? 'Room' : 'Desk'}
              </Badge>
              <Badge variant={space.is_private ? 'default' : 'secondary'}>
                {space.is_private ? 'Private' : 'Shared'}
              </Badge>
              {space.is_bookable ? (
                <Badge variant="default" className="bg-green-500">Bookable</Badge>
              ) : (
                <Badge variant="destructive">Not Bookable</Badge>
              )}
            </div>
            
            {/* Book now button */}
            <BookNowButton 
              spaceId={space.id} 
              spaceName={space.name} 
              disabled={!space.is_bookable || space.status !== 'available'}
              fullWidth 
            />
          </div>
          
          {/* Right column */}
          <div>
            {/* Features */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {space.features.length > 0 ? (
                  space.features.map(feature => (
                    <Badge key={feature} variant="outline">{feature}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No features listed</span>
                )}
              </div>
            </div>
            
            {/* Equipment */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {space.equipment.length > 0 ? (
                  space.equipment.map(item => (
                    <Badge key={item} variant="secondary">{item}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No equipment listed</span>
                )}
              </div>
            </div>
            
            {/* Availability */}
            <div>
              <h3 className="text-sm font-medium mb-2">Availability</h3>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Standard hours: 9:00 AM - 6:00 PM</span>
                </div>
                <p className="text-xs text-gray-500">
                  Contact admin for special availability requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
