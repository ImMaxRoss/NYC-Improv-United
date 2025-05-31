import { api } from '../service';
import { Lesson, LessonTemplate, LessonRequest } from '../../types';
import { MOCK_DETAILED_LESSONS, MOCK_LESSONS, MOCK_TEMPLATES } from '../mockData';
import { shouldUseMockFallback } from '../config';

export const lessonsAPI = {
  getUpcoming: async (): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>('/lessons/upcoming');
    } catch (error) {
      console.error('Failed to fetch upcoming lessons:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_LESSONS;
      }
      throw error;
    }
  },
  
  getRecent: async (limit: number = 10): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>(`/lessons/recent?limit=${limit}`);
    } catch (error) {
      console.error('Failed to fetch recent lessons:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_LESSONS.slice(0, limit);
      }
      throw error;
    }
  },
  
  getById: async (id: number): Promise<Lesson> => {
    try {
      return await api.get<Lesson>(`/lessons/${id}`);
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        const mockLesson = MOCK_DETAILED_LESSONS.find(l => l.id === id);
        if (mockLesson) return mockLesson;
        throw new Error('Lesson not found in mock data');
      }
      throw error;
    }
  },
  
  create: async (data: LessonRequest): Promise<Lesson> => {
    try {
      return await api.post<Lesson>('/lessons', data);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: LessonRequest): Promise<Lesson> => {
    try {
      return await api.put<Lesson>(`/lessons/${id}`, data);
    } catch (error) {
      console.error(`Failed to update lesson ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      return await api.delete<void>(`/lessons/${id}`);
    } catch (error) {
      console.error(`Failed to delete lesson ${id}:`, error);
      throw error;
    }
  },
  
  addExercise: async (lessonId: number, exerciseId: number, duration?: number): Promise<void> => {
    try {
      return await api.post<void>(`/lessons/${lessonId}/exercises?exerciseId=${exerciseId}${duration ? `&duration=${duration}` : ''}`);
    } catch (error) {
      console.error(`Failed to add exercise to lesson ${lessonId}:`, error);
      throw error;
    }
  },
  
  saveAsTemplate: async (id: number): Promise<LessonTemplate> => {
    try {
      return await api.post<LessonTemplate>(`/lessons/${id}/save-as-template`);
    } catch (error) {
      console.error(`Failed to save lesson ${id} as template:`, error);
      throw error;
    }
  },
  
  getTemplates: async (): Promise<LessonTemplate[]> => {
    try {
      return await api.get<LessonTemplate[]>('/lessons/templates');
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_TEMPLATES;
      }
      throw error;
    }
  },

  // NEW: Create template directly (without saving lesson first)
  createTemplate: async (data: LessonRequest): Promise<LessonTemplate> => {
    try {
      return await api.post<LessonTemplate>('/lessons/templates', data);
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  },

  // NEW: Update existing template
  updateTemplate: async (templateId: number, data: Partial<LessonRequest>): Promise<LessonTemplate> => {
    try {
      return await api.put<LessonTemplate>(`/lessons/templates/${templateId}`, data);
    } catch (error) {
      console.error(`Failed to update template ${templateId}:`, error);
      throw error;
    }
  },

  // NEW: Delete template
  deleteTemplate: async (templateId: number): Promise<void> => {
    try {
      return await api.delete<void>(`/lessons/templates/${templateId}`);
    } catch (error) {
      console.error(`Failed to delete template ${templateId}:`, error);
      throw error;
    }
  },

  // Create lesson from template
  createFromTemplate: async (
    templateId: number, 
    scheduledDate: string, 
    customName?: string, 
    teamId?: number
  ): Promise<Lesson> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('scheduledDate', scheduledDate);
      if (customName) {
        queryParams.append('customName', customName);
      }
      if (teamId) {
        queryParams.append('teamId', teamId.toString());
      }
      
      return await api.post<Lesson>(`/lessons/templates/${templateId}/create-lesson?${queryParams.toString()}`);
    } catch (error) {
      console.error(`Failed to create lesson from template ${templateId}:`, error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock lesson creation for development - API not available');
        // Create a mock lesson based on template
        const template = MOCK_TEMPLATES.find(t => t.id === templateId);
        if (!template) throw new Error('Template not found in mock data');
        
        const mockLesson: Lesson = {
          id: Date.now(), // Generate mock ID
          coachId: template.coachId,
          teamId: teamId,
          teamName: teamId ? 'Mock Team' : undefined,
          name: customName || template.name,
          scheduledDate: scheduledDate,
          totalDurationMinutes: 90, // Mock duration
          formattedDuration: '90 minutes',
          workshopType: 'Practice',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          exercises: [], // Would be populated from template
          exerciseCount: template.exerciseCount || 0,
          scheduled: true,
          template: false,
          upcoming: true
        };
        return mockLesson;
      }
      
      throw error;
    }
  }
};