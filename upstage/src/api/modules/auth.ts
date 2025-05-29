import { api } from '../service';
import { User } from '../../types';

interface LoginResponse {
  token: string;
  user?: User;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

export const authAPI = {
  // Login with email and password
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      
      // Store the token if login successful
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      
      // For development - if API fails, check for test user credentials
      if (email === 'johndoe@gmail.com' && password === 'password123') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        sessionStorage.setItem('token', mockToken);
        return {
          token: mockToken,
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@gmail.com'
          }
        };
      }
      
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      
      // Store the token if registration successful
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    try {
      return await api.get<User>('/coaches/profile');
    } catch (error) {
      console.error('Get profile API error:', error);
      
      // For development - if API fails, return mock user
      const token = sessionStorage.getItem('token');
      if (token) {
        return {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com'
        };
      }
      
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post<void>('/auth/logout');
    } catch (error) {
      console.warn('Logout API error (continuing anyway):', error);
    } finally {
      // Always clear local storage even if API call fails
      sessionStorage.removeItem('token');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh');
      
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      sessionStorage.removeItem('token');
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem('token');
  }
};