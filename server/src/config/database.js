// server/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    
    // Create indexes for better performance
    await createIndexes();
    
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const { DistributionAnalysis, HypothesisTest, RegressionAnalysis, Dataset, UserSession } = require('../models/Analysis');
    
    // Create indexes for better query performance
    await DistributionAnalysis.createIndexes([
      { analysisType: 1, createdAt: -1 },
      { 'metadata.createdBy': 1 },
      { createdAt: -1 }
    ]);
    
    await HypothesisTest.createIndexes([
      { testType: 1, createdAt: -1 },
      { 'metadata.createdBy': 1 },
      { significanceLevel: 1 },
      { createdAt: -1 }
    ]);
    
    await RegressionAnalysis.createIndexes([
      { analysisType: 1, createdAt: -1 },
      { 'metadata.createdBy': 1 },
      { 'results.rSquared': -1 },
      { createdAt: -1 }
    ]);
    
    await Dataset.createIndexes([
      { name: 1 },
      { 'metadata.uploadedBy': 1 },
      { 'metadata.tags': 1 },
      { createdAt: -1 }
    ]);
    
    await UserSession.createIndexes([
      { sessionId: 1 },
      { lastActivity: -1 }
    ]);
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  createIndexes
};