// src/api/service.ts

import { API_BASE_URL } from "./config";

// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const BASE_URL = API_BASE_URL;
const IS_DEVELOPMENT = process.env.REACT_APP_ENV === 'development';

interface ApiRequestInit extends RequestInit {
  body?: any;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: ApiRequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from sessionStorage
    const token = sessionStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Convert body to JSON if it's an object
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          sessionStorage.removeItem('token');
          // Only reload in production, in development we want to see the error
          if (!IS_DEVELOPMENT) {
            window.location.reload();
          }
          throw new Error('Authentication failed - please log in again');
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE requests)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API Error [${options.method || 'GET'} ${url}]:`, error.message);
        
        // In development, show more detailed errors
        if (IS_DEVELOPMENT) {
          console.error('Full error details:', error);
        }
        
        throw error;
      }
      
      console.error(`API Error [${options.method || 'GET'} ${url}]:`, error);
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  // Utility method to check if we have a valid token
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // Method to set auth token manually
  setAuthToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Method to clear auth token
  clearAuthToken(): void {
    sessionStorage.removeItem('token');
  }

  // Method to check if API is reachable
  async healthCheck(): Promise<boolean> {
    try {
      // Try the dedicated health endpoint first
      await this.get('/health');
      return true;
    } catch (error) {
      try {
        // Fallback to simple health endpoint
        await this.get('/health/simple');
        return true;
      } catch (fallbackError) {
        console.warn('API health check failed:', error);
        return false;
      }
    }
  }

  // More detailed health check with information
  async getHealthStatus(): Promise<{ healthy: boolean; data?: any; error?: string }> {
    try {
      const data = await this.get('/health');
      return { healthy: true, data };
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export the configured API instance
export const api = new ApiService(BASE_URL);

// Export for testing or alternative configurations
export { ApiService };