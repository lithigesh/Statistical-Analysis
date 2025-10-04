// server/src/index.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes (adjust origins in production)
app.use(cors());
app.use(express.json());

// Statistical functions
function normalPdf(x, mean, stdDev) {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

function binomialPmf(k, n, p) {
  function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
  }
  
  const coefficient = factorial(n) / (factorial(k) * factorial(n - k));
  return coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function poissonPmf(k, lambda) {
  function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
  }
  
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function exponentialPdf(x, lambda) {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
}

function tCdf(t, df) {
  // Approximation of t-distribution CDF using gamma function approximation
  // This is a simplified implementation - in production, use a proper statistical library
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  // Incomplete beta function approximation
  return 0.5 + (t / Math.sqrt(df)) * 0.5; // Simplified approximation
}

// API endpoint for normal distribution data
app.get('/normal-distribution', (req, res) => {
  const mean = parseFloat(req.query.mean);
  const stdDev = parseFloat(req.query.stdDev);

  if (isNaN(mean) || isNaN(stdDev) || stdDev <= 0) {
    return res.status(400).json({ error: 'Invalid parameters: mean must be a number, stdDev must be a positive number.' });
  }

  const dataPoints = [];
  const numPoints = 200;
  const rangeMultiplier = 4;

  const minX = mean - rangeMultiplier * stdDev;
  const maxX = mean + rangeMultiplier * stdDev;
  const step = (maxX - minX) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = minX + i * step;
    const y = normalPdf(x, mean, stdDev);
    dataPoints.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
  }

  res.json(dataPoints);
});

// API endpoint for binomial distribution
app.get('/binomial-distribution', (req, res) => {
  const n = parseInt(req.query.n);
  const p = parseFloat(req.query.p);

  if (isNaN(n) || isNaN(p) || n <= 0 || p < 0 || p > 1) {
    return res.status(400).json({ error: 'Invalid parameters: n must be positive integer, p must be between 0 and 1.' });
  }

  const dataPoints = [];
  for (let k = 0; k <= n; k++) {
    const y = binomialPmf(k, n, p);
    dataPoints.push({ x: k, y: parseFloat(y.toFixed(6)) });
  }

  res.json(dataPoints);
});

// API endpoint for Poisson distribution
app.get('/poisson-distribution', (req, res) => {
  const lambda = parseFloat(req.query.lambda);

  if (isNaN(lambda) || lambda <= 0) {
    return res.status(400).json({ error: 'Invalid parameters: lambda must be a positive number.' });
  }

  const dataPoints = [];
  const maxK = Math.max(20, Math.ceil(lambda + 5 * Math.sqrt(lambda)));
  
  for (let k = 0; k <= maxK; k++) {
    const y = poissonPmf(k, lambda);
    if (y < 0.001 && k > lambda + 3 * Math.sqrt(lambda)) break;
    dataPoints.push({ x: k, y: parseFloat(y.toFixed(6)) });
  }

  res.json(dataPoints);
});

// API endpoint for exponential distribution
app.get('/exponential-distribution', (req, res) => {
  const lambda = parseFloat(req.query.lambda);

  if (isNaN(lambda) || lambda <= 0) {
    return res.status(400).json({ error: 'Invalid parameters: lambda must be a positive number.' });
  }

  const dataPoints = [];
  const numPoints = 200;
  const maxX = 5 / lambda; // Show up to 5/lambda where PDF becomes very small

  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * maxX;
    const y = exponentialPdf(x, lambda);
    dataPoints.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) });
  }

  res.json(dataPoints);
});

// API endpoint for hypothesis testing
app.post('/hypothesis-test', (req, res) => {
  const { testType, sampleData, populationMean, significanceLevel } = req.body;

  if (!sampleData || sampleData.length === 0) {
    return res.status(400).json({ error: 'Sample data is required.' });
  }

  const n = sampleData.length;
  const sampleMean = sampleData.reduce((sum, x) => sum + x, 0) / n;
  const sampleVariance = sampleData.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / (n - 1);
  const sampleStdDev = Math.sqrt(sampleVariance);

  let testStatistic, pValue, criticalValue, rejectNull;

  if (testType === 't-test') {
    testStatistic = (sampleMean - populationMean) / (sampleStdDev / Math.sqrt(n));
    const df = n - 1;
    
    // Critical value for two-tailed test (approximation)
    if (significanceLevel === 0.05) {
      criticalValue = df > 30 ? 1.96 : (df > 20 ? 2.086 : (df > 10 ? 2.228 : 2.776));
    } else if (significanceLevel === 0.01) {
      criticalValue = df > 30 ? 2.576 : (df > 20 ? 2.845 : (df > 10 ? 3.169 : 3.747));
    } else {
      criticalValue = df > 30 ? 1.645 : (df > 20 ? 1.725 : (df > 10 ? 1.812 : 2.132));
    }
    
    // Simplified p-value calculation (approximation)
    pValue = 2 * (1 - Math.abs(testStatistic) / (Math.abs(testStatistic) + Math.sqrt(df)));
    rejectNull = Math.abs(testStatistic) > criticalValue;
  }

  const interpretation = rejectNull 
    ? `At α = ${significanceLevel}, we reject the null hypothesis. There is sufficient evidence that the population mean is different from ${populationMean}.`
    : `At α = ${significanceLevel}, we fail to reject the null hypothesis. There is insufficient evidence that the population mean is different from ${populationMean}.`;

  res.json({
    testStatistic,
    pValue,
    criticalValue,
    rejectNull,
    interpretation,
    sampleMean,
    sampleSize: n
  });
});

// API endpoint for regression analysis
app.post('/regression', (req, res) => {
  const { xData, yData } = req.body;

  if (!xData || !yData || xData.length !== yData.length || xData.length < 2) {
    return res.status(400).json({ error: 'Invalid data: x and y must have same length and at least 2 points.' });
  }

  const n = xData.length;
  const sumX = xData.reduce((sum, x) => sum + x, 0);
  const sumY = yData.reduce((sum, y) => sum + y, 0);
  const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
  const sumXX = xData.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yData.reduce((sum, y) => sum + y * y, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope and intercept
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = meanY - slope * meanX;

  // Calculate R-squared
  const totalSumSquares = sumYY - n * meanY * meanY;
  const residualSumSquares = yData.reduce((sum, y, i) => {
    const predicted = slope * xData[i] + intercept;
    return sum + Math.pow(y - predicted, 2);
  }, 0);
  const rSquared = 1 - (residualSumSquares / totalSumSquares);

  // Calculate correlation coefficient
  const correlation = Math.sqrt(rSquared) * (slope > 0 ? 1 : -1);

  res.json({
    slope,
    intercept,
    rSquared,
    correlation,
    n
  });
});

// Basic root route for testing server
app.get('/', (req, res) => {
  res.send('Statistical Tools API is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});