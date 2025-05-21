// src/context/AssetContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { StorageService } from '../services/StorageService';

// Create context
const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [featuredAssets, setFeaturedAssets] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch featured assets
  const fetchFeaturedAssets = async () => {
    try {
      setLoading(true);
      const assets = await StorageService.getAssets({ sortBy: 'popular', limit: 6 });
      setFeaturedAssets(assets);
      return assets;
    } catch (err) {
      console.error('Error fetching featured assets:', err);
      setError('Failed to load featured assets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch asset by ID
  const fetchAsset = async (assetId) => {
    try {
      setLoading(true);
      const asset = await StorageService.getAsset(assetId);
      
      // Add to recently viewed if not already there
      if (asset) {
        setRecentlyViewed(prev => {
          const filtered = prev.filter(item => item.id !== asset.id);
          return [asset, ...filtered].slice(0, 5); // Keep only 5 most recent
        });
      }
      
      return asset;
    } catch (err) {
      console.error(`Error fetching asset ${assetId}:`, err);
      setError(`Failed to load asset: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Search for assets
  const searchAssets = async (query, filters = {}) => {
    try {
      setLoading(true);
      const assets = await StorageService.getAssets({ query, ...filters });
      return assets;
    } catch (err) {
      console.error('Error searching assets:', err);
      setError('Search failed. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Visual search using AI Wand
  const aiWandSearch = async (description) => {
    try {
      setLoading(true);
      const results = await StorageService.visualSearch(description);
      return results;
    } catch (err) {
      console.error('AI Wand search error:', err);
      setError('AI search failed. Please try a different description.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AssetContext.Provider
      value={{
        featuredAssets,
        recentlyViewed,
        loading,
        error,
        fetchFeaturedAssets,
        fetchAsset,
        searchAssets,
        aiWandSearch,
        clearError
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

// Custom hook to use the asset context
export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssetContext must be used within an AssetProvider');
  }
  return context;
};