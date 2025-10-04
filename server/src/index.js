// server/src/index.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { 
  DistributionAnalysis, 
  HypothesisTest, 
  RegressionAnalysis, 
  Dataset, 
  UserSession 
} = require('./models/Analysis');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Enable CORS for all routes (adjust origins in production)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true
}));
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
app.get('/api/normal-distribution', async (req, res) => {
  try {
    const mean = parseFloat(req.query.mean);
    const stdDev = parseFloat(req.query.stdDev);
    const saveToDb = req.query.save === 'true';

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

    // Save to database if requested
    if (saveToDb) {
      const analysis = new DistributionAnalysis({
        analysisType: 'normal',
        parameters: new Map([
          ['mean', mean],
          ['stdDev', stdDev]
        ]),
        dataPoints,
        metadata: {
          numPoints,
          range: { min: minX, max: maxX },
          createdBy: req.headers['user-session'] || 'anonymous'
        }
      });
      
      await analysis.save();
      console.log('Normal distribution analysis saved to database');
    }

    res.json(dataPoints);
  } catch (error) {
    console.error('Error in normal distribution endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for binomial distribution
app.get('/api/binomial-distribution', (req, res) => {
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
app.get('/api/poisson-distribution', (req, res) => {
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
app.get('/api/exponential-distribution', (req, res) => {
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
app.post('/api/hypothesis-test', async (req, res) => {
  try {
    const { testType, sampleData, populationMean, significanceLevel, saveToDb = false } = req.body;

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

    const results = {
      testStatistic,
      pValue,
      criticalValue,
      rejectNull,
      interpretation,
      sampleMean,
      sampleSize: n,
      sampleStdDev
    };

    // Save to database if requested
    if (saveToDb) {
      const hypothesisTest = new HypothesisTest({
        testType,
        sampleData,
        populationMean,
        significanceLevel,
        results,
        metadata: {
          createdBy: req.headers['user-session'] || 'anonymous'
        }
      });
      
      await hypothesisTest.save();
      console.log('Hypothesis test saved to database');
    }

    res.json(results);
  } catch (error) {
    console.error('Error in hypothesis test endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for regression analysis
app.post('/api/regression', async (req, res) => {
  try {
    const { xData, yData, saveToDb = false } = req.body;

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

    // Generate predictions and residuals
    const predictions = xData.map((x, i) => ({
      x,
      yPredicted: slope * x + intercept,
      residual: yData[i] - (slope * x + intercept)
    }));

    const results = {
      slope,
      intercept,
      rSquared,
      correlation,
      n,
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
    };

    // Save to database if requested
    if (saveToDb) {
      const regressionAnalysis = new RegressionAnalysis({
        analysisType: 'linear',
        xData,
        yData,
        results,
        predictions,
        metadata: {
          createdBy: req.headers['user-session'] || 'anonymous'
        }
      });
      
      await regressionAnalysis.save();
      console.log('Regression analysis saved to database');
    }

    res.json(results);
  } catch (error) {
    console.error('Error in regression analysis endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoints for managing saved analyses

// Get all saved distribution analyses
app.get('/api/analyses/distributions', async (req, res) => {
  try {
    const { limit = 10, page = 1, analysisType } = req.query;
    const query = analysisType ? { analysisType } : {};
    
    const analyses = await DistributionAnalysis
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await DistributionAnalysis.countDocuments(query);
    
    res.json({
      analyses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching distribution analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all saved hypothesis tests
app.get('/api/analyses/hypothesis-tests', async (req, res) => {
  try {
    const { limit = 10, page = 1, testType } = req.query;
    const query = testType ? { testType } : {};
    
    const tests = await HypothesisTest
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await HypothesisTest.countDocuments(query);
    
    res.json({
      tests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching hypothesis tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all saved regression analyses
app.get('/api/analyses/regressions', async (req, res) => {
  try {
    const { limit = 10, page = 1, analysisType } = req.query;
    const query = analysisType ? { analysisType } : {};
    
    const regressions = await RegressionAnalysis
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await RegressionAnalysis.countDocuments(query);
    
    res.json({
      regressions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching regression analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [distributionCount, hypothesisCount, regressionCount, datasetCount] = await Promise.all([
      DistributionAnalysis.countDocuments(),
      HypothesisTest.countDocuments(),
      RegressionAnalysis.countDocuments(),
      Dataset.countDocuments()
    ]);
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [recentDistributions, recentHypothesis, recentRegressions] = await Promise.all([
      DistributionAnalysis.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      HypothesisTest.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      RegressionAnalysis.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);
    
    res.json({
      totalAnalyses: distributionCount + hypothesisCount + regressionCount,
      distributionAnalyses: distributionCount,
      hypothesisTests: hypothesisCount,
      regressionAnalyses: regressionCount,
      datasets: datasetCount,
      recentActivity: {
        distributions: recentDistributions,
        hypothesisTests: recentHypothesis,
        regressions: recentRegressions,
        total: recentDistributions + recentHypothesis + recentRegressions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an analysis
app.delete('/api/analyses/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;
    
    switch (type) {
      case 'distribution':
        Model = DistributionAnalysis;
        break;
      case 'hypothesis':
        Model = HypothesisTest;
        break;
      case 'regression':
        Model = RegressionAnalysis;
        break;
      default:
        return res.status(400).json({ error: 'Invalid analysis type' });
    }
    
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic root route for testing server
app.get('/', (req, res) => {
  res.json({
    message: 'Statistical Tools API is running!',
    version: '1.0.0',
    database: 'MongoDB connected',
    endpoints: {
      distributions: '/api/analyses/distributions',
      hypothesisTests: '/api/analyses/hypothesis-tests',
      regressions: '/api/analyses/regressions',
      dashboard: '/api/dashboard/stats'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});