// src/api/modules/exercises.ts
import { api } from '../service';
import { 
  ExerciseResponse, 
  ExerciseSummaryResponse,
  ExerciseRequest, 
  ExerciseFilter,
  ExerciseCreateRequest
} from '../../types';
import { shouldUseMockFallback } from '../config';
import { MOCK_EXERCISES } from '../mockData';

interface PagedExerciseResponse {
  content: ExerciseResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const exercisesAPI = {
  // Search exercises with pagination
  search: async (filters: ExerciseFilter & { page?: number; size?: number }): Promise<PagedExerciseResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Build query parameters
      if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
      if (filters.maxDuration) queryParams.append('maxDuration', filters.maxDuration.toString());
      if (filters.focusAreaIds?.length) {
        filters.focusAreaIds.forEach(id => queryParams.append('focusAreaIds', id.toString()));
      }
      if (filters.page !== undefined) queryParams.append('page', filters.page.toString());
      if (filters.size !== undefined) queryParams.append('size', filters.size.toString());
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortDirection) queryParams.append('sortDirection', filters.sortDirection);

      return await api.get<PagedExerciseResponse>(`/exercises?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to search exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        // Return mock paged response
        const filtered = MOCK_EXERCISES.filter(exercise => {
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            return exercise.name.toLowerCase().includes(searchLower) ||
                   exercise.description.toLowerCase().includes(searchLower);
          }
          return true;
        });
        
        const page = filters.page || 0;
        const size = filters.size || 20;
        const start = page * size;
        const end = start + size;
        
        return {
          content: filtered.slice(start, end) as ExerciseResponse[],
          totalPages: Math.ceil(filtered.length / size),
          totalElements: filtered.length,
          size: size,
          number: page,
          first: page === 0,
          last: page === Math.ceil(filtered.length / size) - 1,
          empty: filtered.length === 0
        };
      }
      
      throw error;
    }
  },

  // Get all exercises (for backwards compatibility)
  getAll: async (): Promise<ExerciseResponse[]> => {
    try {
      return await api.get<ExerciseResponse[]>('/exercises/accessible');
    } catch (error) {
      console.error('Failed to fetch all exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES.map(e => ({
          ...e,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusAreas: e.focusAreas || [],
          hasDefaultEvaluationTemplate: false,
          usageCount: 0,
          popular: false,
          favorite: false,
          durationInfo: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
          public: true
        } as ExerciseResponse));
      }
      
      throw error;
    }
  },
  
  // Get all accessible exercises (no pagination)
  getAccessible: async (): Promise<ExerciseSummaryResponse[]> => {
    try {
      return await api.get<ExerciseSummaryResponse[]>('/exercises/accessible');
    } catch (error) {
      console.error('Failed to fetch accessible exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES.map(e => ({
          id: e.id,
          name: e.name,
          minimumDurationMinutes: e.minimumDurationMinutes,
          formattedMinimumDuration: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
          sourceLabel: e.createdByCoachName || 'Public',
          focusAreas: e.focusAreas || [],
          hasDefaultEvaluationTemplate: false,
          public: true
        }));
      }
      
      throw error;
    }
  },
  
  // Get popular exercises
  getPopular: async (limit: number = 10): Promise<ExerciseResponse[]> => {
    try {
      return await api.get<ExerciseResponse[]>(`/exercises/popular?limit=${limit}`);
    } catch (error) {
      console.error('Failed to fetch popular exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES
          .slice(0, limit)
          .map(e => ({
            ...e,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            focusAreas: e.focusAreas || [],
            hasDefaultEvaluationTemplate: false,
            usageCount: 0,
            popular: true,
            favorite: false,
            durationInfo: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
            public: true
          } as ExerciseResponse));
      }
      
      throw error;
    }
  },
  
  // Get exercise by ID
  getById: async (id: number): Promise<ExerciseResponse> => {
    try {
      return await api.get<ExerciseResponse>(`/exercises/${id}`);
    } catch (error) {
      console.error(`Failed to fetch exercise ${id}:`, error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        const mockExercise = MOCK_EXERCISES.find(e => e.id === id);
        if (!mockExercise) throw new Error('Exercise not found');
        return {
          ...mockExercise,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusAreas: mockExercise.focusAreas || [],
          hasDefaultEvaluationTemplate: false,
          usageCount: 0,
          popular: false,
          favorite: false,
          durationInfo: mockExercise.formattedMinimumDuration || `${mockExercise.minimumDurationMinutes} min`,
          public: true
        } as ExerciseResponse;
      }
      
      throw error;
    }
  },
  
  // Create exercise
  create: async (data: ExerciseCreateRequest): Promise<ExerciseResponse> => {
    try {
      return await api.post<ExerciseResponse>('/exercises', data);
    } catch (error) {
      console.error('Failed to create exercise:', error);
      throw error;
    }
  },
  
  // Update exercise
  update: async (id: number, data: ExerciseRequest): Promise<ExerciseResponse> => {
    try {
      return await api.put<ExerciseResponse>(`/exercises/${id}`, data);
    } catch (error) {
      console.error(`Failed to update exercise ${id}:`, error);
      throw error;
    }
  },
  
  // Delete exercise
  delete: async (id: number): Promise<void> => {
    try {
      return await api.delete<void>(`/exercises/${id}`);
    } catch (error) {
      console.error(`Failed to delete exercise ${id}:`, error);
      throw error;
    }
  },
  
  // Duplicate exercise
  duplicate: async (id: number, newName?: string): Promise<ExerciseResponse> => {
    try {
      const queryParams = newName ? `?newName=${encodeURIComponent(newName)}` : '';
      return await api.post<ExerciseResponse>(`/exercises/${id}/duplicate${queryParams}`);
    } catch (error) {
      console.error(`Failed to duplicate exercise ${id}:`, error);
      throw error;
    }
  },
  
  // Get exercises for lesson planning
  getForLessonPlanning: async (): Promise<ExerciseSummaryResponse[]> => {
    try {
      return await api.get<ExerciseSummaryResponse[]>('/exercises/lesson-planning');
    } catch (error) {
      console.error('Failed to fetch lesson planning exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES.slice(0, 8).map(e => ({
          id: e.id,
          name: e.name,
          minimumDurationMinutes: e.minimumDurationMinutes,
          formattedMinimumDuration: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
          sourceLabel: e.createdByCoachName || 'Public',
          focusAreas: e.focusAreas || [],
          hasDefaultEvaluationTemplate: false,
          public: true
        }));
      }
      
      throw error;
    }
  },
  
  // Keep old method name for backwards compatibility
  getLessonPlanning: async (): Promise<ExerciseSummaryResponse[]> => {
    return await exercisesAPI.getForLessonPlanning();
  },
  
  // Get custom exercises created by coach
  getCustom: async (): Promise<ExerciseResponse[]> => {
    try {
      return await api.get<ExerciseResponse[]>('/exercises/custom');
    } catch (error) {
      console.error('Failed to fetch custom exercises:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('No custom exercises available in development mode');
        return [];
      }
      
      throw error;
    }
  },

  // Get exercises by focus area
  getByFocusArea: async (focusAreaIds: number[]): Promise<ExerciseSummaryResponse[]> => {
    try {
      const queryParams = focusAreaIds.map(id => `focusAreaIds=${id}`).join('&');
      return await api.get<ExerciseSummaryResponse[]>(`/exercises/by-focus-area?${queryParams}`);
    } catch (error) {
      console.error('Failed to fetch exercises by focus area:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES
          .filter(e => e.focusAreas?.some(fa => focusAreaIds.includes(fa.id)))
          .map(e => ({
            id: e.id,
            name: e.name,
            minimumDurationMinutes: e.minimumDurationMinutes,
            formattedMinimumDuration: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
            sourceLabel: e.createdByCoachName || 'Public',
            focusAreas: e.focusAreas || [],
            hasDefaultEvaluationTemplate: false,
            public: true
          }));
      }
      
      throw error;
    }
  },

  // Get exercises by max duration
  getByDuration: async (maxDuration: number): Promise<ExerciseSummaryResponse[]> => {
    try {
      return await api.get<ExerciseSummaryResponse[]>(`/exercises/by-duration?maxDuration=${maxDuration}`);
    } catch (error) {
      console.error('Failed to fetch exercises by duration:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock exercises data for development');
        return MOCK_EXERCISES
          .filter(e => e.minimumDurationMinutes <= maxDuration)
          .map(e => ({
            id: e.id,
            name: e.name,
            minimumDurationMinutes: e.minimumDurationMinutes,
            formattedMinimumDuration: e.formattedMinimumDuration || `${e.minimumDurationMinutes} min`,
            sourceLabel: e.createdByCoachName || 'Public',
            focusAreas: e.focusAreas || [],
            hasDefaultEvaluationTemplate: false,
            public: true
          }));
      }
      
      throw error;
    }
  },

  // Seed default exercises (admin only)
  seedDefaults: async (): Promise<Record<string, string>> => {
    try {
      return await api.post<Record<string, string>>('/exercises/seed-defaults');
    } catch (error) {
      console.error('Failed to seed default exercises:', error);
      throw error;
    }
  }
};