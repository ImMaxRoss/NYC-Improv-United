# React TypeScript App File Structure

## Project Structure
```
src/
├── api/
│   ├── config.ts
│   ├── service.ts
│   └── modules/
│       ├── auth.ts
│       ├── lessons.ts
│       ├── exercises.ts
│       └── teams.ts
├── types/
│   └── index.ts
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useApi.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── Navigation.tsx
│   ├── StatCard.tsx
│   ├── UpcomingLesson.tsx
│   └── ExerciseCard.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── LessonPlanner.tsx
│   └── Login.tsx
├── App.tsx
└── index.tsx
```

## File Contents

### 1. `src/types/index.ts`
```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  lessons?: Lesson[];
  lessonTemplates?: LessonTemplate[];
}

export interface Team {
  id: number;
  name: string;
}

export interface FocusArea {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  minimumDurationMinutes: number;
  formattedMinimumDuration?: string;
  focusAreas?: FocusArea[];
  createdByCoachName?: string;
  plannedDurationMinutes?: number;
  orderIndex?: number;
}

export interface Lesson {
  id: number;
  name?: string;
  teamId?: number;
  teamName: string;
  scheduledDate: string;
  formattedDuration: string;
  exerciseCount: number;
  exercises?: LessonExercise[];
}

export interface LessonExercise {
  exerciseId: number;
  plannedDurationMinutes: number;
  orderIndex: number;
}

export interface LessonTemplate {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}
```

### 2. `src/api/config.ts`
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

### 3. `src/api/service.ts`
```typescript
import { API_BASE_URL } from './config';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = sessionStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        sessionStorage.removeItem('token');
        window.location.reload();
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      // Handle empty responses
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();
```

### 4. `src/api/modules/auth.ts`
```typescript
import { api } from '../service';
import { User, LoginResponse } from '../../types';

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    if (response.token) {
      sessionStorage.setItem('token', response.token);
    }
    return response;
  },
  
  getProfile: (): Promise<User> => api.get<User>('/coaches/profile'),
  
  logout: (): void => {
    sessionStorage.removeItem('token');
  }
};
```

### 5. `src/api/modules/lessons.ts`
```typescript
import { api } from '../service';
import { Lesson, LessonTemplate } from '../../types';
import { MOCK_LESSONS, MOCK_TEMPLATES } from '../mockData';

export const lessonsAPI = {
  getUpcoming: async (): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>('/lessons/upcoming');
    } catch (error) {
      console.warn('Failed to fetch upcoming lessons, using mock data:', error);
      return MOCK_LESSONS;
    }
  },
  
  getRecent: async (limit: number = 10): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>(`/lessons/recent?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch recent lessons, using mock data:', error);
      return MOCK_LESSONS.slice(0, limit);
    }
  },
  
  getById: (id: number): Promise<Lesson> => api.get<Lesson>(`/lessons/${id}`),
  create: (data: any): Promise<Lesson> => api.post<Lesson>('/lessons', data),
  update: (id: number, data: any): Promise<Lesson> => api.put<Lesson>(`/lessons/${id}`, data),
  delete: (id: number): Promise<void> => api.delete<void>(`/lessons/${id}`),
  addExercise: (lessonId: number, exerciseId: number, duration?: number): Promise<void> => 
    api.post<void>(`/lessons/${lessonId}/exercises?exerciseId=${exerciseId}${duration ? `&duration=${duration}` : ''}`),
  saveAsTemplate: (id: number): Promise<LessonTemplate> => api.post<LessonTemplate>(`/lessons/${id}/save-as-template`),
  
  getTemplates: async (): Promise<LessonTemplate[]> => {
    try {
      return await api.get<LessonTemplate[]>('/lessons/templates');
    } catch (error) {
      console.warn('Failed to fetch templates, using mock data:', error);
      return MOCK_TEMPLATES;
    }
  },
};
```

### 6. `src/api/modules/exercises.ts`
```typescript
import { api } from '../service';
import { Exercise } from '../../types';
import { MOCK_EXERCISES } from '../mockData';

