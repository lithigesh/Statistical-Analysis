// server/src/controllers/regressionController.js
const { calculateLinearRegression } = require('../utils/statistics');
const { RegressionAnalysis } = require('../models/Analysis');

/**
 * Perform linear regression analysis
 */
const performRegressionAnalysis = async (req, res) => {
  try {
    const { xData, yData, saveToDb = false } = req.body;

    if (!xData || !yData || xData.length !== yData.length || xData.length < 2) {
      return res.status(400).json({ 
        error: 'Invalid data: x and y must have same length and at least 2 points.' 
      });
    }

    const results = calculateLinearRegression(xData, yData);

    // Generate predictions and residuals
    const predictions = xData.map((x, i) => ({
      x,
      yPredicted: results.slope * x + results.intercept,
      residual: yData[i] - (results.slope * x + results.intercept)
    }));

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
};

module.exports = {
  performRegressionAnalysis
};