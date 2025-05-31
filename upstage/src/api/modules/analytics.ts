// src/api/modules/analytics.ts
import { api } from '../service';
import { 
  CoachingInsights, 
  PerformerProgress, 
  TeamAnalytics, 
  AnalyticsFilter 
} from '../../types';
import { shouldUseMockFallback } from '../config';

export const analyticsAPI = {
  // Get coaching insights
  getCoachingInsights: async (filter: AnalyticsFilter): Promise<CoachingInsights> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('timeRange', filter.timeRange);
      if (filter.teamIds?.length) {
        filter.teamIds.forEach(id => queryParams.append('teamIds', id.toString()));
      }
      if (filter.focusAreaIds?.length) {
        filter.focusAreaIds.forEach(id => queryParams.append('focusAreaIds', id.toString()));
      }
      
      return await api.get<CoachingInsights>(`/analytics/coaching-insights?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to fetch coaching insights:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return {
          totalPractices: 15,
          totalEvaluations: 67,
          averageSessionLength: 75,
          mostUsedExercises: [],
          teamPerformanceComparison: [],
          overallTeachingEffectiveness: 0.85,
          coachingStrengths: ['Clear instruction delivery', 'Positive feedback approach'],
          areasForDevelopment: ['Scene analysis depth', 'Advanced technique coaching'],
          monthlyActivity: []
        };
      }
      throw error;
    }
  },

  // Get performer progress
  getPerformerProgress: async (filter: AnalyticsFilter): Promise<PerformerProgress[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('timeRange', filter.timeRange);
      if (filter.teamIds?.length) {
        filter.teamIds.forEach(id => queryParams.append('teamIds', id.toString()));
      }
      
      return await api.get<PerformerProgress[]>(`/analytics/performer-progress?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to fetch performer progress:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return [
          {
            performerId: 1,
            performerName: 'Alice Johnson',
            focusAreaScores: {
              'Yes And': { current: 3.5, previous: 3.2, trend: 'improving', evaluationCount: 5 },
              'Listening': { current: 3.8, previous: 3.6, trend: 'improving', evaluationCount: 4 }
            },
            overallProgress: 3.6,
            strengths: ['Yes And', 'Listening'],
            areasForGrowth: ['Physicality'],
            attendanceRate: 0.95,
            lastEvaluated: new Date().toISOString()
          }
        ];
      }
      throw error;
    }
  },

  // Get team analytics
  getTeamAnalytics: async (teamId: number, filter: AnalyticsFilter): Promise<TeamAnalytics> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('timeRange', filter.timeRange);
      
      return await api.get<TeamAnalytics>(`/analytics/teams/${teamId}?${queryParams.toString()}`);
    } catch (error) {
      console.error(`Failed to fetch team analytics for team ${teamId}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock data for development - API not available');
        return {
          teamId,
          teamName: 'Mock Team',
          performerCount: 6,
          averageScore: 3.4,
          scoreImprovement: 0.3,
          attendanceRate: 0.87,
          practicesCompleted: 12,
          evaluationsCompleted: 45,
          focusAreaBreakdown: {},
          strengthsAndWeaknesses: {
            strengths: [],
            weaknesses: []
          },
          progressTrend: []
        };
      }
      throw error;
    }
  }
};