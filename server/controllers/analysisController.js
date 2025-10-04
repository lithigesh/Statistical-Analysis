// server/src/controllers/analysisController.js
const { DistributionAnalysis, HypothesisTest, RegressionAnalysis, Dataset } = require('../models/Analysis');

/**
 * Get all saved distribution analyses with pagination
 */
const getDistributionAnalyses = async (req, res) => {
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
};

/**
 * Get all saved hypothesis tests with pagination
 */
const getHypothesisTests = async (req, res) => {
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
};

/**
 * Get all saved regression analyses with pagination
 */
const getRegressionAnalyses = async (req, res) => {
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
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
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
};

/**
 * Delete an analysis by type and ID
 */
const deleteAnalysis = async (req, res) => {
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
};

module.exports = {
  getDistributionAnalyses,
  getHypothesisTests,
  getRegressionAnalyses,
  getDashboardStats,
  deleteAnalysis
};