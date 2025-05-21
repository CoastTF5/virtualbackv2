import React, { useState, useEffect } from 'react';

function FilterPanel({ filters = {}, onFilterChange, onReset }) {
  const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
  const [formatFilter, setFormatFilter] = useState(filters.format || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'newest');
  const [dateRange, setDateRange] = useState(filters.dateRange || 'any');

  // Update local state when filters prop changes
  useEffect(() => {
    setCategoryFilter(filters.category || '');
    setFormatFilter(filters.format || '');
    setSortBy(filters.sortBy || 'newest');
    setDateRange(filters.dateRange || 'any');
  }, [filters]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    onFilterChange({ ...filters, category: value });
  };

  const handleFormatChange = (e) => {
    const value = e.target.value;
    setFormatFilter(value);
    onFilterChange({ ...filters, format: value });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onFilterChange({ ...filters, sortBy: value });
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    onFilterChange({ ...filters, dateRange: value });
  };

  const handleResetClick = () => {
    setCategoryFilter('');
    setFormatFilter('');
    setSortBy('newest');
    setDateRange('any');
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Categories</option>
          <option value="environments">Environments</option>
          <option value="vehicles">Vehicles</option>
          <option value="props">Props</option>
          <option value="characters">Characters</option>
          <option value="promos">Promos</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <select
          id="format"
          value={formatFilter}
          onChange={handleFormatChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Formats</option>
          <option value="Unreal Engine 5">Unreal Engine 5</option>
          <option value="FBX">FBX</option>
          <option value="GLB/GLTF">GLB/GLTF</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
          <option value="downloads">Most Downloads</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date Added
        </label>
        <select
          id="date"
          value={dateRange}
          onChange={handleDateRangeChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="any">Any Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="year">Last Year</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleResetClick}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;