import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-lg border border-red-100">
      <div className="mb-4">
        <AlertTriangle className="h-12 w-12 text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
      <p className="text-red-600 mb-6 max-w-md">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} variant="destructive">
          {action.label}
        </Button>
      )}
    </div>
  );
}
