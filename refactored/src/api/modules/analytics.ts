import { api } from '../service';
import {
  AnalyticsFilter,
  PerformerProgress,
  TeamAnalytics,
  ExerciseEffectiveness,
  CoachingInsights
} from '../../types';

// Comprehensive Mock Analytics Data
const MOCK_PERFORMER_PROGRESS: PerformerProgress[] = [
  {
    performerId: 1,
    performerName: 'Alice Johnson',
    focusAreaScores: {
      'Yes And': { current: 3.4, previous: 3.1, trend: 'improving', evaluationCount: 8 },
      'Listening': { current: 3.7, previous: 3.5, trend: 'improving', evaluationCount: 7 },
      'Physicality': { current: 2.9, previous: 3.0, trend: 'declining', evaluationCount: 6 },
      'Commitment': { current: 3.8, previous: 3.8, trend: 'stable', evaluationCount: 9 },
      'Who/What/Where': { current: 3.2, previous: 2.8, trend: 'improving', evaluationCount: 5 }
    },
    overallProgress: 3.4,
    strengths: ['Strong emotional commitment', 'Excellent listening skills', 'Natural character work'],
    areasForGrowth: ['Physical expression', 'Scene initiation', 'Heightening choices'],
    attendanceRate: 0.92,
    lastEvaluated: '2024-02-20T18:30:00Z'
  },
  {
    performerId: 2,
    performerName: 'Bob Smith',
    focusAreaScores: {
      'Yes And': { current: 2.8, previous: 2.5, trend: 'improving', evaluationCount: 6 },
      'Agreement': { current: 3.1, previous: 3.0, trend: 'stable', evaluationCount: 7 },
      'Listening': { current: 2.6, previous: 2.9, trend: 'declining', evaluationCount: 5 },
      'Commitment': { current: 3.5, previous: 3.2, trend: 'improving', evaluationCount: 8 }
    },
    overallProgress: 3.0,
    strengths: ['Willing to take risks', 'Good scene partner', 'Improving confidence'],
    areasForGrowth: ['Listening under pressure', 'Finding specificity', 'Vocal variety'],
    attendanceRate: 0.85,
    lastEvaluated: '2024-02-18T19:15:00Z'
  },
  {
    performerId: 3,
    performerName: 'Carol Davis',
    focusAreaScores: {
      'Yes And': { current: 3.9, previous: 3.8, trend: 'improving', evaluationCount: 12 },
      'Game Identification': { current: 3.7, previous: 3.4, trend: 'improving', evaluationCount: 8 },
      'Heightening': { current: 3.8, previous: 3.6, trend: 'improving', evaluationCount: 9 },
      'Emotional Truth': { current: 3.6, previous: 3.7, trend: 'declining', evaluationCount: 7 },
      'Physicality': { current: 3.4, previous: 3.2, trend: 'improving', evaluationCount: 6 }
    },
    overallProgress: 3.7,
    strengths: ['Advanced game player', 'Natural leader', 'Excellent heightening'],
    areasForGrowth: ['Supporting newer players', 'Patience with game development'],
    attendanceRate: 0.96,
    lastEvaluated: '2024-02-22T20:00:00Z'
  },
  {
    performerId: 4,
    performerName: 'David Wilson',
    focusAreaScores: {
      'Who/What/Where': { current: 3.6, previous: 3.3, trend: 'improving', evaluationCount: 7 },
      'Agreement': { current: 3.4, previous: 3.5, trend: 'declining', evaluationCount: 8 },
      'Efficiency': { current: 3.1, previous: 2.9, trend: 'improving', evaluationCount: 6 },
      'Commitment': { current: 3.3, previous: 3.1, trend: 'improving', evaluationCount: 9 }
    },
    overallProgress: 3.3,
    strengths: ['Clear scene establishment', 'Good scene economy', 'Reliable partner'],
    areasForGrowth: ['Taking bigger emotional risks', 'Initiating more', 'Physical choices'],
    attendanceRate: 0.89,
    lastEvaluated: '2024-02-19T18:45:00Z'
  },
  {
    performerId: 5,
    performerName: 'Emma Brown',
    focusAreaScores: {
      'Physicality': { current: 3.8, previous: 3.6, trend: 'improving', evaluationCount: 10 },
      'Character Development': { current: 3.9, previous: 3.7, trend: 'improving', evaluationCount: 8 },
      'Commitment': { current: 4.0, previous: 3.9, trend: 'improving', evaluationCount: 11 },
      'Emotional Truth': { current: 3.7, previous: 3.8, trend: 'declining', evaluationCount: 7 }
    },
    overallProgress: 3.8,
    strengths: ['Exceptional physicality', 'Fearless commitment', 'Rich character work'],
    areasForGrowth: ['Vocal variety', 'Scene structure awareness'],
    attendanceRate: 0.94,
    lastEvaluated: '2024-02-21T19:30:00Z'
  }
];

