
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Space } from '@/hooks/useSpaces';
import { StatusBadge } from '@/components/bookings/StatusBadge';
import { BookNowButton } from '@/components/bookings/BookNowButton';
import { 
  Users, 
  Monitor, 
  Tv, 
  Video, 
  Mic, 
  Keyboard, 
  Cast, 
  Lock, 
  Users2, 
  Thermometer, 
  PanelTop, 
  SunMedium, 
  Sofa, 
  Presentation, 
  Coffee
} from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onClick: () => void;
}

// Map features to icons
const featureIcons: Record<string, React.ReactNode> = {
  'soundproof': <Badge variant="outline" className="flex items-center gap-1"><Mic className="h-3 w-3" /> Soundproof</Badge>,
  'AC': <Badge variant="outline" className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> AC</Badge>,
  'whiteboard': <Badge variant="outline" className="flex items-center gap-1"><PanelTop className="h-3 w-3" /> Whiteboard</Badge>,
  'standing desk': <Badge variant="outline" className="flex items-center gap-1"><PanelTop className="h-3 w-3" /> Standing Desk</Badge>,
  'natural light': <Badge variant="outline" className="flex items-center gap-1"><SunMedium className="h-3 w-3" /> Natural Light</Badge>,
  'privacy': <Badge variant="outline" className="flex items-center gap-1"><Lock className="h-3 w-3" /> Privacy</Badge>,
  'open space': <Badge variant="outline" className="flex items-center gap-1"><Users2 className="h-3 w-3" /> Open Space</Badge>,
  'lounge seating': <Badge variant="outline" className="flex items-center gap-1"><Sofa className="h-3 w-3" /> Lounge</Badge>,
  'projector': <Badge variant="outline" className="flex items-center gap-1"><Presentation className="h-3 w-3" /> Projector</Badge>,
  'near kitchen': <Badge variant="outline" className="flex items-center gap-1"><Coffee className="h-3 w-3" /> Near Kitchen</Badge>,
};

// Map equipment to icons
const equipmentIcons: Record<string, React.ReactNode> = {
  'Monitor': <Badge variant="secondary" className="flex items-center gap-1"><Monitor className="h-3 w-3" /> Monitor</Badge>,
  'HDMI': <Badge variant="secondary" className="flex items-center gap-1">HDMI</Badge>,
  'webcam': <Badge variant="secondary" className="flex items-center gap-1"><Video className="h-3 w-3" /> Webcam</Badge>,
  'docking station': <Badge variant="secondary" className="flex items-center gap-1">Dock</Badge>,
  'conference system': <Badge variant="secondary" className="flex items-center gap-1"><Mic className="h-3 w-3" /> Conf System</Badge>,
  'keyboard': <Badge variant="secondary" className="flex items-center gap-1"><Keyboard className="h-3 w-3" /> Keyboard</Badge>,
  'TV': <Badge variant="secondary" className="flex items-center gap-1"><Tv className="h-3 w-3" /> TV</Badge>,
  'wireless presentation': <Badge variant="secondary" className="flex items-center gap-1"><Cast className="h-3 w-3" /> Wireless</Badge>,
};

export function SpaceCard({ space, onClick }: SpaceCardProps) {
  // Format last used time
  const lastUsedText = space.last_used_at 
    ? `Last used ${formatDistanceToNow(new Date(space.last_used_at), { addSuffix: true })}`
    : 'Never used';
  
  // Determine if space is popular
  const isPopular = space.usage_score >= 8;

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        {/* Space image or placeholder */}
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-lg font-medium">{space.name}</div>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={space.status} />
        </div>
        
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-orange-500">Popular</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{space.name}</h3>
            <p className="text-sm text-gray-500">{space.places || space.location}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>
        
        {/* Type and privacy */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline">
            {space.space_type === 'room' ? 'Room' : 'Desk'}
          </Badge>
          <Badge variant={space.is_private ? 'default' : 'secondary'}>
            {space.is_private ? 'Private' : 'Shared'}
          </Badge>
        </div>
        
        {/* Features */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {space.features.slice(0, 3).map(feature => 
              featureIcons[feature] ? (
                <div key={feature}>
                  {featureIcons[feature]}
                </div>
              ) : null
            )}
            {space.features.length > 3 && (
              <Badge variant="outline">+{space.features.length - 3} more</Badge>
            )}
          </div>
        </div>
        
        {/* Equipment */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {space.equipment.slice(0, 2).map(item => 
              equipmentIcons[item] ? (
                <div key={item}>
                  {equipmentIcons[item]}
                </div>
              ) : null
            )}
            {space.equipment.length > 2 && (
              <Badge variant="secondary">+{space.equipment.length - 2} more</Badge>
            )}
          </div>
        </div>
        
        {/* Last used */}
        <p className="text-xs text-gray-500 mt-4">{lastUsedText}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <BookNowButton 
          spaceId={space.id} 
          spaceName={space.name} 
          disabled={!space.is_bookable || space.status !== 'available'} 
        />
      </CardFooter>
    </Card>
  );
}
