// src/api/modules/evaluations.ts
import { api } from '../service';
import { 
  EvaluationResponse, 
  EvaluationRequest,
  EvaluationUpdateRequest,
  EvaluationCriterion 
} from '../../types';
import { shouldUseMockFallback } from '../config';

export const evaluationsAPI = {
  // Get all evaluations for the authenticated coach
  getAllMyEvaluations: async (): Promise<EvaluationResponse[]> => {
    try {
      return await api.get<EvaluationResponse[]>('/evaluations');
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock evaluations data for development');
        return [];
      }
      throw error;
    }
  },

  // Get evaluation by ID
  getById: async (id: number): Promise<EvaluationResponse> => {
    try {
      return await api.get<EvaluationResponse>(`/evaluations/${id}`);
    } catch (error) {
      console.error(`Failed to fetch evaluation ${id}:`, error);
      throw error;
    }
  },

  // Create new evaluation
  create: async (data: EvaluationRequest): Promise<EvaluationResponse> => {
    try {
      return await api.post<EvaluationResponse>('/evaluations', data);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      throw error;
    }
  },

  // Update evaluation
  update: async (id: number, data: EvaluationUpdateRequest): Promise<EvaluationResponse> => {
    try {
      return await api.put<EvaluationResponse>(`/evaluations/${id}`, data);
    } catch (error) {
      console.error(`Failed to update evaluation ${id}:`, error);
      throw error;
    }
  },

  // Delete evaluation
  delete: async (id: number): Promise<void> => {
    try {
      return await api.delete<void>(`/evaluations/${id}`);
    } catch (error) {
      console.error(`Failed to delete evaluation ${id}:`, error);
      throw error;
    }
  },

  // Get evaluations by team
  getByTeam: async (teamId: number): Promise<EvaluationResponse[]> => {
    try {
      return await api.get<EvaluationResponse[]>(`/evaluations/team/${teamId}`);
    } catch (error) {
      console.error(`Failed to fetch evaluations for team ${teamId}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock evaluations data for development');
        return [];
      }
      throw error;
    }
  },

  // Export evaluations for team
  exportForTeam: async (
    teamId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<EvaluationResponse[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const url = `/evaluations/export/${teamId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await api.get<EvaluationResponse[]>(url);
    } catch (error) {
      console.error(`Failed to export evaluations for team ${teamId}:`, error);
      throw error;
    }
  },

  // Get default evaluation criteria (mock for now)
  getDefaultCriteria: async (): Promise<EvaluationCriterion[]> => {
    // This would ideally come from the backend
    return [
      { id: 'yes_and', name: 'Yes And', description: 'Accepting and building on offers', maxScore: 4 },
      { id: 'agreement', name: 'Agreement', description: 'Finding shared reality', maxScore: 4 },
      { id: 'who_what_where', name: 'Who/What/Where', description: 'Establishing context clearly', maxScore: 4 },
      { id: 'physicality', name: 'Physicality', description: 'Using body and space effectively', maxScore: 4 },
      { id: 'listening', name: 'Listening', description: 'Active attention and responsiveness', maxScore: 4 },
      { id: 'commitment', name: 'Commitment', description: 'Full engagement and follow-through', maxScore: 4 },
      { id: 'avoidance_of_denial', name: 'Avoidance of Denial', description: 'Accepting reality vs blocking', maxScore: 4 },
      { id: 'efficiency', name: 'Efficiency/Clarity', description: 'Economic scene work', maxScore: 4 }
    ];
  }
};