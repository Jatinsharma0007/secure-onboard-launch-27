
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Calendar, MapPin, Clock, User } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { Card } from '@/components/ui/card';
import { useAIAssistant, AvailableSpace, BookingRequest } from '@/hooks/useAIAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  status?: 'thinking' | 'typing' | 'complete';
  spaces?: AvailableSpace[];
  bookingContext?: {
    request: BookingRequest;
    selectedSpace?: AvailableSpace;
  };
}

interface EnhancedAssistantPanelProps {
  isFloating?: boolean;
}

export function EnhancedAssistantPanel({ isFloating = false }: EnhancedAssistantPanelProps) {
  const { user, profile } = useAuth();
  const { getAvailableSpaces, createBooking, getUserBookings, getSiteInformation, isProcessing } = useAIAssistant();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationContext, setConversationContext] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with personalized greeting
  useEffect(() => {
    const userName = profile?.full_name || user?.email?.split('@')[0] || 'there';
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      text: user 
        ? `Hello ${userName}! 👋 I'm your AI workspace coach. I can help you with:

• **Book coworking spaces** - Just tell me the location you prefer
• **Check available rooms** - I'll show you what's free
• **Schedule specific times** - Let me know your preferred hours
• **Review your bookings** - See all your past and upcoming reservations

What would you like to do today?`
        : 'Hello! I can help you explore our workspace options and provide information about our facilities. Please sign in to make bookings.',
      status: 'complete'
    };
    setMessages([welcomeMessage]);
  }, [user, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseBookingIntent = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Specific booking location
    if (lowerInput.includes('book') && (lowerInput.includes(' in ') || lowerInput.includes('coworking'))) {
      const locationMatch = lowerInput.match(/(?:in|at)\s+([^,\n]+)/);
      return { 
        type: 'book-location', 
        input, 
        location: locationMatch ? locationMatch[1].trim() : null 
      };
    }
    
    // Available rooms query
    if (lowerInput.includes('available') || lowerInput.includes('rooms') || lowerInput.includes('spaces')) {
      return { type: 'available-rooms', input };
    }
    
    // Time-based booking
    if (lowerInput.includes('book') && (lowerInput.includes('from') || lowerInput.includes('to') || lowerInput.includes('at'))) {
      const timePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/gi;
      const times = input.match(timePattern);
      return { 
        type: 'book-time', 
        input, 
        times: times || [] 
      };
    }
    
    // Previous bookings
    if (lowerInput.includes('previous') || lowerInput.includes('past') || lowerInput.includes('my booking')) {
      return { type: 'my-bookings', input };
    }
    
    // General booking
    if (lowerInput.includes('book') || lowerInput.includes('reserve')) {
      return { type: 'booking', input };
    }
    
    // Site information
    if (lowerInput.includes('about') || lowerInput.includes('facilities') || lowerInput.includes('help')) {
      return { type: 'information', input };
    }
    
    return { type: 'general', input };
  };

  const extractTimeDetails = (input: string) => {
    const timePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/gi;
    const times = input.match(timePattern);
    
    if (times && times.length >= 2) {
      return {
        startTime: times[0],
        endTime: times[1]
      };
    }
    
    return null;
  };

  const generateResponse = async (userInput: string, intent: any): Promise<Message> => {
    const messageId = Date.now().toString();
    
    try {
      switch (intent.type) {
        case 'book-location':
          if (!user) {
            return {
              id: messageId,
              type: 'assistant',
              text: 'Please sign in first to book coworking spaces. Once you\'re logged in, I\'ll help you find the perfect space!',
              status: 'complete'
            };
          }
          
          const location = intent.location || 'any location';
          const today = new Date().toISOString().split('T')[0];
          const availableSpaces = await getAvailableSpaces(today, '09:00', '18:00');
          
          const locationSpaces = intent.location 
            ? availableSpaces.filter(space => 
                space.location.toLowerCase().includes(intent.location.toLowerCase())
              )
            : availableSpaces;
          
          if (locationSpaces.length === 0) {
            return {
              id: messageId,
              type: 'assistant',
              text: `I couldn't find any available coworking spaces in ${location} for today. Would you like to:
              
• Try a different location?
• Check availability for another date?
• See all available spaces?`,
              status: 'complete'
            };
          }
          
          return {
            id: messageId,
            type: 'assistant',
            text: `Great! I found ${locationSpaces.length} available coworking space${locationSpaces.length > 1 ? 's' : ''} in ${location}:`,
            status: 'complete',
            spaces: locationSpaces,
            bookingContext: {
              request: {
                date: today,
                startTime: '09:00',
                endTime: '18:00'
              }
            }
          };
          
        case 'available-rooms':
          const todaySpaces = await getAvailableSpaces(
            new Date().toISOString().split('T')[0], 
            '09:00', 
            '18:00'
          );
          
          const rooms = todaySpaces.filter(space => space.space_type === 'room');
          const desks = todaySpaces.filter(space => space.space_type === 'desk');
          
          return {
            id: messageId,
            type: 'assistant',
            text: `Here's what's available today:

📍 **Meeting Rooms**: ${rooms.length} available
🖥️ **Desk Spaces**: ${desks.length} available

Which type would you prefer to book?`,
            status: 'complete',
            spaces: todaySpaces.slice(0, 6) // Show top 6
          };
          
        case 'book-time':
          if (!user) {
            return {
              id: messageId,
              type: 'assistant',
              text: 'Please sign in to book specific time slots. I\'ll help you find the perfect time once you\'re logged in!',
              status: 'complete'
            };
          }
          
          const timeDetails = extractTimeDetails(userInput);
          if (!timeDetails) {
            return {
              id: messageId,
              type: 'assistant',
              text: 'I need specific times to help you book. Please tell me:\n\n• What time would you like to start? (e.g., "9:00 AM")\n• What time would you like to end? (e.g., "5:00 PM")\n• Which date? (or "today" for today)',
              status: 'complete'
            };
          }
          
          const bookingDate = new Date().toISOString().split('T')[0];
          const timeSlotSpaces = await getAvailableSpaces(
            bookingDate, 
            timeDetails.startTime, 
            timeDetails.endTime
          );
          
          if (timeSlotSpaces.length === 0) {
            return {
              id: messageId,
              type: 'assistant',
              text: `No spaces are available from ${timeDetails.startTime} to ${timeDetails.endTime} today. Would you like to try:

• Different times?
• Tomorrow instead?
• See what's available now?`,
              status: 'complete'
            };
          }
          
          return {
            id: messageId,
            type: 'assistant',
            text: `Perfect! I found ${timeSlotSpaces.length} space${timeSlotSpaces.length > 1 ? 's' : ''} available from ${timeDetails.startTime} to ${timeDetails.endTime}:`,
            status: 'complete',
            spaces: timeSlotSpaces,
            bookingContext: {
              request: {
                date: bookingDate,
                startTime: timeDetails.startTime,
                endTime: timeDetails.endTime
              }
            }
          };
          
        case 'my-bookings':
          if (!user) {
            return {
              id: messageId,
              type: 'assistant',
              text: 'Please sign in to view your booking history.',
              status: 'complete'
            };
          }
          
          const userBookings = await getUserBookings();
          
          if (userBookings.length === 0) {
            return {
              id: messageId,
              type: 'assistant',
              text: `You don't have any previous bookings yet. Would you like to:

• Book your first space?
• Explore available options?
• Get information about our facilities?`,
              status: 'complete'
            };
          }
          
          const bookingsList = userBookings.map((booking: any, index: number) => 
            `${index + 1}. **${booking.spaces.name}** on ${new Date(booking.start_time).toLocaleDateString()} at ${new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
          ).join('\n');
          
          return {
            id: messageId,
            type: 'assistant',
            text: `Here are your previous bookings:\n\n${bookingsList}\n\nWould you like to book another space?`,
            status: 'complete'
          };
          
        case 'information':
          const siteInfo = await getSiteInformation();
          
          return {
            id: messageId,
            type: 'assistant',
            text: `Here's what we offer:

🏢 **${siteInfo.totalSpaces}** bookable spaces across ${siteInfo.locations.length} location${siteInfo.locations.length !== 1 ? 's' : ''}
📅 **${siteInfo.totalBookings}** total bookings made
📍 **Locations**: ${siteInfo.locations.map(loc => loc.name).join(', ')}

I can help you:
• Book a specific space
• Check availability 
• Find spaces by location
• Schedule time slots
• Review your bookings

What would you like to do?`,
            status: 'complete'
          };
          
        default:
          return {
            id: messageId,
            type: 'assistant',
            text: `I can help you with booking workspaces! Try asking:

💼 "I want to book coworking spaces in Koramangala"
🏢 "Show me available rooms"
⏰ "I want to book from 9 AM to 5 PM"
📋 "Show me my previous bookings"

What would you like to do?`,
            status: 'complete'
          };
      }
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        id: messageId,
        type: 'assistant',
        text: 'I encountered an error. Please try again or contact support if the issue persists.',
        status: 'complete'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    
    // Add thinking indicator
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      type: 'assistant',
      text: '',
      status: 'thinking'
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    // Parse intent and generate response
    const intent = parseBookingIntent(currentInput);
    const response = await generateResponse(currentInput, intent);
    
    // Remove thinking message and add response
    setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id).concat(response));
  };

  const handleSpaceBooking = async (space: AvailableSpace, bookingRequest: BookingRequest) => {
    if (!user) {
      toast.error('Please sign in to book a space');
      return;
    }

    try {
      await createBooking(space.id, bookingRequest);
      
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        text: `🎉 Perfect! I've successfully booked **${space.name}** for you on ${bookingRequest.date} from ${bookingRequest.startTime} to ${bookingRequest.endTime}.

You'll receive a confirmation email shortly. Is there anything else I can help you with?`,
        status: 'complete'
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const content = (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <ChatBubble message={message} />
            
            {/* Render available spaces */}
            {message.spaces && message.spaces.length > 0 && (
              <div className="mt-4 space-y-2">
                {message.spaces.map((space) => (
                  <Card key={space.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{space.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {space.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {space.capacity} people
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {space.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {message.bookingContext && (
                        <Button
                          onClick={() => handleSpaceBooking(space, message.bookingContext!.request)}
                          disabled={isProcessing}
                          className="ml-4"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            placeholder="Try: 'Book coworking spaces in Koramangala' or 'Show available rooms'"
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

  return isFloating ? (
    <div className="flex flex-col h-full">{content}</div>
  ) : (
    <Card className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {content}
    </Card>
  );
}
