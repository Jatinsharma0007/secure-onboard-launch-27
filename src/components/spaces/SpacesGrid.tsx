import React from 'react';
import { Space } from '@/hooks/useSpaces';
import { SpaceCard } from './SpaceCard';
import { SpaceDetailsModal } from './SpaceDetailsModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SpacesGridProps {
  spaces: Space[];
  isLoading: boolean;
  error: string | null;
}

export function SpacesGrid({ spaces, isLoading, error }: SpacesGridProps) {
  const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCardClick = (space: Space) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load spaces"
        description={error}
        action={{ label: 'Try again', onClick: () => window.location.reload() }}
      />
    );
  }

  if (spaces.length === 0) {
    return (
      <EmptyState
        title="No spaces found"
        description="Try adjusting your filters to find more spaces."
        icon="search"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {spaces.map((space) => (
          <SpaceCard 
            key={space.id} 
            space={space} 
            onClick={() => handleCardClick(space)}
          />
        ))}
      </div>

      {selectedSpace && (
        <SpaceDetailsModal
          space={selectedSpace}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
} 