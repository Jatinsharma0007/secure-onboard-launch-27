import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Define badge variants based on status
  switch (status) {
    case 'available':
      return (
        <Badge 
          variant="default" 
          className={`bg-green-500 hover:bg-green-600 flex items-center gap-1 ${className}`}
        >
          <CheckCircle className="h-3 w-3" />
          Available
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge 
          variant="destructive"
          className={`flex items-center gap-1 ${className}`}
        >
          <AlertCircle className="h-3 w-3" />
          Maintenance
        </Badge>
      );
    case 'reserved':
      return (
        <Badge 
          variant="secondary"
          className={`flex items-center gap-1 ${className}`}
        >
          <Clock className="h-3 w-3" />
          Reserved
        </Badge>
      );
    default:
      return (
        <Badge 
          variant="outline"
          className={`flex items-center gap-1 ${className}`}
        >
          {status}
        </Badge>
      );
  }
}
