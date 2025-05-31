// src/api/modules/practice.ts
import { api } from '../service';
import { PracticeNoteResponse, PracticeSession, SceneEvaluation } from '../../types';
import { shouldUseMockFallback } from '../config';

export const practiceAPI = {
  startPractice: async (lessonId: number): Promise<PracticeSession> => {
    try {
      return await api.post<PracticeSession>('/practice/sessions', {
        lessonId
      });
    } catch (error) {
      console.error('Failed to start practice session:', error);
      throw error;
    }
  },

  endPractice: async (sessionId: number): Promise<PracticeSession> => {
    try {
      return await api.put<PracticeSession>(`/practice/sessions/${sessionId}/end`);
    } catch (error) {
      console.error(`Failed to end practice session ${sessionId}:`, error);
      throw error;
    }
  },

  updateCurrentExercise: async (sessionId: number, exerciseId: number): Promise<PracticeSession> => {
    try {
      return await api.put<PracticeSession>(`/practice/sessions/${sessionId}/exercise`, {
        exerciseId
      });
    } catch (error) {
      console.error(`Failed to update current exercise for session ${sessionId}:`, error);
      throw error;
    }
  },

  createEvaluation: async (evaluation: Omit<SceneEvaluation, 'id'>): Promise<SceneEvaluation> => {
    try {
      return await api.post<SceneEvaluation>('/practice/evaluations', evaluation);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      throw error;
    }
  },

  savePracticeNotes: async (lessonId: number, sessionId: number, notes: string, noteType: string = 'general'): Promise<PracticeNoteResponse> => {
    try {
      return await api.post<PracticeNoteResponse>('/practice/notes', {
        lessonId,
        sessionId,
        content: notes,
        noteType
      });
    } catch (error) {
      console.error(`Failed to save practice notes:`, error);
      throw error;
    }
  }
};