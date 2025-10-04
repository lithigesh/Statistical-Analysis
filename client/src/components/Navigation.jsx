// client/src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/distributions', label: 'Distribution Plotting' },
    { path: '/hypothesis-testing', label: 'Hypothesis Testing' },
    { path: '/regression', label: 'Regression Analysis' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-black">Statistical Analysis Tools</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-md transition-all duration-200 font-medium text-sm ${
                  location.pathname === item.path
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span className="hidden md:block">{item.label}</span>
                <span className="md:hidden">
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;