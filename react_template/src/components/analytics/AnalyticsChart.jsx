import React, { useRef, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Colors } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Colors);

function AnalyticsChart({ 
  type = 'line',  // 'line', 'bar', 'pie'
  data = [],
  xKey = 'date',
  yKey = 'value',
  labelKey = 'label',
  valueKey = 'value',
  color = 'blue',
  height = 300,
  width = '100%',
  title = ''
}) {
  const chartRef = useRef(null);
  
  // Generate colors based on the provided color
  const getColorForValue = (alpha = 1) => {
    const colors = {
      blue: `rgba(59, 130, 246, ${alpha})`,
      green: `rgba(16, 185, 129, ${alpha})`,
      red: `rgba(239, 68, 68, ${alpha})`,
      purple: `rgba(139, 92, 246, ${alpha})`,
      yellow: `rgba(245, 158, 11, ${alpha})`,
      indigo: `rgba(99, 102, 241, ${alpha})`,
      pink: `rgba(236, 72, 153, ${alpha})`
    };
    
    return colors[color] || colors.blue;
  };
  
  // Generate colors for pie charts
  const generatePieColors = (count) => {
    const baseColors = [
      'rgba(59, 130, 246, 1)', // blue
      'rgba(16, 185, 129, 1)', // green
      'rgba(239, 68, 68, 1)',  // red
      'rgba(139, 92, 246, 1)', // purple
      'rgba(245, 158, 11, 1)', // yellow
      'rgba(99, 102, 241, 1)',  // indigo
      'rgba(236, 72, 153, 1)'  // pink
    ];
    
    // If we need more colors than our base set, generate additional variations
    if (count > baseColors.length) {
      const additionalColors = [];
      for (let i = 0; i < count - baseColors.length; i++) {
        const hue = (i * 137) % 360; // Golden ratio to spread colors nicely
        additionalColors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return [...baseColors, ...additionalColors];
    }
    
    return baseColors.slice(0, count);
  };
  
  // Format data for the chart based on type
  const formatChartData = () => {
    if (type === 'pie') {
      return {
        labels: data.map(item => item[labelKey]),
        datasets: [{
          data: data.map(item => item[valueKey]),
          backgroundColor: generatePieColors(data.length),
          borderWidth: 1
        }]
      };
    } else {
      return {
        labels: data.map(item => item[xKey]),
        datasets: [{
          label: title,
          data: data.map(item => item[yKey]),
          backgroundColor: getColorForValue(0.5),
          borderColor: getColorForValue(1),
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: getColorForValue(1),
          fill: type === 'line' ? false : undefined
        }]
      };
    }
  };
  
  // Chart options
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type === 'pie'
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        }
      }
    };
    
    // Add specific options based on chart type
    if (type === 'line' || type === 'bar') {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      };
    }
    
    return baseOptions;
  };
  
  // Render appropriate chart component based on type
  const renderChart = () => {
    const chartData = formatChartData();
    const chartOptions = getChartOptions();
    
    switch (type) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData} options={chartOptions} />;
      case 'line':
      default:
        return <Line ref={chartRef} data={chartData} options={chartOptions} />;
    }
  };
  
  return (
    <div style={{ height, width }}>
      {data.length > 0 ? (
        renderChart()
      ) : (
        <div className="flex items-center justify-center h-full border border-dashed border-gray-300 bg-gray-50 rounded-md">
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      )}
    </div>
  );
}

export default AnalyticsChart;