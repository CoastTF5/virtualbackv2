import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateRangeSelector({ 
  dateRange = { start: null, end: null }, 
  onDateRangeChange 
}) {
  const [startDate, setStartDate] = useState(
    dateRange.start ? new Date(dateRange.start) : null
  );
  const [endDate, setEndDate] = useState(
    dateRange.end ? new Date(dateRange.end) : null
  );
  const [isOpen, setIsOpen] = useState(false);
  const popperRef = useRef(null);

  // Create quick select options
  const quickSelectOptions = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'This year', value: 'thisyear' },
    { label: 'All time', value: 'alltime' }
  ];

  // Update local state when props change
  useEffect(() => {
    if (dateRange.start && dateRange.start !== startDate?.toISOString().split('T')[0]) {
      setStartDate(new Date(dateRange.start));
    }
    if (dateRange.end && dateRange.end !== endDate?.toISOString().split('T')[0]) {
      setEndDate(new Date(dateRange.end));
    }
  }, [dateRange]);

  // Calculate date range label for display
  const getDateRangeLabel = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    return 'Select date range';
  };

  // Apply quick select option
  const handleQuickSelect = (option) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (option) {
      case '7days':
        start.setDate(now.getDate() - 7);
        break;
      case '30days':
        start.setDate(now.getDate() - 30);
        break;
      case '90days':
        start.setDate(now.getDate() - 90);
        break;
      case 'thisyear':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'alltime':
        start = new Date(2023, 0, 1); // Start of database
        break;
      default:
        break;
    }
    
    setStartDate(start);
    setEndDate(end);
    
    if (onDateRangeChange) {
      onDateRangeChange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
    
    setIsOpen(false);
  };

  // Handle custom date range selection
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end && onDateRangeChange) {
      onDateRangeChange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{getDateRangeLabel()}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          ref={popperRef}
          className="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-80"
        >
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick select</h4>
            <div className="flex flex-wrap gap-2">
              {quickSelectOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuickSelect(option.value)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Custom range</h4>
            <DatePicker
              selected={startDate}
              onChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              calendarClassName="border border-gray-200 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeSelector;