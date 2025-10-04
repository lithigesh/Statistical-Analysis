// client/src/components/RegressionAnalysis.jsx
import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const RegressionAnalysis = () => {
  const [xData, setXData] = useState('');
  const [yData, setYData] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [savedRegressions, setSavedRegressions] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRegression = async (shouldSave = saveToDb) => {
    setLoading(true);
    try {
      const xValues = xData.split(',').map(x => parseFloat(x.trim()));
      const yValues = yData.split(',').map(y => parseFloat(y.trim()));

      if (xValues.length !== yValues.length) {
        alert('X and Y data must have the same number of values');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/regression', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xData: xValues,
          yData: yValues,
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
      console.error('Error performing regression analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedRegressions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analyses/regressions?limit=20');
      if (response.ok) {
        const result = await response.json();
        setSavedRegressions(result.regressions || []);
      }
    } catch (error) {
      console.error('Error loading saved regressions:', error);
    }
  };

  const getChartData = () => {
    if (!results) return null;

    const xValues = xData.split(',').map(x => parseFloat(x.trim()));
    const yValues = yData.split(',').map(y => parseFloat(y.trim()));
    
    const scatterData = xValues.map((x, i) => ({ x, y: yValues[i] }));
    
    // Generate regression line points
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const regressionLine = [
      { x: minX, y: results.slope * minX + results.intercept },
      { x: maxX, y: results.slope * maxX + results.intercept }
    ];

    return {
      datasets: [
        {
          label: 'Data Points',
          data: scatterData,
          backgroundColor: 'rgba(99, 132, 255, 0.6)',
          borderColor: 'rgba(99, 132, 255, 1)',
          pointRadius: 5,
          showLine: false,
        },
        {
          label: 'Regression Line',
          data: regressionLine,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointRadius: 0,
          showLine: true,
          type: 'line',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Values',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Values',
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Linear Regression Analysis
        </h2>
        <p className="text-gray-600">
          Analyze the linear relationship between two variables and generate predictive models with statistical metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X Data (comma-separated)
          </label>
          <textarea
            value={xData}
            onChange={(e) => setXData(e.target.value)}
            placeholder="e.g., 1, 2, 3, 4, 5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y Data (comma-separated)
          </label>
          <textarea
            value={yData}
            onChange={(e) => setYData(e.target.value)}
            placeholder="e.g., 2, 4, 6, 8, 10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <button
          onClick={() => {
            setShowSaved(!showSaved);
            if (!showSaved) loadSavedRegressions();
          }}
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
            <span className="font-medium">Regression analysis saved to database successfully!</span>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => {
            setSaveToDb(false);
            handleRegression(false);
          }}
          disabled={loading || !xData || !yData}
          className="flex-1 bg-white text-black border-2 border-black py-3 px-6 rounded-md hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Computing Regression Model...' : 'Run Regression Analysis'}
        </button>
        
        <button
          onClick={() => {
            setSaveToDb(true);
            handleRegression(true);
          }}
          disabled={loading || !xData || !yData}
          className="flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Saving Analysis...' : 'Run & Save to DB'}
        </button>
      </div>

      {results && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg text-center border-2 border-black">
              <h4 className="font-medium text-black mb-2">Slope Coefficient</h4>
              <p className="text-2xl font-semibold text-black">{results.slope?.toFixed(4)}</p>
              <p className="text-xs text-gray-600 mt-1">Change in Y per unit X</p>
            </div>
            <div className="bg-black p-6 rounded-lg text-center border-2 border-gray-300">
              <h4 className="font-medium text-white mb-2">Y-Intercept</h4>
              <p className="text-2xl font-semibold text-white">{results.intercept?.toFixed(4)}</p>
              <p className="text-xs text-gray-300 mt-1">Y value when X = 0</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center border-2 border-black">
              <h4 className="font-medium text-black mb-2">R² Coefficient</h4>
              <p className="text-2xl font-semibold text-black">{results.rSquared?.toFixed(4)}</p>
              <p className="text-xs text-gray-600 mt-1">Goodness of fit</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Linear Regression Equation</h4>
            <div className="bg-white p-4 rounded border border-gray-200">
              <p className="text-lg font-mono text-gray-800">
                y = {results.slope?.toFixed(4)}x + {results.intercept?.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-900 mb-4">Data Visualization</h4>
            <div className="bg-white p-4 rounded border border-gray-200" style={{ height: '400px' }}>
              <Scatter data={getChartData()} options={chartOptions} />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">Model Performance</h4>
            <p className="text-sm text-blue-800">
              The coefficient of determination (R²) value of {results.rSquared?.toFixed(4)} indicates that {(results.rSquared * 100)?.toFixed(1)}% of the variance in the dependent variable is explained by the independent variable. 
              {results.rSquared > 0.7 ? ' This suggests a strong linear relationship.' : 
               results.rSquared > 0.3 ? ' This suggests a moderate linear relationship.' : 
               ' This suggests a weak linear relationship.'}
            </p>
          </div>
        </div>
      )}

      {showSaved && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Saved Regression Analyses</h3>
          {savedRegressions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No saved regressions yet. Enable "Save regression analysis to database" to store your results.</p>
          ) : (
            <div className="grid gap-4">
              {savedRegressions.map((regression) => (
                <div key={regression._id} className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {regression.analysisType?.charAt(0).toUpperCase() + regression.analysisType?.slice(1)} Regression
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(regression.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        n = {regression.results?.n}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        (regression.results?.rSquared || 0) > 0.7 
                          ? 'bg-green-100 text-green-800' 
                          : (regression.results?.rSquared || 0) > 0.3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        R² = {regression.results?.rSquared?.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Slope:</span>
                      <p className="font-medium">{regression.results?.slope?.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Intercept:</span>
                      <p className="font-medium">{regression.results?.intercept?.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Correlation:</span>
                      <p className="font-medium">{regression.results?.correlation?.toFixed(4)}</p>
                    </div>
                  </div>
                  {regression.results?.equation && (
                    <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                      {regression.results.equation}
                    </div>
                  )}
                  {regression.metadata?.description && (
                    <p className="mt-3 text-sm text-gray-600">
                      <strong>Description:</strong> {regression.metadata.description}
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

export default RegressionAnalysis;