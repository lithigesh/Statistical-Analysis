// client/src/components/HypothesisTest.jsx
import React, { useState } from 'react';

const HypothesisTest = () => {
  const [testType, setTestType] = useState('t-test');
  const [sampleData, setSampleData] = useState('');
  const [populationMean, setPopulationMean] = useState('');
  const [significanceLevel, setSignificanceLevel] = useState(0.05);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [savedTests, setSavedTests] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTest = async (shouldSave = saveToDb) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/hypothesis-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          sampleData: sampleData.split(',').map(x => parseFloat(x.trim())),
          populationMean: parseFloat(populationMean),
          significanceLevel: parseFloat(significanceLevel),
          saveToDb: shouldSave,
        }),
      });
      
      const result = await response.json();
      setResults(result);
      
      // Show save success indicator if saved
      if (shouldSave) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error performing hypothesis test:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedTests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analyses/hypothesis-tests?limit=20');
      if (response.ok) {
        const result = await response.json();
        setSavedTests(result.tests || []);
      }
    } catch (error) {
      console.error('Error loading saved tests:', error);
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

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <button
          onClick={() => {
            setShowSaved(!showSaved);
            if (!showSaved) loadSavedTests();
          }}
          className="px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-50 transition-colors"
        >
          {showSaved ? 'Hide Saved Tests' : 'Show Saved Tests'}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-black text-white rounded-lg border-2 border-gray-300">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Hypothesis test saved to database successfully!</span>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => {
            setSaveToDb(false);
            handleTest(false);
          }}
          disabled={loading || !sampleData || !populationMean}
          className="flex-1 bg-white text-black border-2 border-black py-3 px-6 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Computing Test Statistics...' : 'Run Hypothesis Test'}
        </button>
        
        <button
          onClick={() => {
            setSaveToDb(true);
            handleTest(true);
          }}
          disabled={loading || !sampleData || !populationMean}
          className="flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Saving Test...' : 'Run & Save to DB'}
        </button>
      </div>

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

      {showSaved && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Saved Hypothesis Tests</h3>
          {savedTests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No saved tests yet. Enable "Save test results to database" to store your results.</p>
          ) : (
            <div className="grid gap-4">
              {savedTests.map((test) => (
                <div key={test._id} className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {test.testType?.toUpperCase()} Test
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(test.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        α = {test.significanceLevel}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        test.results?.rejectNull 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {test.results?.rejectNull ? 'Reject H₀' : 'Fail to Reject H₀'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Test Statistic:</span>
                      <p className="font-medium">{test.results?.testStatistic?.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">P-value:</span>
                      <p className="font-medium">{test.results?.pValue?.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sample Mean:</span>
                      <p className="font-medium">{test.results?.sampleMean?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sample Size:</span>
                      <p className="font-medium">{test.results?.sampleSize}</p>
                    </div>
                  </div>
                  {test.metadata?.description && (
                    <p className="mt-3 text-sm text-gray-600">
                      <strong>Description:</strong> {test.metadata.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HypothesisTest;