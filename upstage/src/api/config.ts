// src/api/config.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080/api' 
    : '/api'  // Relative path for production
);

export const API_CONFIG = {
  // Set to false to disable all mock fallbacks
  USE_MOCK_FALLBACKS: process.env.REACT_APP_USE_MOCKS === 'true',
  // USE_MOCK_FALLBACKS: process.env.REACT_APP_ENV === 'development' && process.env.REACT_APP_USE_MOCKS === 'true',
  
  // API timeouts
  REQUEST_TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Development flags
  LOG_API_CALLS: process.env.REACT_APP_ENV === 'development',
  SHOW_ERROR_DETAILS: process.env.REACT_APP_ENV === 'development',
};

// Helper function to determine if we should use mocks
export const shouldUseMockFallback = (error: Error): boolean => {
  // Only use mocks in development when explicitly enabled
  if (!API_CONFIG.USE_MOCK_FALLBACKS) {
    return false;
  }
  
  // Use mocks for connection errors (API not running)
  const connectionErrors = [
    'fetch', 
    'ECONNREFUSED', 
    'NetworkError',
    'Failed to fetch'
  ];
  
  return connectionErrors.some(errorType => 
    error.message.toLowerCase().includes(errorType.toLowerCase())
  );
};