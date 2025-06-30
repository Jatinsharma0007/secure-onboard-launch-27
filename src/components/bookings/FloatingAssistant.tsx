
import React, { useState } from 'react';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EnhancedAssistantPanel } from './EnhancedAssistantPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleOpen = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const closeAssistant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className={`
          flex flex-col shadow-lg border rounded-lg overflow-hidden transition-all duration-300
          ${isMinimized 
            ? 'w-[300px] h-14' 
            : 'w-[400px] sm:w-[450px] h-[650px]'
          }
        `}>
          {/* Header */}
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex items-center justify-between cursor-pointer"
            onClick={isMinimized ? toggleOpen : undefined}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-avatar.svg" />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">AI Workspace Coach</span>
                <div className="text-xs opacity-90">Booking & Information Assistant</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={closeAssistant}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <EnhancedAssistantPanel isFloating={true} />
            </div>
          )}
        </Card>
      ) : (
        <Button 
          onClick={toggleOpen}
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Bot className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}
