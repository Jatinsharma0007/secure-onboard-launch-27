import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SpaceFilters } from '@/hooks/useSpaces';
import { usePlaces } from '@/hooks/usePlaces';
import { Search, X } from 'lucide-react';

interface FilterPanelProps {
  filters: SpaceFilters;
  setFilters: React.Dispatch<React.SetStateAction<SpaceFilters>>;
  applyFilters: () => void;
}

// Available features and equipment for filtering
const availableFeatures = [
  'soundproof',
  'AC',
  'whiteboard',
  'standing desk',
  'natural light',
  'privacy',
  'open space',
  'lounge seating',
  'projector',
  'near kitchen',
];

const availableEquipment = [
  'Monitor',
  'HDMI',
  'webcam',
  'docking station',
  'conference system',
  'keyboard',
  'TV',
  'wireless presentation',
];

export function FilterPanel({ filters, setFilters, applyFilters }: FilterPanelProps) {
  const { places, isLoading: placesLoading } = usePlaces();

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature),
    }));
  };

  const handleEquipmentChange = (item: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, item]
        : prev.equipment.filter(e => e !== item),
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: null,
      spaceType: null,
      capacity: 0,
      features: [],
      equipment: [],
      isPrivate: null,
      isBookable: true,
      status: null,
      searchQuery: '',
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="h-8 text-xs"
          >
            Reset
          </Button>
        </div>
        
        {/* Search input */}
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search spaces..."
            className="pl-8"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
          {filters.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Location filter */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={filters.location || 'all-locations'}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              location: value === 'all-locations' ? null : value 
            }))}
            disabled={placesLoading}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder={placesLoading ? "Loading locations..." : "All locations"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All locations</SelectItem>
              {places.map((place) => (
                <SelectItem key={place} value={place}>
                  {place}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Space type filter */}
        <div className="space-y-2">
          <Label htmlFor="spaceType">Space Type</Label>
          <Select
            value={filters.spaceType || 'all-types'}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              spaceType: value === 'all-types' ? null : value 
            }))}
          >
            <SelectTrigger id="spaceType">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All types</SelectItem>
              <SelectItem value="desk">Desk</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Capacity filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="capacity">Min Capacity</Label>
            <span className="text-sm text-gray-500">{filters.capacity}</span>
          </div>
          <Slider
            id="capacity"
            min={0}
            max={10}
            step={1}
            value={[filters.capacity]}
            onValueChange={(value) => setFilters(prev => ({ ...prev, capacity: value[0] }))}
            className="py-4"
          />
        </div>
        
        {/* Status filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || 'all-statuses'}
            onValueChange={(value) => setFilters(prev => ({ 
              ...prev, 
              status: value === 'all-statuses' ? null : value 
            }))}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">Any status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="maintenance">Under Maintenance</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Privacy filter */}
        <div className="space-y-2">
          <Label htmlFor="privacy">Privacy</Label>
          <Select
            value={filters.isPrivate === null ? 'all-privacy' : filters.isPrivate ? 'private' : 'shared'}
            onValueChange={(value) => {
              let isPrivate = null;
              if (value === 'private') isPrivate = true;
              else if (value === 'shared') isPrivate = false;
              setFilters(prev => ({ ...prev, isPrivate }));
            }}
          >
            <SelectTrigger id="privacy">
              <SelectValue placeholder="Any privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-privacy">Any privacy</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Bookable filter */}
        <div className="flex items-center space-x-2">
          <Switch
            id="bookable"
            checked={filters.isBookable}
            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isBookable: checked }))}
          />
          <Label htmlFor="bookable">Bookable only</Label>
        </div>
        
        {/* Features filter */}
        <div className="space-y-2">
          <Label className="block mb-2">Features</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked === true)}
                />
                <Label htmlFor={`feature-${feature}`} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Equipment filter */}
        <div className="space-y-2">
          <Label className="block mb-2">Equipment</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableEquipment.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`equipment-${item}`}
                  checked={filters.equipment.includes(item)}
                  onCheckedChange={(checked) => handleEquipmentChange(item, checked === true)}
                />
                <Label htmlFor={`equipment-${item}`} className="text-sm">
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
