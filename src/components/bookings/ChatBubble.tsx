import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  status?: 'thinking' | 'typing' | 'complete';
  suggestion?: {
    spaceId: string;
    spaceName: string;
    time: string;
  };
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.type === 'user';
  
  // Render thinking state (animated dots)
  if (message.status === 'thinking') {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/ai-avatar.svg" />
          <AvatarFallback className="bg-blue-100 text-blue-800">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center h-8">
          <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render typing state (animated typing indicator)
  if (message.status === 'typing') {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/ai-avatar.svg" />
          <AvatarFallback className="bg-blue-100 text-blue-800">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 max-w-[80%]">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 mt-1">
        {isUser ? (
          <>
            <AvatarImage src="/user-avatar.svg" />
            <AvatarFallback className="bg-gray-100 text-gray-800">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/ai-avatar.svg" />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      
      {/* Message bubble */}
      <div 
        className={`
          py-2 px-3 rounded-lg max-w-[80%]
          ${isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-800'
          }
        `}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
} 