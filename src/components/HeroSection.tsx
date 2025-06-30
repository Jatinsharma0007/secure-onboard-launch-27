
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Brain, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Book smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Focus deeper.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your workspace experience with AI-powered booking, 
            personalized coaching, and spaces designed for peak productivity.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link to="/register">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Booking</h3>
              <p className="text-gray-600 text-sm">
                AI-powered scheduling that learns your preferences and optimizes your workspace time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Coach</h3>
              <p className="text-gray-600 text-sm">
                Personal productivity coaching tailored to your work style and goals.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Spaces</h3>
              <p className="text-gray-600 text-sm">
                Access to thoughtfully designed workspaces that inspire creativity and focus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
