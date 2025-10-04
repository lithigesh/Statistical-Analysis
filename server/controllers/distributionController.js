// server/src/controllers/distributionController.js
const { normalPdf, binomialPmf, poissonPmf, exponentialPdf } = require('../utils/statistics');
const { DistributionAnalysis } = require('../models/Analysis');

/**
 * Generate normal distribution data points
 */
const getNormalDistribution = async (req, res) => {
  try {
    const mean = parseFloat(req.query.mean);
    const stdDev = parseFloat(req.query.stdDev);
    const saveToDb = req.query.save === 'true';

    if (isNaN(mean) || isNaN(stdDev) || stdDev <= 0) {
      return res.status(400).json({ 
        error: 'Invalid parameters: mean must be a number, stdDev must be a positive number.' 
      });
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
};

/**
 * Generate binomial distribution data points
 */
const getBinomialDistribution = (req, res) => {
  try {
    const n = parseInt(req.query.n);
    const p = parseFloat(req.query.p);

    if (isNaN(n) || isNaN(p) || n <= 0 || p < 0 || p > 1) {
      return res.status(400).json({ 
        error: 'Invalid parameters: n must be positive integer, p must be between 0 and 1.' 
      });
    }

    const dataPoints = [];
    for (let k = 0; k <= n; k++) {
      const y = binomialPmf(k, n, p);
      dataPoints.push({ x: k, y: parseFloat(y.toFixed(6)) });
    }

    res.json(dataPoints);
  } catch (error) {
    console.error('Error in binomial distribution endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Generate Poisson distribution data points
 */
const getPoissonDistribution = (req, res) => {
  try {
    const lambda = parseFloat(req.query.lambda);

    if (isNaN(lambda) || lambda <= 0) {
      return res.status(400).json({ 
        error: 'Invalid parameters: lambda must be a positive number.' 
      });
    }

    const dataPoints = [];
    const maxK = Math.max(20, Math.ceil(lambda + 5 * Math.sqrt(lambda)));
    
    for (let k = 0; k <= maxK; k++) {
      const y = poissonPmf(k, lambda);
      if (y < 0.001 && k > lambda + 3 * Math.sqrt(lambda)) break;
      dataPoints.push({ x: k, y: parseFloat(y.toFixed(6)) });
    }

    res.json(dataPoints);
  } catch (error) {
    console.error('Error in Poisson distribution endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Generate exponential distribution data points
 */
const getExponentialDistribution = (req, res) => {
  try {
    const lambda = parseFloat(req.query.lambda);

    if (isNaN(lambda) || lambda <= 0) {
      return res.status(400).json({ 
        error: 'Invalid parameters: lambda must be a positive number.' 
      });
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
  } catch (error) {
    console.error('Error in exponential distribution endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNormalDistribution,
  getBinomialDistribution,
  getPoissonDistribution,
  getExponentialDistribution
};