const MOCK_TEAM_ANALYTICS: TeamAnalytics[] = [
  {
    teamId: 1,
    teamName: 'The Improvisers',
    performerCount: 6,
    averageScore: 3.3,
    scoreImprovement: 0.4,
    attendanceRate: 0.89,
    practicesCompleted: 14,
    evaluationsCompleted: 87,
    focusAreaBreakdown: {
      'Yes And': 3.2,
      'Listening': 3.1,
      'Physicality': 3.0,
      'Commitment': 3.6,
      'Who/What/Where': 3.4
    },
    strengthsAndWeaknesses: {
      strengths: [
        { area: 'Commitment', score: 3.6 },
        { area: 'Who/What/Where', score: 3.4 },
        { area: 'Yes And', score: 3.2 }
      ],
      weaknesses: [
        { area: 'Physicality', score: 3.0 },
        { area: 'Listening', score: 3.1 },
        { area: 'Agreement', score: 3.15 }
      ]
    },
    progressTrend: [
      { date: '2024-01-01', score: 2.8 },
      { date: '2024-01-15', score: 2.9 },
      { date: '2024-02-01', score: 3.1 },
      { date: '2024-02-15', score: 3.2 },
      { date: '2024-02-22', score: 3.3 }
    ]
  },
  {
    teamId: 2,
    teamName: 'Comedy Crew',
    performerCount: 4,
    averageScore: 3.6,
    scoreImprovement: 0.2,
    attendanceRate: 0.95,
    practicesCompleted: 8,
    evaluationsCompleted: 52,
    focusAreaBreakdown: {
      'Game Identification': 3.7,
      'Heightening': 3.8,
      'Yes And': 3.5,
      'Emotional Truth': 3.4,
      'Commitment': 3.9
    },
    strengthsAndWeaknesses: {
      strengths: [
        { area: 'Commitment', score: 3.9 },
        { area: 'Heightening', score: 3.8 },
        { area: 'Game Identification', score: 3.7 }
      ],
      weaknesses: [
        { area: 'Emotional Truth', score: 3.4 },
        { area: 'Listening', score: 3.3 },
        { area: 'Support Skills', score: 3.2 }
      ]
    },
    progressTrend: [
      { date: '2024-01-01', score: 3.3 },
      { date: '2024-01-15', score: 3.4 },
      { date: '2024-02-01', score: 3.5 },
      { date: '2024-02-15', score: 3.6 },
      { date: '2024-02-22', score: 3.6 }
    ]
  },
  {
    teamId: 3,
    teamName: 'Laugh Track',
    performerCount: 3,
    averageScore: 2.8,
    scoreImprovement: 0.6,
    attendanceRate: 0.82,
    practicesCompleted: 6,
    evaluationsCompleted: 28,
    focusAreaBreakdown: {
      'Yes And': 2.9,
      'Listening': 2.6,
      'Agreement': 3.0,
      'Basic Skills': 2.8,
      'Commitment': 2.7
    },
    strengthsAndWeaknesses: {
      strengths: [
        { area: 'Agreement', score: 3.0 },
        { area: 'Yes And', score: 2.9 },
        { area: 'Basic Skills', score: 2.8 }
      ],
      weaknesses: [
        { area: 'Listening', score: 2.6 },
        { area: 'Commitment', score: 2.7 },
        { area: 'Physicality', score: 2.5 }
      ]
    },
    progressTrend: [
      { date: '2024-01-15', score: 2.2 },
      { date: '2024-02-01', score: 2.4 },
      { date: '2024-02-15', score: 2.7 },
      { date: '2024-02-22', score: 2.8 }
    ]
  }
];

