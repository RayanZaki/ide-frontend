import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DataTable from '../components/DataTable';
import { useIDSData } from '../hooks/useIDSData';

const Dashboard: React.FC = () => {
  const { data, loading, error, lastUpdated, getStatistics } = useIDSData();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Calculate statistics
  const stats = getStatistics();
  
  // Generate chart data for attack trends
  const attackTrends = useMemo(() => {
    if (loading || data.length === 0) return null;
    
    // Group data by hour for visualization
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const hourlyData: Record<string, { benign: number; attacks: number }> = {};
    
    // Initialize hourly buckets
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      const hourKey = format(hour, 'HH:00');
      hourlyData[hourKey] = { benign: 0, attacks: 0 };
    }
    
    // Fill data
    data.forEach(item => {
      const timestamp = new Date(item.timestamp);
      if (timestamp >= last24Hours) {
        const hourKey = format(timestamp, 'HH:00');
        if (hourlyData[hourKey]) {
          if (item.label === 'BENIGN') {
            hourlyData[hourKey].benign += 1;
          } else {
            hourlyData[hourKey].attacks += 1;
          }
        }
      }
    });
    
    // Convert to chart format
    const labels = Object.keys(hourlyData).reverse();
    const benignData = labels.map(key => hourlyData[key].benign);
    const attackData = labels.map(key => hourlyData[key].attacks);
    
    return {
      labels,
      datasets: [
        {
          label: 'Normal Traffic',
          data: benignData,
          borderColor: '#2ECC71',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
        },
        {
          label: 'Attack Traffic',
          data: attackData,
          borderColor: '#E63946',
          backgroundColor: 'rgba(230, 57, 70, 0.2)',
        },
      ],
    };
  }, [data, loading]);
  
  // Generate pie chart data for attack distribution
  const attackDistribution = useMemo(() => {
    if (loading || stats.attackTypes.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Attack Distribution',
            data: [1],
            backgroundColor: ['#374151'],
            borderColor: ['#1E1E2E'],
            borderWidth: 1,
          },
        ],
      };
    }
    
    return {
      labels: stats.attackTypes.map(item => item.type),
      datasets: [
        {
          label: 'Attack Distribution',
          data: stats.attackTypes.map(item => item.count),
          backgroundColor: [
            '#E63946', // alert red
            '#1B98E0', // accent blue
            '#F39C12', // warning orange
            '#2ECC71', // success green
            '#6C63FF', // info purple
            '#0F4C75', // primary navy
          ],
          borderColor: ['#1E1E2E'],
          borderWidth: 1,
        },
      ],
    };
  }, [stats.attackTypes, loading]);
  
  // Filter recent attacks
  const recentAttacks = useMemo(() => {
    return data.filter(item => item.label !== 'BENIGN').slice(0, 10);
  }, [data]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading IDS data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }
  
  return (
    <div className="p-6 text-black bg-[#F5F7FA]">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Traffic</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.total.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-500 text-xl">🌐</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Attack Traffic</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.attackCount.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <span className="text-amber-500 text-xl">⚠️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Attack Percentage</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.attackPercentage.toFixed(2)}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-green-500 text-xl">📊</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Unique Attack Types</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.attackTypes.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-blue-500 text-xl">🔍</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Range Filter */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0A4170]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Time Range
        </h2>
        <div className="flex">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-5 m-2 py-2.5 text-sm font-medium rounded-l-lg border ${
              timeRange === 'day' 
                ? 'bg-[#0A4170] text-white border-[#0A4170]' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } focus:z-10 focus:outline-none transition-all duration-200 flex-1 flex justify-center items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last 24 Hours
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`m-2 px-5 py-2.5 text-sm font-medium border-y ${
              timeRange === 'week' 
                ? 'bg-[#0A4170] text-white border-[#0A4170]' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } focus:z-10 focus:outline-none transition-all duration-200 flex-1 flex justify-center items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`m-2 px-5 py-2.5 text-sm font-medium rounded-r-lg border ${
              timeRange === 'month' 
                ? 'bg-[#0A4170] text-white border-[#0A4170]' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            } focus:z-10 focus:outline-none transition-all duration-200 flex-1 flex justify-center items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last 30 Days
          </button>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0A4170]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Traffic Trends
          </h2>
          {attackTrends && <LineChart title="" data={attackTrends} height={300} />}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0A4170]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Attack Distribution
          </h2>
          <PieChart title="" data={attackDistribution} height={300} />
        </div>
      </div>
      
      {/* Recent Attacks Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#0A4170]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Recent Attack Traffic
          </h2>
        </div>
        <DataTable data={recentAttacks} title="" />
      </div>
    </div>
  );
};

export default Dashboard;