import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Navigation items
const navItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Traffic Analysis', path: '/traffic', icon: '🌐' },
  { name: 'Attacks', path: '/attacks', icon: '⚠️' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="bg-[#1A1D2B] text-white h-screen w-64 p-4 fixed left-0 top-0 ">
      <div className="flex items-center space-x-2 my-8 mx-2">
        <span className="text-2xl">🛡️</span>
        <h1 className="text-xl font-bold text-white">IDS Monitor</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-cyber-primary text-white'
                : 'text-cyber-secondary hover:bg-[#242736] hover:text-cyber-accent'
            }`}
          >
            <span className={`text-lg ${
              location.pathname === item.path
                ? 'text-white'
                : 'text-cyber-accent'
            }`}>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-8 left-4 right-4">
        <div className="bg-[#242736] p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-amber-500 text-lg">🔔</span>
            <h3 className="font-medium text-white">Alert Status</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">System Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;