const MOCK_EXERCISE_EFFECTIVENESS: ExerciseEffectiveness[] = [
  {
    exerciseId: 1,
    exerciseName: 'Zip Zap Zop',
    usageCount: 18,
    averageRating: 4.2,
    effectivenessScore: 0.89,
    focusAreaImpact: {
      'Listening': 0.92,
      'Physicality': 0.78,
      'Basic Skills': 0.85
    },
    coachNotes: ['Great energy builder', 'Perfect warm-up', 'Reveals focus issues'],
    recommendedFor: ['Beginner', 'Warm-up', 'Energy Building'],
    timeSpentAverage: 8
  },
  {
    exerciseId: 2,
    exerciseName: 'Yes, And Circle',
    usageCount: 24,
    averageRating: 4.1,
    effectivenessScore: 0.87,
    focusAreaImpact: {
      'Yes And': 0.95,
      'Agreement': 0.88,
      'Listening': 0.82
    },
    coachNotes: ['Fundamental skill building', 'Easy to observe progress', 'Good for all levels'],
    recommendedFor: ['Beginner', 'Intermediate', 'Skill Building'],
    timeSpentAverage: 12
  },
  {
    exerciseId: 4,
    exerciseName: 'Two-Person Scene Work',
    usageCount: 16,
    averageRating: 3.9,
    effectivenessScore: 0.91,
    focusAreaImpact: {
      'Who/What/Where': 0.93,
      'Yes And': 0.89,
      'Character Development': 0.86,
      'Emotional Truth': 0.84
    },
    coachNotes: ['Core skill development', 'Great for coaching moments', 'Reveals individual strengths'],
    recommendedFor: ['Intermediate', 'Advanced', 'Scene Work'],
    timeSpentAverage: 25
  },
  {
    exerciseId: 8,
    exerciseName: 'Genre Replay',
    usageCount: 7,
    averageRating: 4.3,
    effectivenessScore: 0.85,
    focusAreaImpact: {
      'Character Development': 0.91,
      'Commitment': 0.88,
      'Physicality': 0.79
    },
    coachNotes: ['Advanced technique', 'Great for commitment', 'Builds performance skills'],
    recommendedFor: ['Advanced', 'Performance Prep'],
    timeSpentAverage: 18
  },
  {
    exerciseId: 3,
    exerciseName: 'Emotional Orchestra',
    usageCount: 11,
    averageRating: 3.8,
    effectivenessScore: 0.82,
    focusAreaImpact: {
      'Emotional Truth': 0.89,
      'Physicality': 0.85,
      'Commitment': 0.88
    },
    coachNotes: ['Breaks down emotional barriers', 'Good diagnostic tool', 'Can be overwhelming for beginners'],
    recommendedFor: ['Intermediate', 'Emotional Work'],
    timeSpentAverage: 10
  }
];

const MOCK_COACHING_INSIGHTS: CoachingInsights = {
  totalPractices: 28,
  totalEvaluations: 167,
  averageSessionLength: 95,
  mostUsedExercises: MOCK_EXERCISE_EFFECTIVENESS,
  teamPerformanceComparison: MOCK_TEAM_ANALYTICS,
  overallTeachingEffectiveness: 0.84,
  coachingStrengths: [
    'Clear exercise instructions',
    'Effective individual feedback',
    'Good energy management',
    'Strong scene work coaching',
    'Excellent at building safe space'
  ],
  areasForDevelopment: [
    'More advanced game work coaching',
    'Incorporating more physical exercises',
    'Balancing critique with encouragement',
    'Time management in sessions'
  ],
  monthlyActivity: [
    { month: 'Sep', practices: 8, evaluations: 45 },
    { month: 'Oct', practices: 12, evaluations: 68 },
    { month: 'Nov', practices: 10, evaluations: 52 },
    { month: 'Dec', practices: 6, evaluations: 28 },
    { month: 'Jan', practices: 14, evaluations: 89 },
    { month: 'Feb', practices: 11, evaluations: 73 }
  ]
};

