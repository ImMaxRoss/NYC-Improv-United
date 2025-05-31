import { api } from '../service';
import { Team, TeamCreateRequest, Performer, PerformerCreateRequest } from '../../types';
import { MOCK_TEAMS_DETAILED, MOCK_PERFORMERS } from '../mockData';
import { shouldUseMockFallback } from '../config';

export const teamsAPI = {
  getMyTeams: async (): Promise<Team[]> => {
    try {
      return await api.get<Team[]>('/teams');
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_TEAMS_DETAILED;
      }
      throw error;
    }
  },
  
  getTeamById: async (id: number): Promise<Team> => {
    try {
      return await api.get<Team>(`/teams/${id}`);
    } catch (error) {
      console.error(`Failed to fetch team ${id}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        const mockTeam = MOCK_TEAMS_DETAILED.find(t => t.id === id);
        if (!mockTeam) throw new Error('Team not found');
        return mockTeam;
      }
      throw error;
    }
  },
  
  getTeamWithPerformers: async (id: number): Promise<Team> => {
    try {
      return await api.get<Team>(`/teams/${id}/performers`);
    } catch (error) {
      console.error(`Failed to fetch team ${id} with performers:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        const mockTeam = MOCK_TEAMS_DETAILED.find(t => t.id === id);
        if (!mockTeam) throw new Error('Team not found');
        return mockTeam;
      }
      throw error;
    }
  },
  
  createTeam: async (data: TeamCreateRequest): Promise<Team> => {
    try {
      return await api.post<Team>('/teams', data);
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  },
  
  updateTeam: async (id: number, data: Partial<TeamCreateRequest>): Promise<Team> => {
    try {
      return await api.put<Team>(`/teams/${id}`, data);
    } catch (error) {
      console.error(`Failed to update team ${id}:`, error);
      throw error;
    }
  },
  
  deleteTeam: async (id: number): Promise<void> => {
    try {
      return await api.delete<void>(`/teams/${id}`);
    } catch (error) {
      console.error(`Failed to delete team ${id}:`, error);
      throw error;
    }
  },
  
  addPerformerToTeam: async (teamId: number, performerId: number): Promise<void> => {
    try {
      return await api.post<void>(`/teams/${teamId}/performers/${performerId}`);
    } catch (error) {
      console.error(`Failed to add performer ${performerId} to team ${teamId}:`, error);
      throw error;
    }
  },
  
  removePerformerFromTeam: async (teamId: number, performerId: number): Promise<void> => {
    try {
      return await api.delete<void>(`/teams/${teamId}/performers/${performerId}`);
    } catch (error) {
      console.error(`Failed to remove performer ${performerId} from team ${teamId}:`, error);
      throw error;
    }
  },
  
  updateTeamPerformers: async (teamId: number, performerIds: number[], operation: 'ADD' | 'REMOVE' | 'REPLACE'): Promise<Team> => {
    try {
      return await api.put<Team>(`/teams/${teamId}/performers`, { performerIds, operation });
    } catch (error) {
      console.error(`Failed to update team ${teamId} performers:`, error);
      throw error;
    }
  }
};

export const performersAPI = {
  getMyPerformers: async (): Promise<Performer[]> => {
    try {
      return await api.get<Performer[]>('/performers');
    } catch (error) {
      console.error('Failed to fetch performers:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_PERFORMERS;
      }
      throw error;
    }
  },
  
  getPerformerById: async (id: number): Promise<Performer> => {
    try {
      return await api.get<Performer>(`/performers/${id}`);
    } catch (error) {
      console.error(`Failed to fetch performer ${id}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        const mockPerformer = MOCK_PERFORMERS.find(p => p.id === id);
        if (!mockPerformer) throw new Error('Performer not found');
        return mockPerformer;
      }
      throw error;
    }
  },
  
  createPerformer: async (data: PerformerCreateRequest): Promise<Performer> => {
    try {
      return await api.post<Performer>('/performers', data);
    } catch (error) {
      console.error('Failed to create performer:', error);
      throw error;
    }
  },
  
  updatePerformer: async (id: number, data: Partial<PerformerCreateRequest>): Promise<Performer> => {
    try {
      return await api.put<Performer>(`/performers/${id}`, data);
    } catch (error) {
      console.error(`Failed to update performer ${id}:`, error);
      throw error;
    }
  },
  
  deletePerformer: async (id: number): Promise<void> => {
    try {
      await api.delete<void>(`/performers/${id}`);
    } catch (error) {
      console.error(`Failed to delete performer ${id}:`, error);
      throw error;
    }
  },
  
  searchPerformers: async (query: string): Promise<Performer[]> => {
    try {
      return await api.get<Performer[]>(`/performers/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Failed to search performers:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return MOCK_PERFORMERS.filter(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          p.email?.toLowerCase().includes(query.toLowerCase())
        );
      }
      throw error;
    }
  }
};