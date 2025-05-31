// src/api/modules/focusAreas.ts
import { api } from '../service';
import { FocusArea } from '../../types';
import { shouldUseMockFallback } from '../config';
import { MOCK_FOCUS_AREAS } from '../mockData';

export const focusAreasAPI = {
  getAll: async (): Promise<FocusArea[]> => {
    try {
      return await api.get<FocusArea[]>('/focus-areas');
    } catch (error) {
      console.error('Failed to fetch focus areas:', error);
      
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock focus areas data for development');
        return MOCK_FOCUS_AREAS;
      }
      
      throw error;
    }
  }
};