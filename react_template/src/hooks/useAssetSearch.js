import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

export function useAssetSearch(initialQuery = '', initialFilters = {}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({ ...initialFilters });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchParams = {
          query,
          ...filters
        };
        
        const results = await StorageService.getAssets(searchParams);
        setAssets(results);
      } catch (err) {
        console.error('Error searching assets:', err);
        setError(err.message || 'Failed to load assets');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      fetchAssets();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

  const resetFilters = () => {
    setFilters({});
    setQuery('');
  };

  return {
    assets,
    loading,
    error,
    query,
    filters,
    setQuery,
    setFilters,
    resetFilters
  };
}