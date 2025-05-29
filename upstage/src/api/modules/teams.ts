import { api } from '../service';
import { Team, TeamCreateRequest, Performer, PerformerCreateRequest } from '../../types';
import { MOCK_TEAMS_DETAILED, MOCK_PERFORMERS } from '../mockData';

export const teamsAPI = {
  // Team CRUD operations
  getMyTeams: async (): Promise<Team[]> => {
    try {
      return await api.get<Team[]>('/teams');
    } catch (error) {
      console.warn('Failed to fetch teams, using mock data:', error);
      return MOCK_TEAMS_DETAILED;
    }
  },
  
  getTeamById: async (id: number): Promise<Team> => {
    try {
      return await api.get<Team>(`/teams/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch team ${id}, using mock data:`, error);
      const mockTeam = MOCK_TEAMS_DETAILED.find(t => t.id === id);
      if (!mockTeam) throw new Error('Team not found');
      return mockTeam;
    }
  },
  
  getTeamWithPerformers: async (id: number): Promise<Team> => {
    try {
      return await api.get<Team>(`/teams/${id}/performers`);
    } catch (error) {
      console.warn(`Failed to fetch team ${id} with performers, using mock data:`, error);
      const mockTeam = MOCK_TEAMS_DETAILED.find(t => t.id === id);
      if (!mockTeam) throw new Error('Team not found');
      return mockTeam;
    }
  },
  
  createTeam: (data: TeamCreateRequest): Promise<Team> => api.post<Team>('/teams', data),
  
  updateTeam: (id: number, data: Partial<TeamCreateRequest>): Promise<Team> => 
    api.put<Team>(`/teams/${id}`, data),
  
  deleteTeam: (id: number): Promise<void> => api.delete<void>(`/teams/${id}`),
  
  // Performer management
  addPerformerToTeam: (teamId: number, performerId: number): Promise<void> =>
    api.post<void>(`/teams/${teamId}/performers/${performerId}`),
  
  removePerformerFromTeam: (teamId: number, performerId: number): Promise<void> =>
    api.delete<void>(`/teams/${teamId}/performers/${performerId}`),
  
  updateTeamPerformers: (teamId: number, performerIds: number[], operation: 'ADD' | 'REMOVE' | 'REPLACE'): Promise<Team> =>
    api.put<Team>(`/teams/${teamId}/performers`, { performerIds, operation })
};

export const performersAPI = {
  // Performer CRUD operations
  getMyPerformers: async (): Promise<Performer[]> => {
    try {
      return await api.get<Performer[]>('/performers');
    } catch (error) {
      console.warn('Failed to fetch performers, using mock data:', error);
      return MOCK_PERFORMERS;
    }
  },
  
  getPerformerById: async (id: number): Promise<Performer> => {
    try {
      return await api.get<Performer>(`/performers/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch performer ${id}, using mock data:`, error);
      const mockPerformer = MOCK_PERFORMERS.find(p => p.id === id);
      if (!mockPerformer) throw new Error('Performer not found');
      return mockPerformer;
    }
  },
  
  createPerformer: (data: PerformerCreateRequest): Promise<Performer> => 
    api.post<Performer>('/performers', data),
  
  updatePerformer: (id: number, data: Partial<PerformerCreateRequest>): Promise<Performer> =>
    api.put<Performer>(`/performers/${id}`, data),
  
  deletePerformer: (id: number): Promise<void> => api.delete<void>(`/performers/${id}`),
  
  searchPerformers: async (query: string): Promise<Performer[]> => {
    try {
      return await api.get<Performer[]>(`/performers/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.warn('Failed to search performers, using mock data:', error);
      return MOCK_PERFORMERS.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
        p.email?.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};