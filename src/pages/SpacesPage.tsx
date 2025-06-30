import React from 'react';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/spaces/FilterPanel';
import { SpacesGrid } from '@/components/spaces/SpacesGrid';
import { useSpaces } from '@/hooks/useSpaces';

export default function SpacesPage() {
  const { 
    spaces, 
    isLoading, 
    error, 
    filters, 
    setFilters,
    applyFilters
  } = useSpaces();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Spaces</h1>
          <p className="text-gray-600 mt-2">Browse and book available desks and rooms</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              applyFilters={applyFilters}
            />
          </div>
          <div className="lg:col-span-3">
            <SpacesGrid 
              spaces={spaces} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </main>
    </div>
  );
} 