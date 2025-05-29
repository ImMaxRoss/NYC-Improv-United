// src/api/modules/practice.ts
import { api } from '../service';
import { PracticeSession, SceneEvaluation } from '../../types';

export const practiceAPI = {
  // Start a practice session
  startPractice: async (lessonId: number, performerIds: number[]): Promise<PracticeSession> => {
    try {
      return await api.post<PracticeSession>('/practice/start', {
        lessonId,
        performerIds
      });
    } catch (error) {
      console.warn('Failed to start practice session, using mock data:', error);
      // Return mock data for development
      return {
        id: Date.now(),
        lessonId,
        startTime: new Date().toISOString(),
        currentExerciseIndex: 0,
        presentPerformerIds: performerIds
      };
    }
  },

  // End a practice session
  endPractice: async (sessionId: number): Promise<void> => {
    try {
      await api.post<void>(`/practice/${sessionId}/end`);
    } catch (error) {
      console.warn('Failed to end practice session:', error);
      // Continue gracefully for development
    }
  },

  // Update current exercise
  updateCurrentExercise: async (sessionId: number, exerciseIndex: number): Promise<void> => {
    try {
      await api.put<void>(`/practice/${sessionId}/current-exercise`, {
        exerciseIndex
      });
    } catch (error) {
      console.warn('Failed to update current exercise:', error);
    }
  },

  // Create evaluation
  createEvaluation: async (evaluation: Omit<SceneEvaluation, 'id'>): Promise<SceneEvaluation> => {
    try {
      return await api.post<SceneEvaluation>('/practice/evaluations', evaluation);
    } catch (error) {
      console.warn('Failed to create evaluation, using mock data:', error);
      // Return mock data for development
      return {
        id: Date.now(),
        ...evaluation
      };
    }
  },

  // Update attendance
  updateAttendance: async (sessionId: number, performerIds: number[]): Promise<void> => {
    try {
      await api.put<void>(`/practice/${sessionId}/attendance`, {
        performerIds
      });
    } catch (error) {
      console.warn('Failed to update attendance:', error);
    }
  },

  // Save practice notes
  savePracticeNotes: async (sessionId: number, notes: string, noteType: string = 'general'): Promise<void> => {
    try {
      await api.post<void>(`/practice/${sessionId}/notes`, {
        content: notes,
        noteType
      });
    } catch (error) {
      console.warn('Failed to save practice notes:', error);
    }
  }
};