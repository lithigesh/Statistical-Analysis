// server/src/routes/analysisRoutes.js
const express = require('express');
const {
  getDistributionAnalyses,
  getHypothesisTests,
  getRegressionAnalyses,
  getDashboardStats,
  deleteAnalysis
} = require('../controllers/analysisController');

const router = express.Router();

// Analysis management endpoints
router.get('/analyses/distributions', getDistributionAnalyses);
router.get('/analyses/hypothesis-tests', getHypothesisTests);
router.get('/analyses/regressions', getRegressionAnalyses);
router.get('/dashboard/stats', getDashboardStats);
router.delete('/analyses/:type/:id', deleteAnalysis);

module.exports = router;