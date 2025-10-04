// client/src/components/DistributionPlotter.jsx
import React, { useState, useEffect, useCallback } from 'react';
import NormalDistributionChart from './NormalDistributionChart';

const DistributionPlotter = () => {
  const [distributionType, setDistributionType] = useState('normal');
  const [params, setParams] = useState({ mean: 0, stdDev: 1 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveToDb, setSaveToDb] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchDistributionData = useCallback(async (shouldSave = saveToDb) => {
    setLoading(true);
    setError(null);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
      const baseUrl = `${apiBaseUrl}${apiPrefix}`;
      let url = `${baseUrl}/${distributionType}-distribution?`;
      
      if (distributionType === 'normal') {
        url += `mean=${params.mean}&stdDev=${params.stdDev}`;
      } else if (distributionType === 'binomial') {
        url += `n=${params.n}&p=${params.p}`;
      } else if (distributionType === 'poisson') {
        url += `lambda=${params.lambda}`;
      } else if (distributionType === 'exponential') {
        url += `lambda=${params.lambda}`;
      }

      // Add save parameter if enabled
      if (shouldSave) {
        url += url.includes('?') ? '&save=true' : '?save=true';
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      
      // Show save success indicator if saved
      if (shouldSave) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Failed to fetch data. Please check server status.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [distributionType, params, saveToDb]);

  const loadSavedAnalyses = useCallback(async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
      const baseUrl = `${apiBaseUrl}${apiPrefix}`;
      const response = await fetch(`${baseUrl}/analyses/distributions?limit=20`);
      if (response.ok) {
        const result = await response.json();
        setSavedAnalyses(result.analyses || []);
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error);
    }
  }, []);

  // Remove automatic generation - user must click button
  // useEffect(() => {
  //   fetchDistributionData();
  // }, [fetchDistributionData]);

  useEffect(() => {
    if (showSaved) {
      loadSavedAnalyses();
    }
  }, [showSaved, loadSavedAnalyses]);

  const handleParamChange = (paramName, value) => {
    setParams(prev => ({
      ...prev,
      [paramName]: parseFloat(value) || 0
    }));
  };

  const renderParameterInputs = () => {
    switch (distributionType) {
      case 'normal':
        return (
          <>
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                Mean (μ)
              </label>
              <input
                type="number"
                value={params.mean || 0}
                onChange={(e) => handleParamChange('mean', e.target.value)}
                step="0.1"
                className="mt-1 block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                Standard Deviation (σ)
              </label>
              <input
                type="number"
                value={params.stdDev || 1}
                onChange={(e) => handleParamChange('stdDev', e.target.value)}
                step="0.1"
                min="0.01"
                className="mt-1 block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
          </>
        );
      case 'binomial':
        return (
          <>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Number of Trials (n)
              </label>
              <input
                type="number"
                value={params.n || 10}
                onChange={(e) => handleParamChange('n', e.target.value)}
                min="1"
                step="1"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Probability of Success (p)
              </label>
              <input
                type="number"
                value={params.p || 0.5}
                onChange={(e) => handleParamChange('p', e.target.value)}
                step="0.01"
                min="0"
                max="1"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
          </>
        );
      case 'poisson':
        return (
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Rate Parameter (λ)
            </label>
            <input
              type="number"
              value={params.lambda || 3}
              onChange={(e) => handleParamChange('lambda', e.target.value)}
              step="0.1"
              min="0.1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        );
      case 'exponential':
        return (
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Rate Parameter (λ)
            </label>
            <input
              type="number"
              value={params.lambda || 1}
              onChange={(e) => handleParamChange('lambda', e.target.value)}
              step="0.1"
              min="0.1"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          Probability Distribution Analysis
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Visualize and analyze various probability distributions with customizable parameters.
        </p>
      </div>

      <div className="mb-4 sm:mb-6">
        <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
          Distribution Type
        </label>
        <select
          value={distributionType}
          onChange={(e) => {
            setDistributionType(e.target.value);
            // Reset parameters when changing distribution type
            if (e.target.value === 'normal') {
              setParams({ mean: 0, stdDev: 1 });
            } else if (e.target.value === 'binomial') {
              setParams({ n: 10, p: 0.5 });
            } else if (e.target.value === 'poisson') {
              setParams({ lambda: 3 });
            } else if (e.target.value === 'exponential') {
              setParams({ lambda: 1 });
            }
          }}
          className="mt-1 block w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
        >
          <option value="normal">Normal Distribution</option>
          <option value="binomial">Binomial Distribution</option>
          <option value="poisson">Poisson Distribution</option>
          <option value="exponential">Exponential Distribution</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {renderParameterInputs()}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => {
              setSaveToDb(false);
              fetchDistributionData(false);
            }}
            disabled={loading}
            className="px-4 sm:px-6 py-2 bg-white text-black border-2 border-black rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {loading ? 'Generating...' : 'Generate Distribution'}
          </button>
          
          <button
            onClick={() => {
              setSaveToDb(true);
              fetchDistributionData(true);
            }}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Saving...' : 'Generate & Save to DB'}
          </button>
        </div>
        
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-50 transition-colors"
        >
          {showSaved ? 'Hide Saved Analyses' : 'Show Saved Analyses'}
        </button>
      </div>

        {saveSuccess && (
          <div className="mb-4 p-4 bg-black text-white rounded-lg border-2 border-gray-300">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Distribution analysis saved to database successfully!</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-24 text-black">
            <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Computing distribution...</span>
          </div>
        )}      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Distribution Visualization</h4>
          <div className="bg-white p-4 rounded border border-gray-200">
            <NormalDistributionChart data={data} />
          </div>
        </div>
      )}

      {showSaved && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Saved Distribution Analyses</h4>
          {savedAnalyses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No saved analyses yet. Enable "Save analysis to database" to store your results.</p>
          ) : (
            <div className="grid gap-4">
              {savedAnalyses.map((analysis) => (
                <div key={analysis._id} className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 capitalize">
                        {analysis.analysisType} Distribution
                      </h5>
                      <p className="text-sm text-gray-500">
                        {new Date(analysis.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {analysis.dataPoints?.length || 0} points
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Parameters:</strong></p>
                    <ul className="ml-4">
                      {Array.from(analysis.parameters || new Map()).map(([key, value]) => (
                        <li key={key}>• {key}: {value}</li>
                      ))}
                    </ul>
                    {analysis.metadata?.description && (
                      <p className="mt-2"><strong>Description:</strong> {analysis.metadata.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistributionPlotter;