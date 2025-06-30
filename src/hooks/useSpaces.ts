
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Space {
  id: string;
  name: string;
  space_type: 'desk' | 'room';
  location: string;
  places?: string; // Add places property
  capacity: number;
  features: string[];
  equipment: string[];
  is_private: boolean;
  is_bookable: boolean;
  status: 'available' | 'maintenance' | 'reserved';
  usage_score: number;
  last_used_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpaceFilters {
  location: string | null;
  spaceType: string | null;
  capacity: number;
  features: string[];
  equipment: string[];
  isPrivate: boolean | null;
  isBookable: boolean;
  status: string | null;
  searchQuery: string;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<SpaceFilters>({
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

  // Fetch spaces from Supabase
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching spaces from Supabase...');
      
      // Query Supabase for spaces
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('is_bookable', true);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched spaces:', data);
      
      // Transform data to match our interface
      const spacesData = data?.map(item => ({
        id: item.id,
        name: item.name,
        space_type: (item.space_type === 'desk' || item.space_type === 'room') 
          ? (item.space_type as 'desk' | 'room')
          : ('desk' as 'desk' | 'room'),
        location: item.location || 'Unknown Location',
        places: item.places, // Map places from database
        capacity: item.capacity || 1,
        features: Array.isArray(item.features) ? item.features : [],
        equipment: Array.isArray(item.equipment) ? item.equipment : [],
        is_private: Boolean(item.is_private),
        is_bookable: Boolean(item.is_bookable),
        status: (item.status === 'available' || item.status === 'maintenance' || item.status === 'reserved')
          ? (item.status as 'available' | 'maintenance' | 'reserved')
          : ('available' as 'available' | 'maintenance' | 'reserved'),
        usage_score: item.usage_score || 0,
        last_used_at: item.last_used_at || new Date().toISOString(),
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setSpaces(spacesData);
      setFilteredSpaces(spacesData);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Failed to load spaces. Please try again later.');
      // Don't fallback to mock data - show the error instead
      setSpaces([]);
      setFilteredSpaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters to spaces
  const applyFilters = useCallback(() => {
    if (spaces.length === 0) return;
    
    let result = [...spaces];
    
    // Filter by location
    if (filters.location) {
      result = result.filter(space => 
        space.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Filter by space type
    if (filters.spaceType) {
      result = result.filter(space => 
        space.space_type === filters.spaceType
      );
    }
    
    // Filter by capacity
    if (filters.capacity > 0) {
      result = result.filter(space => 
        space.capacity >= filters.capacity
      );
    }
    
    // Filter by features
    if (filters.features.length > 0) {
      result = result.filter(space => 
        filters.features.every(feature => 
          space.features.includes(feature)
        )
      );
    }
    
    // Filter by equipment
    if (filters.equipment.length > 0) {
      result = result.filter(space => 
        filters.equipment.every(item => 
          space.equipment.includes(item)
        )
      );
    }
    
    // Filter by privacy
    if (filters.isPrivate !== null) {
      result = result.filter(space => 
        space.is_private === filters.isPrivate
      );
    }
    
    // Filter by bookable status
    if (filters.isBookable) {
      result = result.filter(space => 
        space.is_bookable === true
      );
    }
    
    // Filter by status
    if (filters.status) {
      result = result.filter(space => 
        space.status === filters.status
      );
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(space => 
        space.name.toLowerCase().includes(query) ||
        space.location.toLowerCase().includes(query) ||
        space.features.some(feature => feature.toLowerCase().includes(query)) ||
        space.equipment.some(item => item.toLowerCase().includes(query))
      );
    }
    
    setFilteredSpaces(result);
  }, [spaces, filters]);

  // Initial fetch
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);
  
  // Apply filters when filters or spaces change
  useEffect(() => {
    applyFilters();
  }, [filters, spaces, applyFilters]);

  return {
    spaces: filteredSpaces,
    isLoading,
    error,
    filters,
    setFilters,
    applyFilters,
    refreshSpaces: fetchSpaces,
    fetchSpaces
  };
}
