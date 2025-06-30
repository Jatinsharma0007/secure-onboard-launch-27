
import React from 'react';
import { Monitor, Users, CheckCircle } from 'lucide-react';

interface Space {
  id: string;
  name: string;
  type: 'desk' | 'room';
  zone: string;
  available: boolean;
  price: string;
}

interface SpaceCardSelectableProps {
  space: Space;
  isSelected: boolean;
  onSelect: (spaceId: string) => void;
}

export function SpaceCardSelectable({ space, isSelected, onSelect }: SpaceCardSelectableProps) {
  const Icon = space.type === 'desk' ? Monitor : Users;

  return (
    <div
      onClick={() => space.available && onSelect(space.id)}
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
        space.available
          ? isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${
          space.available ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <Icon className={`h-5 w-5 ${
            space.available ? 'text-blue-600' : 'text-gray-400'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {space.name}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            {space.zone}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {space.price}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              space.available
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {space.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
