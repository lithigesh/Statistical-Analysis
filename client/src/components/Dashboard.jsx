// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
      const response = await fetch(`${apiBaseUrl}${apiPrefix}/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-center items-center h-32 sm:h-48 lg:h-64">
          <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-sm sm:text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center text-red-600">
          <p className="text-sm sm:text-base">{error}</p>
          <button 
            onClick={loadDashboardStats}
            className="mt-4 px-4 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Overview of your statistical analysis activities and saved data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-black p-4 sm:p-6 rounded-lg text-white border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm font-medium">Total Analyses</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats?.totalAnalyses || 0}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-700 rounded-full">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg text-black border-2 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">Distribution Plots</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats?.distributionAnalyses || 0}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-200 rounded-full">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-black p-4 sm:p-6 rounded-lg text-white border-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs sm:text-sm font-medium">Hypothesis Tests</p>
              <p className="text-2xl sm:text-3xl font-bold">{stats?.hypothesisTests || 0}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-700 rounded-full">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg text-black border-2 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Regression Analyses</p>
              <p className="text-3xl font-bold">{stats?.regressionAnalyses || 0}</p>
            </div>
            <div className="p-3 bg-gray-200 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity (Last 7 Days)</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">Distribution Analyses</span>
              <span className="font-semibold text-sm sm:text-base text-black">{stats?.recentActivity?.distributions || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">Hypothesis Tests</span>
              <span className="font-semibold text-sm sm:text-base text-black">{stats?.recentActivity?.hypothesisTests || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">Regression Analyses</span>
              <span className="font-semibold text-sm sm:text-base text-black">{stats?.recentActivity?.regressions || 0}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-sm sm:text-base text-gray-900">Total Recent</span>
                <span className="text-sm sm:text-base text-black">{stats?.recentActivity?.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Database Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stored Datasets</span>
              <span className="font-semibold text-black">{stats?.datasets || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Records</span>
              <span className="font-semibold text-gray-900">{stats?.totalAnalyses || 0}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                All your statistical analyses are automatically saved to MongoDB for future reference and analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-indigo-50 rounded-lg border border-indigo-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => window.location.href = '/distributions'}
            className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-sm sm:text-base text-gray-900">Create Distribution Plot</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Generate probability distribution visualizations</p>
          </button>
          <button
            onClick={() => window.location.href = '/hypothesis-testing'}
            className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-sm sm:text-base text-gray-900">Run Hypothesis Test</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Perform statistical hypothesis testing</p>
          </button>
          <button
            onClick={() => window.location.href = '/regression'}
            className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left sm:col-span-2 lg:col-span-1"
          >
            <h4 className="font-medium text-sm sm:text-base text-gray-900">Regression Analysis</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Analyze linear relationships in data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;