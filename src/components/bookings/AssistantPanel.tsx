import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { AutoBookButton } from './AutoBookButton';
import { Card } from '@/components/ui/card';

// Types for messages
type MessageType = 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  status?: 'thinking' | 'typing' | 'complete';
  suggestion?: {
    spaceId: string;
    spaceName: string;
    time: string;
  };
}

interface AssistantPanelProps {
  isFloating?: boolean;
}

export function AssistantPanel({ isFloating = false }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      text: 'Hello! I can help you find the perfect workspace. Try asking me "Where should I work today?" or "I need a quiet space for a meeting tomorrow."',
      status: 'complete'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate a mock response based on user input
  const generateResponse = (userInput: string): Message => {
    // Simulated focus events data
    const recentFocusEvents = [
      { tag: "deep work", start_time: "10:00", duration_minutes: 90 },
      { tag: "coding", start_time: "10:30", duration_minutes: 120 },
      { tag: "design", start_time: "11:00", duration_minutes: 60 }
    ];
    
    // Mock spaces data
    const availableSpaces = [
      { id: 'space-a3', name: 'Room A3', type: 'quiet' },
      { id: 'space-b2', name: 'Room B2', type: 'collaborative' },
      { id: 'space-c1', name: 'Pod C1', type: 'focus' }
    ];
    
    // Simple keyword matching for demo purposes
    const input = userInput.toLowerCase();
    let response: Message;
    
    if (input.includes('work today') || input.includes('where') || input.includes('recommend')) {
      const space = availableSpaces[0]; // Room A3
      response = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `Based on your past deep work sessions, ${space.name} at 10:00 AM suits your rhythm. It's usually quiet at this time and matches your productivity pattern.`,
        status: 'complete',
        suggestion: {
          spaceId: space.id,
          spaceName: space.name,
          time: '10:00 AM'
        }
      };
    } else if (input.includes('meeting') || input.includes('team') || input.includes('collaborate')) {
      const space = availableSpaces[1]; // Room B2
      response = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `For your meeting, I'd suggest ${space.name} at 2:00 PM. It has video conferencing equipment and comfortable seating for your team.`,
        status: 'complete',
        suggestion: {
          spaceId: space.id,
          spaceName: space.name,
          time: '2:00 PM'
        }
      };
    } else if (input.includes('focus') || input.includes('quiet') || input.includes('concentrate')) {
      const space = availableSpaces[2]; // Pod C1
      response = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `For focused work, ${space.name} would be perfect at 11:00 AM. It's a dedicated focus pod with noise cancellation.`,
        status: 'complete',
        suggestion: {
          spaceId: space.id,
          spaceName: space.name,
          time: '11:00 AM'
        }
      };
    } else {
      response = {
        id: Date.now().toString(),
        type: 'assistant',
        text: "I'm not sure I understand. Could you try asking about where you should work today, or if you need a space for a specific purpose like a meeting or focused work?",
        status: 'complete'
      };
    }
    
    return response;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Add thinking indicator
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      type: 'assistant',
      text: '',
      status: 'thinking'
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Remove thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      // Add typing indicator
      const typingMessage: Message = {
        id: `typing-${Date.now()}`,
        type: 'assistant',
        text: '',
        status: 'typing'
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // Simulate typing delay
      setTimeout(() => {
        // Remove typing message
        setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
        
        // Add final response
        const response = generateResponse(inputValue);
        setMessages(prev => [...prev, response]);
        setIsProcessing(false);
      }, 1500);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If floating, don't render the Card wrapper as it's already wrapped by FloatingAssistant
  const content = (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble 
            key={message.id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Show auto-book button if the last message has a suggestion */}
      {messages.length > 0 && 
        messages[messages.length - 1].type === 'assistant' && 
        messages[messages.length - 1].suggestion && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <AutoBookButton 
            suggestion={messages[messages.length - 1].suggestion!}
          />
        </div>
      )}
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            placeholder="Ask the assistant..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  // If floating, return content directly, otherwise wrap in Card
  return isFloating ? (
    <div className="flex flex-col h-full">{content}</div>
  ) : (
    <Card className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {content}
    </Card>
  );
} 