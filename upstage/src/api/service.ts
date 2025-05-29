// Base API configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
          window.location.reload(); // Force re-authentication
          throw new Error('Authentication failed');
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
}

// Export the configured API instance
export const api = new ApiService(BASE_URL);

// Export for testing or alternative configurations
export { ApiService };