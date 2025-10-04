// server/src/routes/regressionRoutes.js
const express = require('express');
const { performRegressionAnalysis } = require('../controllers/regressionController');

const router = express.Router();

// Regression analysis endpoint
router.post('/regression', performRegressionAnalysis);

module.exports = router;