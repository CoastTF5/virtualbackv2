import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import AssetGrid from '../components/asset/AssetGrid';
import AIWandSearch from '../components/search/AIWandSearch';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useAssetContext } from '../context/AssetContext';
import { useAssetSearch } from '../hooks/useAssetSearch';

function LibraryView() {
  const [searchParams] = useSearchParams();
  const [showAIWand, setShowAIWand] = useState(false);
  
  // Extract initial query params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialFilters = { category: initialCategory };
  
  // Use the custom hook for asset searching
  const { 
    assets, 
    loading, 
    error, 
    filters, 
    setFilters, 
    resetFilters 
  } = useAssetSearch(initialQuery, initialFilters);
  
  // Get featured assets from context if no search query
  const { featuredAssets, fetchFeaturedAssets } = useAssetContext();
  const [showingFeatured, setShowingFeatured] = useState(!initialQuery && !initialCategory);
  
  // Load featured assets when component mounts if no search query
  useEffect(() => {
    if (showingFeatured) {
      fetchFeaturedAssets();
    }
  }, [showingFeatured, fetchFeaturedAssets]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowingFeatured(false);
  };
  
  const handleReset = () => {
    resetFilters();
    setShowingFeatured(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {showingFeatured ? 'Featured Assets' : 'Browse Assets'}
        </h1>
        <p className="mt-2 text-gray-600">
          {showingFeatured
            ? 'Explore our collection of high-quality 3D assets for your production.'
            : `Showing ${assets.length} results ${filters.category ? `in ${filters.category}` : ''}`}
        </p>
      </div>

      {/* Main content area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters - moved to left */}
        <div className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0 order-2 md:order-1">
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleReset} 
          />
          
          {/* AI Wand button */}
          <div className="mt-6">
            <Button 
              variant="secondary" 
              className="w-full flex items-center justify-center"
              onClick={() => setShowAIWand(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4V2m0 14v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h0m2.8-2.8L19 5M3 21l9-9M12.2 6.2L11 5" />
              </svg>
              AI Wand Search
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 order-1 md:order-2">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16">
              <Loading text="Loading assets..." />
            </div>
          ) : assets.length > 0 ? (
            <AssetGrid assets={assets} />
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No assets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-6">
                <Button onClick={handleReset}>
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Wand modal */}
      {showAIWand && <AIWandSearch onClose={() => setShowAIWand(false)} />}
    </div>
  );
}

export default LibraryView;