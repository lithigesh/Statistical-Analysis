// server/src/scripts/initDatabase.js
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const { 
  DistributionAnalysis, 
  HypothesisTest, 
  RegressionAnalysis, 
  Dataset, 
  UserSession 
} = require('../models/Analysis');

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Clearing existing data...');
    await Promise.all([
      DistributionAnalysis.deleteMany({}),
      HypothesisTest.deleteMany({}),
      RegressionAnalysis.deleteMany({}),
      Dataset.deleteMany({}),
      UserSession.deleteMany({})
    ]);
    
    console.log('Creating sample datasets...');
    const sampleDatasets = [
      {
        name: "Student Test Scores",
        description: "Test scores from a statistics class",
        data: [
          {
            variable: "scores",
            values: [85, 92, 78, 96, 83, 89, 94, 87, 91, 88, 82, 95, 90, 86, 93]
          }
        ],
        metadata: {
          source: "Educational Research",
          uploadedBy: "system",
          dataType: "numerical",
          variables: ["scores"],
          recordCount: 15,
          tags: ["education", "test-scores", "sample-data"]
        }
      },
      {
        name: "Sales Performance",
        description: "Monthly sales data for analysis",
        data: [
          {
            variable: "month",
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          {
            variable: "sales",
            values: [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 33000, 29000, 26000, 23000]
          }
        ],
        metadata: {
          source: "Business Data",
          uploadedBy: "system",
          dataType: "time-series",
          variables: ["month", "sales"],
          recordCount: 12,
          tags: ["business", "sales", "time-series"]
        }
      }
    ];
    
    await Dataset.insertMany(sampleDatasets);
    console.log('Sample datasets created');
    
    console.log('Creating sample distribution analyses...');
    const sampleDistributions = [
      {
        analysisType: 'normal',
        parameters: new Map([
          ['mean', 0],
          ['stdDev', 1]
        ]),
        dataPoints: generateNormalDistribution(0, 1),
        metadata: {
          numPoints: 200,
          range: { min: -4, max: 4 },
          createdBy: 'system',
          description: 'Standard normal distribution'
        }
      },
      {
        analysisType: 'normal',
        parameters: new Map([
          ['mean', 100],
          ['stdDev', 15]
        ]),
        dataPoints: generateNormalDistribution(100, 15),
        metadata: {
          numPoints: 200,
          range: { min: 40, max: 160 },
          createdBy: 'system',
          description: 'IQ score distribution'
        }
      }
    ];
    
    await DistributionAnalysis.insertMany(sampleDistributions);
    console.log('Sample distribution analyses created');
    
    console.log('Creating sample hypothesis tests...');
    const sampleTests = [
      {
        testType: 't-test',
        sampleData: [85, 92, 78, 96, 83, 89, 94, 87, 91, 88],
        populationMean: 85,
        significanceLevel: 0.05,
        results: {
          testStatistic: 2.15,
          pValue: 0.058,
          criticalValue: 2.262,
          rejectNull: false,
          interpretation: 'At α = 0.05, we fail to reject the null hypothesis.',
          sampleMean: 88.3,
          sampleSize: 10,
          sampleStdDev: 4.97
        },
        metadata: {
          createdBy: 'system',
          description: 'Test scores vs expected mean',
          tags: ['education', 'sample-test']
        }
      }
    ];
    
    await HypothesisTest.insertMany(sampleTests);
    console.log('Sample hypothesis tests created');
    
    console.log('Creating sample regression analyses...');
    const xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const yData = [2.1, 3.9, 6.2, 7.8, 10.1, 12.3, 13.8, 16.2, 18.1, 20.0];
    
    const sampleRegressions = [
      {
        analysisType: 'linear',
        xData,
        yData,
        results: {
          slope: 2.02,
          intercept: 0.15,
          rSquared: 0.995,
          correlation: 0.998,
          equation: 'y = 2.02x + 0.15',
          n: 10
        },
        predictions: xData.map((x, i) => ({
          x,
          yPredicted: 2.02 * x + 0.15,
          residual: yData[i] - (2.02 * x + 0.15)
        })),
        metadata: {
          createdBy: 'system',
          description: 'Linear relationship example',
          datasetName: 'Sample Linear Data',
          tags: ['linear', 'sample-data', 'correlation']
        }
      }
    ];
    
    await RegressionAnalysis.insertMany(sampleRegressions);
    console.log('Sample regression analyses created');
    
    console.log('Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   • Datasets: ${await Dataset.countDocuments()}`);
    console.log(`   • Distribution Analyses: ${await DistributionAnalysis.countDocuments()}`);
    console.log(`   • Hypothesis Tests: ${await HypothesisTest.countDocuments()}`);
    console.log(`   • Regression Analyses: ${await RegressionAnalysis.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

function generateNormalDistribution(mean, stdDev) {
  const dataPoints = [];
  const numPoints = 200;
  const rangeMultiplier = 4;
  
  const minX = mean - rangeMultiplier * stdDev;
  const maxX = mean + rangeMultiplier * stdDev;
  const step = (maxX - minX) / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const x = minX + i * step;
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    const y = coefficient * Math.exp(exponent);
    dataPoints.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) });
  }
  
  return dataPoints;
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };