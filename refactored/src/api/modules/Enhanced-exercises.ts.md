# src/api/modules/exercises.ts - Enhanced exercises API
```ts
import { api } from '../service';
import { ExerciseDetailed, ExerciseCreateRequest, ExerciseFilter } from '../../types';
import { MOCK_DETAILED_EXERCISES } from '../mockData';

export const exercisesAPI = {
  // Get all exercises with detailed information
  getAll: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/detailed');
    } catch (error) {
      console.warn('Failed to fetch detailed exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES;
    }
  },

  // Search exercises with advanced filtering
  search: async (filters: ExerciseFilter): Promise<ExerciseDetailed[]> => {
    try {
      const queryString = new URLSearchParams();
      
      // Build query parameters
      if (filters.searchTerm) queryString.append('searchTerm', filters.searchTerm);
      if (filters.difficulty) queryString.append('difficulty', filters.difficulty);
      if (filters.groupSize) queryString.append('groupSize', filters.groupSize);
      if (filters.maxDuration) queryString.append('maxDuration', filters.maxDuration.toString());
      if (filters.minDuration) queryString.append('minDuration', filters.minDuration.toString());
      if (filters.source && filters.source !== 'all') queryString.append('source', filters.source);
      if (filters.sortBy) queryString.append('sortBy', filters.sortBy);
      if (filters.sortDirection) queryString.append('sortDirection', filters.sortDirection);
      if (filters.focusAreaIds) {
        filters.focusAreaIds.forEach(id => queryString.append('focusAreaIds', id.toString()));
      }

      return await api.get<ExerciseDetailed[]>(`/exercises/search?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to search exercises, using mock data:', error);
      // Apply basic filtering to mock data
      return MOCK_DETAILED_EXERCISES.filter(exercise => {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const matches = 
            exercise.name.toLowerCase().includes(searchLower) ||
            exercise.description.toLowerCase().includes(searchLower);
          if (!matches) return false;
        }
        return true;
      });
    }
  },
  
  getPopular: async (limit: number = 10): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>(`/exercises/popular?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch popular exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES
        .filter(e => e.popular)
        .slice(0, limit);
    }
  },
  
  getById: async (id: number): Promise<ExerciseDetailed> => {
    try {
      return await api.get<ExerciseDetailed>(`/exercises/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch exercise ${id}, using mock data:`, error);
      const mockExercise = MOCK_DETAILED_EXERCISES.find(e => e.id === id);
      if (!mockExercise) throw new Error('Exercise not found');
      return mockExercise;
    }
  },
  
  create: (data: ExerciseCreateRequest): Promise<ExerciseDetailed> => 
    api.post<ExerciseDetailed>('/exercises', data),
  
  update: (id: number, data: Partial<ExerciseCreateRequest>): Promise<ExerciseDetailed> =>
    api.put<ExerciseDetailed>(`/exercises/${id}`, data),
  
  delete: (id: number): Promise<void> => api.delete<void>(`/exercises/${id}`),
  
  duplicate: (id: number, newName?: string): Promise<ExerciseDetailed> =>
    api.post<ExerciseDetailed>(`/exercises/${id}/duplicate`, { newName }),
    
  toggleFavorite: (id: number): Promise<ExerciseDetailed> =>
    api.post<ExerciseDetailed>(`/exercises/${id}/favorite`),
  
  getForLessonPlanning: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/lesson-planning');
    } catch (error) {
      console.warn('Failed to fetch lesson planning exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.slice(0, 8); // Return subset for lesson planning
    }
  },
  
  getCustom: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/custom');
    } catch (error) {
      console.warn('Failed to fetch custom exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.filter(e => !e.public);
    }
  },

  getFavorites: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/favorites');
    } catch (error) {
      console.warn('Failed to fetch favorite exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.filter(e => e.favorite);
    }
  },

  // Import/Export functionality
  exportExercises: async (exerciseIds?: number[]): Promise<Blob> => {
    try {
      const queryString = exerciseIds ? `?ids=${exerciseIds.join(',')}` : '';
      return await api.get<Blob>(`/exercises/export${queryString}`);
    } catch (error) {
      console.warn('Failed to export exercises:', error);
      throw error;
    }
  },

  importExercises: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post('/exercises/import', formData);
    } catch (error) {
      console.warn('Failed to import exercises:', error);
      throw error;
    }
  }
};
```