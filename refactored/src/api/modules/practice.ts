import { api } from '../service';
import { PracticeSession, SceneEvaluation, Performer } from '../../types';

export const practiceAPI = {
  startPractice: (lessonId: number, presentPerformerIds: number[]): Promise<PracticeSession> =>
    api.post<PracticeSession>(`/lessons/${lessonId}/start-practice`, { presentPerformerIds }),
  
  endPractice: (sessionId: number): Promise<void> =>
    api.put<void>(`/practice-sessions/${sessionId}/end`),
  
  updateCurrentExercise: (sessionId: number, exerciseIndex: number): Promise<PracticeSession> =>
    api.put<PracticeSession>(`/practice-sessions/${sessionId}/current-exercise`, { exerciseIndex }),
  
  createEvaluation: (evaluation: Omit<SceneEvaluation, 'id'>): Promise<SceneEvaluation> =>
    api.post<SceneEvaluation>('/evaluations', evaluation),
  
  updateEvaluation: (id: number, evaluation: Partial<SceneEvaluation>): Promise<SceneEvaluation> =>
    api.put<SceneEvaluation>(`/evaluations/${id}`, evaluation),
  
  getSessionStats: (sessionId: number): Promise<any> =>
    api.get(`/practice-sessions/${sessionId}/stats`)
};