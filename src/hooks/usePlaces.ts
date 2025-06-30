
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePlaces() {
  const [places, setPlaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        console.log('Fetching places from Supabase...');
        
        const { data, error } = await supabase
          .from('spaces')
          .select('places')
          .not('places', 'is', null);

        if (error) {
          console.error('Error fetching places:', error);
          throw error;
        }

        // Extract unique places from the data
        const uniquePlaces = [...new Set(
          data
            ?.map(item => item.places)
            .filter(place => place && place.trim() !== '')
        )].sort();

        console.log('Fetched unique places:', uniquePlaces);
        setPlaces(uniquePlaces);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Failed to load places');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return { places, isLoading, error };
}