export const analyticsAPI = {
  // Get overall coaching insights
  getCoachingInsights: async (filters: AnalyticsFilter): Promise<CoachingInsights> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get<CoachingInsights>(`/analytics/coaching-insights?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to fetch coaching insights, using mock data:', error);
      return MOCK_COACHING_INSIGHTS;
    }
  },

  // Get performer progress analytics
  getPerformerProgress: async (filters: AnalyticsFilter): Promise<PerformerProgress[]> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get<PerformerProgress[]>(`/analytics/performer-progress?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to fetch performer progress, using mock data:', error);
      // Filter by team if specified
      if (filters.teamIds && filters.teamIds.length > 0) {
        // In real implementation, this would filter based on team membership
        return MOCK_PERFORMER_PROGRESS.slice(0, 3);
      }
      return MOCK_PERFORMER_PROGRESS;
    }
  },

  // Get team analytics
  getTeamAnalytics: async (filters: AnalyticsFilter): Promise<TeamAnalytics[]> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get<TeamAnalytics[]>(`/analytics/team-analytics?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to fetch team analytics, using mock data:', error);
      // Filter by specified teams
      if (filters.teamIds && filters.teamIds.length > 0) {
        return MOCK_TEAM_ANALYTICS.filter(team => filters.teamIds!.includes(team.teamId));
      }
      return MOCK_TEAM_ANALYTICS;
    }
  },

  // Get exercise effectiveness data
  getExerciseEffectiveness: async (filters: AnalyticsFilter): Promise<ExerciseEffectiveness[]> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get<ExerciseEffectiveness[]>(`/analytics/exercise-effectiveness?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to fetch exercise effectiveness, using mock data:', error);
      return MOCK_EXERCISE_EFFECTIVENESS;
    }
  },

  // Get detailed performer analytics
  getPerformerDetail: async (performerId: number, filters: AnalyticsFilter): Promise<PerformerProgress> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      
      return await api.get<PerformerProgress>(`/analytics/performers/${performerId}?${queryString.toString()}`);
    } catch (error) {
      console.warn(`Failed to fetch performer ${performerId} details, using mock data:`, error);
      const mockPerformer = MOCK_PERFORMER_PROGRESS.find(p => p.performerId === performerId);
      if (!mockPerformer) throw new Error('Performer not found');
      return mockPerformer;
    }
  },

  // Get detailed team analytics
  getTeamDetail: async (teamId: number, filters: AnalyticsFilter): Promise<TeamAnalytics> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      
      return await api.get<TeamAnalytics>(`/analytics/teams/${teamId}?${queryString.toString()}`);
    } catch (error) {
      console.warn(`Failed to fetch team ${teamId} details, using mock data:`, error);
      const mockTeam = MOCK_TEAM_ANALYTICS.find(t => t.teamId === teamId);
      if (!mockTeam) throw new Error('Team not found');
      return mockTeam;
    }
  },

  // Export analytics report
  exportReport: async (filters: AnalyticsFilter, format: 'pdf' | 'csv' | 'xlsx' = 'pdf'): Promise<Blob> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      queryString.append('format', format);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get<Blob>(`/analytics/export?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to export analytics report:', error);
      throw error;
    }
  },

  // Get performance trends over time
  getPerformanceTrends: async (filters: AnalyticsFilter): Promise<Array<{
    date: string;
    teamAverages: Record<number, number>;
    overallAverage: number;
  }>> => {
    try {
      const queryString = new URLSearchParams();
      queryString.append('timeRange', filters.timeRange);
      if (filters.teamIds) {
        filters.teamIds.forEach(id => queryString.append('teamIds', id.toString()));
      }
      
      return await api.get(`/analytics/performance-trends?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to fetch performance trends, using mock data:', error);
      // Generate mock trend data
      const dates = ['2024-01-01', '2024-01-15', '2024-02-01', '2024-02-15', '2024-02-22'];
      return dates.map(date => ({
        date,
        teamAverages: {
          1: 3.0 + Math.random() * 0.5,
          2: 3.4 + Math.random() * 0.3,
          3: 2.6 + Math.random() * 0.4
        },
        overallAverage: 3.1 + Math.random() * 0.3
      }));
    }
  }
};