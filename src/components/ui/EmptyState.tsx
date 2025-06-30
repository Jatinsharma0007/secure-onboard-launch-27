import React from 'react';
import { Search, AlertCircle, Info } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'alert' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon = 'info', action }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search className="h-12 w-12 text-gray-300" />;
      case 'alert':
        return <AlertCircle className="h-12 w-12 text-gray-300" />;
      case 'info':
      default:
        return <Info className="h-12 w-12 text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
