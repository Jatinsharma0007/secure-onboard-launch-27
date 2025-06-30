
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  label: string;
  icon: string;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

export function QuickActionsPanel({ actions, onActionClick }: QuickActionsPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-20 flex-col space-y-2 hover:bg-gray-50 border-gray-200"
          onClick={() => onActionClick?.(action)}
        >
          <div className="text-2xl">{action.icon}</div>
          <span className="text-sm font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
