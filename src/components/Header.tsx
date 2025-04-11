import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex-1">
        {/* <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div> */}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          {lastUpdated ? (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          ) : (
            <span>Loading data...</span>
          )}
        </div>
        
        <button className="relative p-1 rounded-full text-gray-500 hover:text-blue-500 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;