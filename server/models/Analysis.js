// server/src/models/Analysis.js
const mongoose = require('mongoose');

// Schema for storing distribution analysis results
const distributionAnalysisSchema = new mongoose.Schema({
  analysisType: {
    type: String,
    required: true,
    enum: ['normal', 'binomial', 'poisson', 'exponential']
  },
  parameters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  dataPoints: [{
    x: Number,
    y: Number
  }],
  metadata: {
    numPoints: Number,
    range: {
      min: Number,
      max: Number
    },
    createdBy: String,
    description: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for storing hypothesis test results
const hypothesisTestSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true,
    enum: ['t-test', 'z-test', 'chi-square']
  },
  sampleData: [Number],
  populationMean: Number,
  significanceLevel: Number,
  results: {
    testStatistic: Number,
    pValue: Number,
    criticalValue: Number,
    rejectNull: Boolean,
    interpretation: String,
    sampleMean: Number,
    sampleSize: Number,
    sampleStdDev: Number
  },
  metadata: {
    createdBy: String,
    description: String,
    tags: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for storing regression analysis results
const regressionAnalysisSchema = new mongoose.Schema({
  analysisType: {
    type: String,
    default: 'linear',
    enum: ['linear', 'polynomial', 'logistic']
  },
  xData: [Number],
  yData: [Number],
  results: {
    slope: Number,
    intercept: Number,
    rSquared: Number,
    correlation: Number,
    equation: String,
    n: Number
  },
  predictions: [{
    x: Number,
    yPredicted: Number,
    residual: Number
  }],
  metadata: {
    createdBy: String,
    description: String,
    datasetName: String,
    tags: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for storing datasets
const datasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  data: [{
    variable: String,
    values: [mongoose.Schema.Types.Mixed]
  }],
  metadata: {
    source: String,
    uploadedBy: String,
    dataType: String,
    variables: [String],
    recordCount: Number,
    tags: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for user sessions/preferences
const userSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  preferences: {
    defaultSignificanceLevel: {
      type: Number,
      default: 0.05
    },
    defaultDistribution: {
      type: String,
      default: 'normal'
    },
    chartTheme: {
      type: String,
      default: 'default'
    }
  },
  recentAnalyses: [{
    analysisId: mongoose.Schema.Types.ObjectId,
    analysisType: String,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Create models
const DistributionAnalysis = mongoose.model('DistributionAnalysis', distributionAnalysisSchema);
const HypothesisTest = mongoose.model('HypothesisTest', hypothesisTestSchema);
const RegressionAnalysis = mongoose.model('RegressionAnalysis', regressionAnalysisSchema);
const Dataset = mongoose.model('Dataset', datasetSchema);
const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = {
  DistributionAnalysis,
  HypothesisTest,
  RegressionAnalysis,
  Dataset,
  UserSession
};