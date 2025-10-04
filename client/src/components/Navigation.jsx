// client/src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', shortLabel: 'Home' },
    { path: '/distributions', label: 'Distribution Plotting', shortLabel: 'Plots' },
    { path: '/hypothesis-testing', label: 'Hypothesis Testing', shortLabel: 'Tests' },
    { path: '/regression', label: 'Regression Analysis', shortLabel: 'Regression' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo - Hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-black">Statistical Analysis Tools</h1>
          </div>
          
          {/* Mobile Title - Only visible on mobile */}
          <div className="sm:hidden">
            <h1 className="text-lg font-semibold text-black">Stats Tools</h1>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 py-2 sm:px-4 sm:py-2.5 rounded-md transition-all duration-200 font-medium text-xs sm:text-sm ${
                  location.pathname === item.path
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span className="hidden lg:block">{item.label}</span>
                <span className="hidden sm:block lg:hidden">{item.shortLabel}</span>
                <span className="sm:hidden text-xs">{item.shortLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;