export const exercisesAPI = {
  search: async (params: Record<string, any>): Promise<Exercise[]> => {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await api.get<Exercise[]>(`/exercises?${queryString}`);
    } catch (error) {
      console.warn('Failed to search exercises, using mock data:', error);
      return MOCK_EXERCISES;
    }
  },
  
  getPopular: async (limit: number = 10): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>(`/exercises/popular?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch popular exercises, using mock data:', error);
      return MOCK_EXERCISES.slice(0, limit);
    }
  },
  
  getById: (id: number): Promise<Exercise> => api.get<Exercise>(`/exercises/${id}`),
  create: (data: any): Promise<Exercise> => api.post<Exercise>('/exercises', data),
  
  getForLessonPlanning: async (): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>('/exercises/lesson-planning');
    } catch (error) {
      console.warn('Failed to fetch lesson planning exercises, using mock data:', error);
      return MOCK_EXERCISES;
    }
  },
  
  getCustom: async (): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>('/exercises/custom');
    } catch (error) {
      console.warn('Failed to fetch custom exercises, using mock data:', error);
      return MOCK_EXERCISES.filter(e => e.createdByCoachName);
    }
  },
};
```

### 7. `src/api/modules/teams.ts`
```typescript
import { api } from '../service';
import { Team } from '../../types';

export const teamsAPI = {
  getMyTeams: (): Promise<Team[]> => api.get<Team[]>('/teams'),
  create: (data: any): Promise<Team> => api.post<Team>('/teams', data),
  update: (id: number, data: any): Promise<Team> => api.put<Team>(`/teams/${id}`, data),
  delete: (id: number): Promise<void> => api.delete<void>(`/teams/${id}`),
};
```

### 8. `src/hooks/useApi.ts`
```typescript
import { useState, useEffect, DependencyList } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T = any>(
  apiCall: () => Promise<T>,
  dependencies: DependencyList = []
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message || 'An error occurred');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
};
```

### 9. `src/contexts/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/modules/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const profile = await authAPI.getProfile();
          setUser(profile);
        } catch (err) {
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const profile = await authAPI.getProfile();
      setUser(profile);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 10. `src/components/ui/Button.tsx`
```typescript
import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  children, 
  disabled,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center';
  const variants = {
    primary: 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-lg hover:shadow-xl disabled:bg-yellow-600',
    secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
```

### 11. `src/components/ui/Card.tsx`
```typescript
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className = '', children, hoverable = false, onClick }) => {
  const hoverClasses = hoverable ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : '';
  return (
    <div 
      className={`bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

### 12. `src/components/ui/LoadingSpinner.tsx`
```typescript
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
  </div>
);
```

### 13. `src/components/ui/ErrorMessage.tsx`
```typescript
import React from 'react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-400">
    <p>Error: {error}</p>
  </div>
);
```

### 14. `src/components/Navigation.tsx`
```typescript
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎭</span>
                <span className="font-display text-2xl text-yellow-500">ImprovCoach</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-300">Hey, {user?.firstName}! 👋</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

### 15. `src/components/StatCard.tsx`
```typescript
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-20 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};
```

### 16. `src/components/UpcomingLesson.tsx`
```typescript
import React from 'react';
import { Calendar } from 'lucide-react';
import { Lesson } from '../types';

interface UpcomingLessonProps {
  lesson: Lesson;
}

