import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'bg-blue-500', change }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg border-t-4 border-t-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-2 text-gray-800">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;