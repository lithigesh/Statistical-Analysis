// server/src/utils/statistics.js

/**
 * Calculate the probability density function for normal distribution
 * @param {number} x - The value to calculate PDF for
 * @param {number} mean - The mean of the distribution
 * @param {number} stdDev - The standard deviation of the distribution
 * @returns {number} The probability density at x
 */
function normalPdf(x, mean, stdDev) {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

/**
 * Calculate factorial of a number
 * @param {number} num - The number to calculate factorial for
 * @returns {number} The factorial of num
 */
function factorial(num) {
  if (num <= 1) return 1;
  return num * factorial(num - 1);
}

/**
 * Calculate the probability mass function for binomial distribution
 * @param {number} k - Number of successes
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} The probability mass at k
 */
function binomialPmf(k, n, p) {
  const coefficient = factorial(n) / (factorial(k) * factorial(n - k));
  return coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Calculate the probability mass function for Poisson distribution
 * @param {number} k - Number of events
 * @param {number} lambda - Rate parameter
 * @returns {number} The probability mass at k
 */
function poissonPmf(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculate the probability density function for exponential distribution
 * @param {number} x - The value to calculate PDF for
 * @param {number} lambda - Rate parameter
 * @returns {number} The probability density at x
 */
function exponentialPdf(x, lambda) {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
}

/**
 * Approximation of t-distribution CDF
 * @param {number} t - The t-statistic
 * @param {number} df - Degrees of freedom
 * @returns {number} Approximated CDF value
 */
function tCdf(t, df) {
  // Simplified approximation - in production, use a proper statistical library
  return 0.5 + (t / Math.sqrt(df)) * 0.5;
}

/**
 * Calculate critical value for t-test based on significance level and degrees of freedom
 * @param {number} significanceLevel - The significance level (e.g., 0.05, 0.01, 0.1)
 * @param {number} df - Degrees of freedom
 * @returns {number} Critical value
 */
function getCriticalValue(significanceLevel, df) {
  if (significanceLevel === 0.05) {
    return df > 30 ? 1.96 : (df > 20 ? 2.086 : (df > 10 ? 2.228 : 2.776));
  } else if (significanceLevel === 0.01) {
    return df > 30 ? 2.576 : (df > 20 ? 2.845 : (df > 10 ? 3.169 : 3.747));
  } else {
    return df > 30 ? 1.645 : (df > 20 ? 1.725 : (df > 10 ? 1.812 : 2.132));
  }
}

/**
 * Calculate basic statistics for an array of numbers
 * @param {number[]} data - Array of numbers
 * @returns {object} Object containing mean, variance, and standard deviation
 */
function calculateBasicStats(data) {
  const n = data.length;
  const mean = data.reduce((sum, x) => sum + x, 0) / n;
  const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  return { mean, variance, stdDev, n };
}

/**
 * Calculate linear regression statistics
 * @param {number[]} xData - Array of x values
 * @param {number[]} yData - Array of y values
 * @returns {object} Regression analysis results
 */
function calculateLinearRegression(xData, yData) {
  const n = xData.length;
  const sumX = xData.reduce((sum, x) => sum + x, 0);
  const sumY = yData.reduce((sum, y) => sum + y, 0);
  const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
  const sumXX = xData.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yData.reduce((sum, y) => sum + y * y, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope and intercept
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = meanY - slope * meanX;

  // Calculate R-squared
  const totalSumSquares = sumYY - n * meanY * meanY;
  const residualSumSquares = yData.reduce((sum, y, i) => {
    const predicted = slope * xData[i] + intercept;
    return sum + Math.pow(y - predicted, 2);
  }, 0);
  const rSquared = 1 - (residualSumSquares / totalSumSquares);

  // Calculate correlation coefficient
  const correlation = Math.sqrt(rSquared) * (slope > 0 ? 1 : -1);

  return {
    slope,
    intercept,
    rSquared,
    correlation,
    n,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
  };
}

module.exports = {
  normalPdf,
  binomialPmf,
  poissonPmf,
  exponentialPdf,
  tCdf,
  getCriticalValue,
  calculateBasicStats,
  calculateLinearRegression,
  factorial
};