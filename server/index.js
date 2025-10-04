// server/index.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { connectDB } = require('./config/database');

// Import route modules
const distributionRoutes = require('./routes/distributionRoutes');
const hypothesisRoutes = require('./routes/hypothesisRoutes');
const regressionRoutes = require('./routes/regressionRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).end();
});

// Routes
app.use('/api', distributionRoutes);
app.use('/api', hypothesisRoutes);
app.use('/api', regressionRoutes);
app.use('/api', analysisRoutes);

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

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;