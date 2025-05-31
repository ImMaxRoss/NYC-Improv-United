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
  bio?: string;
  experience?: string;
  certifications?: string;
}

interface RegisterResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  coachId?: number;
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
      console.log('Attempting registration with data:', {
        ...userData,
        password: '[REDACTED]'
      });
      
      // Format data to match backend expectations (Coach object)
      const coachData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        bio: userData.bio || null,
        experience: userData.experience || null,
        certifications: userData.certifications || null
      };
      
      const response = await api.post<RegisterResponse>('/auth/register', coachData);
      console.log('Registration successful:', {
        ...response,
        token: response.token ? '[RECEIVED]' : '[MISSING]'
      });
      
      // Store the token if registration successful
      if (response.token) {
        sessionStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('409') || error.message.toLowerCase().includes('conflict')) {
          throw new Error('An account with this email already exists. Please use a different email or try logging in.');
        }
        if (error.message.includes('400') || error.message.toLowerCase().includes('bad request')) {
          throw new Error('Please check your information and try again. Make sure all required fields are filled out correctly.');
        }
        if (error.message.includes('500') || error.message.toLowerCase().includes('internal server')) {
          throw new Error('Server error occurred. Please try again in a few moments.');
        }
      }
      
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