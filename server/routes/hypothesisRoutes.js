// server/src/routes/hypothesisRoutes.js
const express = require('express');
const { performHypothesisTest } = require('../controllers/hypothesisController');

const router = express.Router();

// Hypothesis testing endpoint
router.post('/hypothesis-test', performHypothesisTest);

module.exports = router;