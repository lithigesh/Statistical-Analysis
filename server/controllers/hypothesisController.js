// server/src/controllers/hypothesisController.js
const { calculateBasicStats, getCriticalValue } = require('../utils/statistics');
const { HypothesisTest } = require('../models/Analysis');

/**
 * Perform hypothesis testing
 */
const performHypothesisTest = async (req, res) => {
  try {
    const { testType, sampleData, populationMean, significanceLevel, saveToDb = false } = req.body;

    if (!sampleData || sampleData.length === 0) {
      return res.status(400).json({ error: 'Sample data is required.' });
    }

    const { mean: sampleMean, stdDev: sampleStdDev, n } = calculateBasicStats(sampleData);
    
    let testStatistic, pValue, criticalValue, rejectNull;

    if (testType === 't-test') {
      testStatistic = (sampleMean - populationMean) / (sampleStdDev / Math.sqrt(n));
      const df = n - 1;
      
      criticalValue = getCriticalValue(significanceLevel, df);
      
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
};

module.exports = {
  performHypothesisTest
};