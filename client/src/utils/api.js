// client/src/utils/api.js

/**
 * Get the API base URL from environment variables
 * @returns {string} The complete API base URL
 */
export const getApiBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
  return `${apiBaseUrl}${apiPrefix}`;
};

/**
 * Make an API request with proper error handling
 * @param {string} endpoint - The API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise} The response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};