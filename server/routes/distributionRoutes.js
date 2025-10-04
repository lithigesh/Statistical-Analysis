// server/src/routes/distributionRoutes.js
const express = require('express');
const {
  getNormalDistribution,
  getBinomialDistribution,
  getPoissonDistribution,
  getExponentialDistribution
} = require('../controllers/distributionController');

const router = express.Router();

// Distribution endpoints
router.get('/normal-distribution', getNormalDistribution);
router.get('/binomial-distribution', getBinomialDistribution);
router.get('/poisson-distribution', getPoissonDistribution);
router.get('/exponential-distribution', getExponentialDistribution);

module.exports = router;