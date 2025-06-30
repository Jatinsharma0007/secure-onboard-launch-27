
import React from 'react';
import { Header } from '@/components/Header';
import { EnhancedAssistantPanel } from '@/components/bookings/EnhancedAssistantPanel';

export default function AICoachPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Workspace Coach</h1>
          <p className="text-gray-600">
            Your intelligent booking assistant. I can help you book spaces, check availability, 
            manage your reservations, and answer questions about our facilities.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <EnhancedAssistantPanel />
        </div>
      </div>
    </div>
  );
}
