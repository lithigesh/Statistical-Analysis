// client/src/components/DistributionPlotter.jsx
import React, { useState, useEffect, useCallback } from 'react';
import NormalDistributionChart from './NormalDistributionChart';

const DistributionPlotter = () => {
  const [distributionType, setDistributionType] = useState('normal');
  const [params, setParams] = useState({ mean: 0, stdDev: 1 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDistributionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
      let url = `${apiPrefix}/${distributionType}-distribution?`;
      
      if (distributionType === 'normal') {
        url += `mean=${params.mean}&stdDev=${params.stdDev}`;
      } else if (distributionType === 'binomial') {
        url += `n=${params.n}&p=${params.p}`;
      } else if (distributionType === 'poisson') {
        url += `lambda=${params.lambda}`;
      } else if (distributionType === 'exponential') {
        url += `lambda=${params.lambda}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("Failed to fetch data. Please check server status.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [distributionType, params]);

  useEffect(() => {
    fetchDistributionData();
  }, [fetchDistributionData]);

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
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Mean (μ)
              </label>
              <input
                type="number"
                value={params.mean || 0}
                onChange={(e) => handleParamChange('mean', e.target.value)}
                step="0.1"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Standard Deviation (σ)
              </label>
              <input
                type="number"
                value={params.stdDev || 1}
                onChange={(e) => handleParamChange('stdDev', e.target.value)}
                step="0.1"
                min="0.01"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
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
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Probability Distribution Analysis
        </h2>
        <p className="text-gray-600">
          Visualize and analyze various probability distributions with customizable parameters.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
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
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
        >
          <option value="normal">Normal Distribution</option>
          <option value="binomial">Binomial Distribution</option>
          <option value="poisson">Poisson Distribution</option>
          <option value="exponential">Exponential Distribution</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderParameterInputs()}
      </div>

        {loading && (
          <div className="flex justify-center items-center h-24 text-indigo-600">
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
    </div>
  );
};

export default DistributionPlotter;