export const UpcomingLesson: React.FC<UpcomingLessonProps> = ({ lesson }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-yellow-500" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-gray-100 font-medium">{lesson.name || `${lesson.teamName} Practice`}</h4>
        <p className="text-gray-400 text-sm">
          {lesson.teamName} • {formatDate(lesson.scheduledDate)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{lesson.formattedDuration}</p>
        <p className="text-gray-500 text-xs">{lesson.exerciseCount} exercises</p>
      </div>
    </div>
  );
};
```

### 17. `src/components/ExerciseCard.tsx`
```typescript
import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Exercise } from '../types';
import { Card } from './ui/Card';

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAdd }) => {
  const focusAreaColors: Record<string, string> = {
    'Yes And': 'bg-green-500',
    'Listening': 'bg-red-500',
    'Who/What/Where': 'bg-orange-500',
    'Physicality': 'bg-purple-500',
    'Agreement': 'bg-blue-500',
    'Commitment': 'bg-indigo-500',
  };

  return (
    <Card hoverable className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-100">{exercise.name}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {exercise.formattedMinimumDuration || `${exercise.minimumDurationMinutes} min`}
          </div>
          {onAdd && (
            <button
              onClick={() => onAdd(exercise)}
              className="text-yellow-500 hover:text-yellow-400"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{exercise.description}</p>
      <div className="flex flex-wrap gap-2">
        {exercise.focusAreas?.map((area, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium text-gray-900 ${
              focusAreaColors[area.name] || 'bg-gray-600'
            }`}
          >
            {area.name}
          </span>
        ))}
      </div>
      {exercise.createdByCoachName && (
        <p className="text-gray-500 text-xs mt-3">Created by {exercise.createdByCoachName}</p>
      )}
    </Card>
  );
};
```

### 18. `src/pages/Login.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  // Add fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Lato', sans-serif;
        background-color: rgb(17 24 39);
      }
      
      .font-display {
        font-family: 'Playfair Display', serif;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-bounce {
        animation: bounce 2s infinite;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-4xl font-display font-bold text-yellow-500 mb-2">ImprovCoach</h1>
          <p className="text-gray-400">Where comedy meets coaching</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6">
            {error && <ErrorMessage error={error} />}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                placeholder="johndoe@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">Test credentials prefilled</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
```

### 19. `src/pages/LessonPlanner.tsx`
```typescript
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { lessonsAPI } from '../api/modules/lessons';
import { exercisesAPI } from '../api/modules/exercises';
import { teamsAPI } from '../api/modules/teams';
import { useApi } from '../hooks/useApi';
import { Exercise } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ExerciseCard } from '../components/ExerciseCard';

export const LessonPlanner: React.FC = () => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [lessonName, setLessonName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [saving, setSaving] = useState(false);
  
  const { data: exercises, loading: exercisesLoading } = useApi(() => exercisesAPI.getForLessonPlanning());
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());

  const totalDuration = selectedExercises.reduce((sum, ex) => sum + (ex.plannedDurationMinutes || ex.minimumDurationMinutes), 0);

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      ...exercise,
      plannedDurationMinutes: exercise.minimumDurationMinutes,
      orderIndex: selectedExercises.length
    }]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSaveLesson = async () => {
    if (!lessonName || selectedExercises.length === 0) {
      alert('Please add a lesson name and at least one exercise');
      return;
    }

    setSaving(true);
    try {
      const lessonData = {
        name: lessonName,
        teamId: selectedTeam ? parseInt(selectedTeam) : null,
        scheduledDate: scheduledDate || null,
        exercises: selectedExercises.map((ex, index) => ({
          exerciseId: ex.id,
          plannedDurationMinutes: ex.plannedDurationMinutes,
          orderIndex: index
        }))
      };

      await lessonsAPI.create(lessonData);
      alert('Lesson saved successfully!');
      
      // Reset form
      setLessonName('');
      setSelectedExercises([]);
      setScheduledDate('');
      setSelectedTeam('');
    } catch (error) {
      alert('Failed to save lesson: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-gray-100 mb-8">Plan Your Lesson</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lesson Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tuesday Night Practice"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team (Optional)
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    disabled={teamsLoading}
                  >
                    <option value="">No team</option>
                    {teams?.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Schedule Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-100">Exercises</h3>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Total: {totalDuration} minutes</span>
                <Button onClick={handleSaveLesson} loading={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Lesson
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {selectedExercises.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🦉</div>
                  <p className="text-gray-400">No exercises added yet!</p>
                  <p className="text-gray-500 text-sm">Browse the library and add some exercises to get started.</p>
                </div>
              ) : (
                selectedExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div className="text-gray-400 font-bold">{index + 1}</div>
                    <div className="flex-1">
                      <h4 className="text-gray-100 font-medium">{exercise.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <input
                          type="number"
                          value={exercise.plannedDurationMinutes}
                          onChange={(e) => {
                            const updated = [...selectedExercises];
                            updated[index].plannedDurationMinutes = parseInt(e.target.value) || exercise.minimumDurationMinutes;
                            setSelectedExercises(updated);
                          }}
                          min={exercise.minimumDurationMinutes}
                          className="w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100 text-sm"
                        />
                        <span className="text-gray-400 text-sm">minutes</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Exercise Library</h3>
            {exercisesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {exercises?.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onAdd={handleAddExercise}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
```

### 20. `src/pages/Dashboard.tsx`
```typescript
import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Star, Play, Plus, Search, Menu, X, LogOut, ChevronRight, Sparkles, Filter, Grid, List, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { lessonsAPI } from '../api/modules/lessons';
import { exercisesAPI } from '../api/modules/exercises';
import { teamsAPI } from '../api/modules/teams';
import { useApi } from '../hooks/useApi';
import { Navigation } from '../components/Navigation';
import { StatCard } from '../components/StatCard';
import { UpcomingLesson } from '../components/UpcomingLesson';
import { ExerciseCard } from '../components/ExerciseCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LessonPlanner } from './LessonPlanner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'planner'>('dashboard');
  
  const { data: upcomingLessons, loading: lessonsLoading } = useApi(() => lessonsAPI.getUpcoming());
  const { data: popularExercises, loading: exercisesLoading } = useApi(() => exercisesAPI.getPopular(5));
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());

  if (activeView === 'planner') {
    return (
      <>
        <Navigation />
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-4 ml-4 text-gray-400 hover:text-gray-200 flex items-center space-x-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span>Back to Dashboard</span>
        </button>
        <LessonPlanner />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-100">
            Welcome back, {user?.firstName}! <span className="inline-block animate-bounce">🎭</span>
          </h1>
          <p className="text-gray-400 mt-2">Ready to make some comedy magic happen?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Active Teams" 
            value={teams?.length || 0} 
            color="bg-yellow-500 text-yellow-500" 
          />
          <StatCard 
            icon={Calendar} 
            label="Upcoming Lessons" 
            value={upcomingLessons?.length || 0} 
            color="bg-red-500 text-red-500" 
          />
          <StatCard 
            icon={BookOpen} 
            label="Total Lessons" 
            value={user?.lessons?.length || 0} 
            color="bg-purple-500 text-purple-500" 
          />
          <StatCard 
            icon={Star} 
            label="Saved Templates" 
            value={user?.lessonTemplates?.length || 0} 
            color="bg-green-500 text-green-500" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            hoverable 
            className="p-6 cursor-pointer"
            onClick={() => setActiveView('planner')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                <Plus className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Plan New Lesson</h3>
                <p className="text-gray-400 text-sm">Create your next practice session</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-6 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500 bg-opacity-20 rounded-lg">
                <Play className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Start Practice</h3>
                <p className="text-gray-400 text-sm">Run a live session</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-6 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Browse Exercises</h3>
                <p className="text-gray-400 text-sm">Discover new activities</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Lessons & Popular Exercises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-100">Upcoming Lessons</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            {lessonsLoading ? (
              <LoadingSpinner />
            ) : upcomingLessons?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No upcoming lessons scheduled</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setActiveView('planner')}
                >
                  Plan a Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingLessons?.slice(0, 3).map((lesson) => (
                  <UpcomingLesson key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-100">Popular Exercises</h2>
              <Button variant="ghost" size="sm">Browse All</Button>
            </div>
            {exercisesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {popularExercises?.slice(0, 3).map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};
```

### 21. `src/App.tsx`
```typescript
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? <Dashboard /> : <Login />;
};

export default App;
```

### 22. `src/index.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### 23. `src/index.css`
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## Setup Instructions

1. Create a new React app with TypeScript:
```bash
npx create-react-app improv-coach-app --template typescript
cd improv-coach-app
```

2. Install dependencies:
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. Replace the default src folder with the structure above

5. Start the development server:
```bash
npm start
```
____

###  updated API service 
```typescript
// src/api/service.ts
import { API_BASE_URL } from './config';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = sessionStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(`Making request to: ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        sessionStorage.removeItem('token');
        window.location.reload();
      }

      // Log response details for debugging
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, response.headers);

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // If error response is not JSON
          const textError = await response.text();
          console.error('Error response text:', textError);
          errorMessage = `HTTP ${response.status}: ${textError || response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }

      // Try to get response as text first to debug
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Check if response is empty
      if (!responseText) {
        console.warn('Empty response body');
        return null as T;
      }

      // Try to parse JSON
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response:', data);
        return data;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Invalid JSON:', responseText);
        
        // Check if it's a known issue pattern
        if (responseText.includes('""') || responseText.includes(':]')) {
          console.error('Response contains malformed JSON patterns');
        }
        
        throw new Error(`Invalid JSON response from server: ${(parseError as Error).message}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();```

## Updated AuthContext.tsx
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/modules/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
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

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```


### New File `src/api/mockData.ts`
```typescript
import { Lesson, Exercise, Team, LessonTemplate } from '../types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 1,
    name: 'Tuesday Night Practice',
    teamId: 1,
    teamName: 'The Improvisers',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    formattedDuration: '90 minutes',
    exerciseCount: 5
  },
  {
    id: 2,
    name: 'Weekend Workshop',
    teamId: 2,
    teamName: 'Comedy Crew',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    formattedDuration: '120 minutes',
    exerciseCount: 8
  }
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Yes, And',
    description: 'The fundamental improv exercise where players accept and build on each other\'s ideas.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 1, name: 'Yes And' },
      { id: 2, name: 'Agreement' }
    ]
  },
  {
    id: 2,
    name: 'Zip Zap Zop',
    description: 'An energetic warm-up game that helps with focus and listening.',
    minimumDurationMinutes: 5,
    formattedMinimumDuration: '5 min',
    focusAreas: [
      { id: 3, name: 'Listening' },
      { id: 4, name: 'Physicality' }
    ]
  },
  {
    id: 3,
    name: 'Character Walk',
    description: 'Players walk around the space developing physical characters.',
    minimumDurationMinutes: 15,
    formattedMinimumDuration: '15 min',
    focusAreas: [
      { id: 4, name: 'Physicality' },
      { id: 5, name: 'Who/What/Where' }
    ]
  },
  {
    id: 4,
    name: 'Emotional Quadrants',
    description: 'Players explore different emotions in different areas of the stage.',
    minimumDurationMinutes: 20,
    formattedMinimumDuration: '20 min',
    focusAreas: [
      { id: 6, name: 'Commitment' },
      { id: 4, name: 'Physicality' }
    ]
  },
  {
    id: 5,
    name: 'Sound Ball',
    description: 'Players throw imaginary balls with unique sounds.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 3, name: 'Listening' },
      { id: 1, name: 'Yes And' }
    ]
  }
];

export const MOCK_TEAMS: Team[] = [
  { id: 1, name: 'The Improvisers' },
  { id: 2, name: 'Comedy Crew' },
  { id: 3, name: 'Laugh Track' }
];

export const MOCK_TEMPLATES: LessonTemplate[] = [
  { id: 1, name: 'Basic Warmup Session' },
  { id: 2, name: 'Character Development Workshop' }
];
```

```ts
// src/api/modules/exercises.ts - Updated version
import { api } from '../service';
import { Exercise } from '../../types';
import { MOCK_EXERCISES } from '../mockData';

export const exercisesAPI = {
  search: async (params: Record<string, any>): Promise<Exercise[]> => {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await api.get<Exercise[]>(`/exercises?${queryString}`);
    } catch (error) {
      console.warn('Failed to search exercises, using mock data:', error);
      return MOCK_EXERCISES;
    }
  },
  
  getPopular: async (limit: number = 10): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>(`/exercises/popular?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch popular exercises, using mock data:', error);
      return MOCK_EXERCISES.slice(0, limit);
    }
  },
  
  getById: (id: number): Promise<Exercise> => api.get<Exercise>(`/exercises/${id}`),
  create: (data: any): Promise<Exercise> => api.post<Exercise>('/exercises', data),
  
  getForLessonPlanning: async (): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>('/exercises/lesson-planning');
    } catch (error) {
      console.warn('Failed to fetch lesson planning exercises, using mock data:', error);
      return MOCK_EXERCISES;
    }
  },
  
  getCustom: async (): Promise<Exercise[]> => {
    try {
      return await api.get<Exercise[]>('/exercises/custom');
    } catch (error) {
      console.warn('Failed to fetch custom exercises, using mock data:', error);
      return MOCK_EXERCISES.filter(e => e.createdByCoachName);
    }
  },
};
```

```ts
// src/api/modules/teams.ts - Updated version
import { api } from '../service';
import { Team } from '../../types';
import { MOCK_TEAMS } from '../mockData';

export const teamsAPI = {
  getMyTeams: async (): Promise<Team[]> => {
    try {
      return await api.get<Team[]>('/teams');
    } catch (error) {
      console.warn('Failed to fetch teams, using mock data:', error);
      return MOCK_TEAMS;
    }
  },
  
  create: (data: any): Promise<Team> => api.post<Team>('/teams', data),
  update: (id: number, data: any): Promise<Team> => api.put<Team>(`/teams/${id}`, data),
  delete: (id: number): Promise<void> => api.delete<void>(`/teams/${id}`),
};
```
