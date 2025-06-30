
import React from 'react';
import { Clock, MapPin, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Suggestion {
  title: string;
  icon: string;
  message: string;
  actionText: string;
}

interface SuggestionBannerProps {
  suggestions: Suggestion[];
  onSuggestionClick?: (suggestion: Suggestion) => void;
}

export function SuggestionBanner({ suggestions, onSuggestionClick }: SuggestionBannerProps) {
  const getIconComponent = (icon: string) => {
    switch (icon) {
      case '🧠':
        return <Brain className="h-5 w-5 text-blue-600" />;
      case '📍':
        return <MapPin className="h-5 w-5 text-green-600" />;
      case '🧘':
        return <Clock className="h-5 w-5 text-purple-600" />;
      default:
        return <div className="text-lg">{icon}</div>;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIconComponent(suggestion.icon)}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                {suggestion.title}
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                {suggestion.message}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion.actionText}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
