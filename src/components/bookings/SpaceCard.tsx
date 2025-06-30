
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SpaceCardProps {
  type: 'Desk' | 'Room';
  name: string;
  availability: string;
  status: 'available' | 'occupied' | 'soon';
  onBook?: () => void;
}

export function SpaceCard({ type, name, availability, status, onBook }: SpaceCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return {
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
          label: 'Available'
        };
      case 'soon':
        return {
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          label: 'Soon'
        };
      case 'occupied':
        return {
          className: 'bg-red-100 text-red-800 hover:bg-red-100',
          label: 'Occupied'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-gray-500 uppercase font-medium">{type}</div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
        </div>
        <Badge className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 mb-4">{availability}</p>

      <Button
        size="sm"
        className="w-full"
        disabled={status === 'occupied'}
        onClick={onBook}
      >
        {status === 'occupied' ? 'Unavailable' : 'Book'}
      </Button>
    </div>
  );
}
