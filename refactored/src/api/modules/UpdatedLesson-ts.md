## src/api/modules/lessons.ts - Updated with detailed lesson fetching
```ts
import { api } from '../service';
import { Lesson, LessonTemplate } from '../../types';
import { MOCK_DETAILED_LESSONS, MOCK_LESSONS, MOCK_TEMPLATES } from '../mockData';

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
  
  getById: async (id: number): Promise<Lesson> => {
    try {
      return await api.get<Lesson>(`/lessons/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch lesson ${id}, using mock data:`, error);
      // Return detailed mock lesson for Live Practice testing
      const mockLesson = MOCK_DETAILED_LESSONS.find(l => l.id === id);
      if (mockLesson) {
        return mockLesson;
      }
      // Fallback to basic mock
      return {
        id,
        name: `Mock Lesson ${id}`,
        teamId: 1,
        teamName: 'Test Team',
        scheduledDate: new Date().toISOString(),
        formattedDuration: '60 minutes',
        exerciseCount: 3,
        exercises: [
          {
            id: 1,
            exerciseId: 1,
            exerciseName: 'Mock Exercise 1',
            exerciseDescription: 'A test exercise for development',
            orderIndex: 0,
            plannedDurationMinutes: 10,
            formattedDuration: '10 min',
            evaluationTemplateId: 1,
            evaluationTemplateName: 'Basic',
            exerciseNotes: 'This is a mock exercise for testing',
            focusAreas: [
              { id: 1, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' }
            ]
          }
        ]
      };
    }
  },
  
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