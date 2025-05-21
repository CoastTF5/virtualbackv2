import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import DateRangeSelector from '../components/analytics/DateRangeSelector';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { AnalyticsService } from '../services/AnalyticsService';
import { useAuth } from '../context/AuthContext';

function AnalyticsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasPermission } = useAuth();
  
  // Analytics state
  const [globalData, setGlobalData] = useState(null);
  const [assetData, setAssetData] = useState(null);
  const [popularAssets, setPopularAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and params
  const [selectedAsset, setSelectedAsset] = useState(searchParams.get('assetId') || '');
  const [dateRange, setDateRange] = useState({
    start: searchParams.get('dateStart') || null,
    end: searchParams.get('dateEnd') || null
  });
  
  // Check permissions
  useEffect(() => {
    if (!hasPermission('analytics')) {
      setError('You do not have permission to access analytics');
    }
  }, [hasPermission]);
  
  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (error) return;
      
      try {
        setLoading(true);
        
        // Load global analytics
        const globalAnalytics = await AnalyticsService.getGlobalAnalytics(dateRange);
        setGlobalData(globalAnalytics);
        
        // Load popular assets
        const popular = await AnalyticsService.getPopularAssets(dateRange);
        setPopularAssets(popular);
        
        // Load specific asset data if selected
        if (selectedAsset) {
          const assetAnalytics = await AnalyticsService.getPackAnalytics(selectedAsset, dateRange);
          setAssetData(assetAnalytics);
        } else {
          setAssetData(null);
        }
        
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [selectedAsset, dateRange, error]);
  
  // Handle asset selection change
  const handleAssetChange = (e) => {
    const assetId = e.target.value;
    setSelectedAsset(assetId);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (assetId) {
      newParams.set('assetId', assetId);
    } else {
      newParams.delete('assetId');
    }
    setSearchParams(newParams);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (range.start) {
      newParams.set('dateStart', range.start);
    } else {
      newParams.delete('dateStart');
    }
    
    if (range.end) {
      newParams.set('dateEnd', range.end);
    } else {
      newParams.delete('dateEnd');
    }
    
    setSearchParams(newParams);
  };
  
  if (loading && !globalData) {
    return (
      <div className="py-12 flex justify-center">
        <Loading text="Loading analytics data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600">Track usage and popularity of assets</p>
        </div>
        
        {/* Date range picker */}
        <div className="mt-4 md:mt-0">
          <DateRangeSelector 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange} 
          />
        </div>
      </div>
      
      {/* Filter section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <label htmlFor="asset-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Asset Package
            </label>
            <select
              id="asset-select"
              value={selectedAsset}
              onChange={handleAssetChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Assets</option>
              {globalData?.availableAssets?.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button 
              variant="secondary"
              onClick={() => {
                setSelectedAsset('');
                setDateRange({ start: null, end: null });
                setSearchParams({});
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="space-y-8">
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-1">Total Views</h2>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-gray-900">
                {selectedAsset ? assetData?.totalViews : globalData?.totalViews}
              </p>
              <span className={`ml-2 text-sm ${
                (selectedAsset ? assetData?.viewsChange : globalData?.viewsChange) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(selectedAsset ? assetData?.viewsChange : globalData?.viewsChange) > 0 ? '+' : ''}
                {selectedAsset ? assetData?.viewsChange : globalData?.viewsChange}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-1">Total Downloads</h2>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-gray-900">
                {selectedAsset ? assetData?.totalDownloads : globalData?.totalDownloads}
              </p>
              <span className={`ml-2 text-sm ${
                (selectedAsset ? assetData?.downloadsChange : globalData?.downloadsChange) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(selectedAsset ? assetData?.downloadsChange : globalData?.downloadsChange) > 0 ? '+' : ''}
                {selectedAsset ? assetData?.downloadsChange : globalData?.downloadsChange}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-1">Favorites</h2>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-gray-900">
                {selectedAsset ? assetData?.totalFavorites : globalData?.totalFavorites}
              </p>
              <span className={`ml-2 text-sm ${
                (selectedAsset ? assetData?.favoritesChange : globalData?.favoritesChange) > 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {(selectedAsset ? assetData?.favoritesChange : globalData?.favoritesChange) > 0 ? '+' : ''}
                {selectedAsset ? assetData?.favoritesChange : globalData?.favoritesChange}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views over time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Views Over Time</h2>
            <div className="h-64">
              <AnalyticsChart 
                type="line"
                data={selectedAsset ? assetData?.viewsOverTime : globalData?.viewsOverTime}
                xKey="date"
                yKey="views"
                color="blue"
                title="Views"
              />
            </div>
          </div>
          
          {/* Downloads over time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Downloads Over Time</h2>
            <div className="h-64">
              <AnalyticsChart 
                type="line"
                data={selectedAsset ? assetData?.downloadsOverTime : globalData?.downloadsOverTime}
                xKey="date"
                yKey="downloads"
                color="green"
                title="Downloads"
              />
            </div>
          </div>
        </div>
        
        {/* Additional charts based on view type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedAsset ? (
            // Asset-specific charts
            <>
              {/* User role breakdown */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">User Role Breakdown</h2>
                <div className="h-64">
                  <AnalyticsChart 
                    type="pie"
                    data={assetData?.userBreakdown?.roles}
                    labelKey="role"
                    valueKey="percentage"
                  />
                </div>
              </div>
              
              {/* Asset details */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h2>
                <div>
                  <h3 className="text-xl font-semibold">
                    {globalData?.availableAssets.find(a => a.id === selectedAsset)?.title}
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      View this asset to see more details or download it.
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={() => window.location.href = `/assets/${selectedAsset}`}
                      >
                        View Asset Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Global analytics charts
            <>
              {/* Category distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Asset Category Distribution</h2>
                <div className="h-64">
                  <AnalyticsChart 
                    type="pie"
                    data={globalData?.categoryDistribution}
                    labelKey="category"
                    valueKey="value"
                  />
                </div>
              </div>
              
              {/* Popular assets */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Most Popular Assets</h2>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {popularAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded object-cover" src={asset.thumbnail} alt="" />
                              </div>
                              <div className="ml-4">
                                <a 
                                  href={`/assets/${asset.id}`} 
                                  className="text-sm font-medium text-blue-600 hover:text-blue-900"
                                >
                                  {asset.title}
                                </a>
                                <div className="text-xs text-gray-500">{asset.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-900">{asset.views}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-900">{asset.downloads}</span>
                          </td>
                        </tr>
                      ))}
                      
                      {popularAssets.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;