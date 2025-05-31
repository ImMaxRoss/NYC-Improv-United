// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/modules/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data in case API fails
const MOCK_USER: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  lessons: [],
  lessonTemplates: []
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          console.log('Checking authentication...');
          const profile = await authAPI.getProfile();
          setUser(profile);
        } catch (err) {
          console.error('Auth check failed:', err);
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      try {
        console.log('Fetching profile...');
        const profile = await authAPI.getProfile();
        console.log('Profile response:', profile);
        setUser(profile);
      } catch (profileError) {
        console.error('Profile fetch failed:', profileError);
        
        // If profile fetch fails but login succeeded, use mock data
        // This is a temporary workaround for the malformed JSON issue
        if (response.token) {
          console.warn('Using mock user data due to profile fetch error');
          setUser({ ...MOCK_USER, email });
          return { success: true };
        }
        
        throw profileError;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      // Check if it's the JSON parsing error
      if ((err as Error).message.includes('JSON')) {
        // If login technically succeeded (we have a token) but profile fetch failed
        const token = sessionStorage.getItem('token');
        if (token) {
          console.warn('Login succeeded but profile has malformed JSON, using mock data');
          setUser({ ...MOCK_USER, email });
          return { success: true };
        }
      }
      
      return { success: false, error: (err as Error).message };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log('Attempting registration...');
      const response = await authAPI.register(userData);
      console.log('Registration response:', {
        ...response,
        token: response.token ? '[RECEIVED]' : '[MISSING]'
      });
      
      // After successful registration, fetch the user profile
      try {
        console.log('Fetching profile after registration...');
        const profile = await authAPI.getProfile();
        console.log('Profile response after registration:', profile);
        setUser(profile);
        return { success: true };
      } catch (profileError) {
        console.error('Profile fetch failed after registration:', profileError);
        
        // If profile fetch fails but registration succeeded, create user from registration data
        if (response.token) {
          console.warn('Using registration data for user profile due to profile fetch error');
          const newUser: User = {
            id: response.coachId || Date.now(), // Use coachId from response or fallback
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            lessons: [],
            lessonTemplates: []
          };
          setUser(newUser);
          return { success: true };
        }
        
        throw profileError;
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};