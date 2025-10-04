// client/src/components/HypothesisTest.jsx
import React, { useState } from 'react';

const HypothesisTest = () => {
  const [testType, setTestType] = useState('t-test');
  const [sampleData, setSampleData] = useState('');
  const [populationMean, setPopulationMean] = useState('');
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hypothesis-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          sampleData: sampleData.split(',').map(x => parseFloat(x.trim())),
          populationMean: parseFloat(populationMean),
          significanceLevel: parseFloat(significanceLevel),
        }),
      });
      
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error performing hypothesis test:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Hypothesis Testing
        </h2>
        <p className="text-gray-600">
          Perform statistical hypothesis tests to determine if sample data provides sufficient evidence to reject a null hypothesis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Statistical Test
          </label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
          >
            <option value="t-test">One-Sample t-test</option>
            <option value="z-test">One-Sample z-test</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Significance Level (α)
          </label>
          <select
            value={significanceLevel}
            onChange={(e) => setSignificanceLevel(parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
          >
            <option value={0.01}>0.01 (99% confidence)</option>
            <option value={0.05}>0.05 (95% confidence)</option>
            <option value={0.10}>0.10 (90% confidence)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Sample Data
          </label>
          <textarea
            value={sampleData}
            onChange={(e) => setSampleData(e.target.value)}
            placeholder="Enter comma-separated values (e.g., 23, 25, 27, 24, 26, 28, 22)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Enter numerical values separated by commas</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Hypothesized Population Mean (μ₀)
          </label>
          <input
            type="number"
            value={populationMean}
            onChange={(e) => setPopulationMean(e.target.value)}
            step="0.01"
            placeholder="Enter hypothesized mean"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <button
        onClick={handleTest}
        disabled={loading || !sampleData || !populationMean}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Computing Test Statistics...' : 'Run Hypothesis Test'}
      </button>

      {results && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Statistical Test Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700">Test Statistic</h4>
              <p className="text-2xl font-bold text-indigo-600">{results.testStatistic?.toFixed(4)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700">P-value</h4>
              <p className="text-2xl font-bold text-indigo-600">{results.pValue?.toFixed(4)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700">Critical Value</h4>
              <p className="text-2xl font-bold text-indigo-600">{results.criticalValue?.toFixed(4)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-700">Decision</h4>
              <p className={`text-2xl font-bold ${results.rejectNull ? 'text-red-600' : 'text-green-600'}`}>
                {results.rejectNull ? 'Reject H₀' : 'Fail to Reject H₀'}
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Statistical Interpretation</h4>
            <p className="text-sm text-blue-800">
              {results.interpretation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HypothesisTest;