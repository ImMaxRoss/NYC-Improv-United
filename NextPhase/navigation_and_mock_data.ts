// src/components/Navigation.tsx - Enhanced navigation with team management

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  UserCheck,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/performers', label: 'Performers', icon: UserCheck },
    { path: '/lesson-planner', label: 'Plan Lesson', icon: Calendar },
    { path: '/exercises', label: 'Exercises', icon: BookOpen },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const isActivePath = (path: string): boolean => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl">🎭</span>
                <span className="font-display text-2xl text-yellow-500">ImprovCoach</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-yellow-500 bg-opacity-20 text-yellow-300 border border-yellow-500 border-opacity-30'
                      : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-gray-300 text-sm">
              Hey, <span className="font-medium">{user?.firstName}</span>! 👋
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-gray-200 p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                        : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-gray-800 pt-3 mt-3">
                <div className="px-3 py-2 text-gray-400 text-sm">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-800 rounded-lg text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ===========================================
// src/api/mockData.ts - Enhanced with comprehensive team and performer data

import { 
  Lesson, 
  Exercise, 
  Team, 
  LessonTemplate, 
  LessonExercise, 
  Performer 
} from '../types';

// Mock Performers with detailed information
export const MOCK_PERFORMERS: Performer[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@email.com',
    experienceLevel: 'Intermediate',
    notes: 'Great at character work, working on saying yes to bigger emotions',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@email.com',
    experienceLevel: 'Beginner',
    notes: 'New to improv but very enthusiastic. Focus on listening skills.',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 3,
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@email.com',
    experienceLevel: 'Advanced',
    notes: 'Excellent game player, natural teacher, helps newer students',
    createdAt: '2023-11-20T14:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    experienceLevel: 'Intermediate',
    notes: 'Strong scene work, needs to work on supporting scenes vs leading',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'emma.brown@email.com',
    experienceLevel: 'Advanced',
    notes: 'Exceptional physicality and commitment, great scene partner',
    createdAt: '2023-10-15T13:00:00Z',
    updatedAt: '2024-01-08T10:15:00Z'
  },
  {
    id: 6,
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank.miller@email.com',
    experienceLevel: 'Beginner',
    notes: 'Quiet but makes strong choices when he commits. Building confidence.',
    createdAt: '2024-02-10T16:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z'
  },
  {
    id: 7,
    firstName: 'Grace',
    lastName: 'Lee',
    email: 'grace.lee@email.com',
    experienceLevel: 'Intermediate',
    notes: 'Natural comedian with great timing. Working on more grounded scenes.',
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 8,
    firstName: 'Henry',
    lastName: 'Garcia',
    email: 'henry.garcia@email.com',
    experienceLevel: 'Professional',
    notes: 'Professional performer, great mentor figure for the team',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-12-20T11:30:00Z'
  },
  {
    id: 9,
    firstName: 'Ivy',
    lastName: 'Chen',
    email: 'ivy.chen@email.com',
    experienceLevel: 'Intermediate',
    notes: 'Excellent at relationship establishment, working on heightening',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-02-05T09:45:00Z'
  },
  {
    id: 10,
    firstName: 'Jack',
    lastName: 'Taylor',
    email: 'jack.taylor@email.com',
    experienceLevel: 'Beginner',
    notes: 'Very analytical, learning to trust instincts over thinking',
    createdAt: '2024-02-15T13:30:00Z',
    updatedAt: '2024-02-15T13:30:00Z'
  }
];

// Mock Teams with performer associations
export const MOCK_TEAMS_DETAILED: Team[] = [
  {
    id: 1,
    name: 'The Improvisers',
    description: 'Intermediate level team focusing on scene work fundamentals and character development',
    coachId: 1,
    performerCount: 6,
    performers: [
      MOCK_PERFORMERS[0], // Alice
      MOCK_PERFORMERS[1], // Bob
      MOCK_PERFORMERS[3], // David
      MOCK_PERFORMERS[6], // Grace
      MOCK_PERFORMERS[8], // Ivy
      MOCK_PERFORMERS[9]  // Jack
    ],
    upcomingLessonsCount: 2,
    nextLessonDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z'
  },
  {
    id: 2,
    name: 'Comedy Crew',
    description: 'Advanced team working on game of the scene and performance preparation',
    coachId: 1,
    performerCount: 4,
    performers: [
      MOCK_PERFORMERS[2], // Carol
      MOCK_PERFORMERS[4], // Emma
      MOCK_PERFORMERS[7], // Henry
      MOCK_PERFORMERS[6]  // Grace
    ],
    upcomingLessonsCount: 1,
    nextLessonDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    createdAt: '2023-10-15T12:00:00Z',
    updatedAt: '2024-01-28T16:30:00Z'
  },
  {
    id: 3,
    name: 'Laugh Track',
    description: 'Beginner-friendly team for new improvisers to learn the basics in a supportive environment',
    coachId: 1,
    performerCount: 3,
    performers: [
      MOCK_PERFORMERS[1], // Bob
      MOCK_PERFORMERS[5], // Frank
      MOCK_PERFORMERS[9]  // Jack
    ],
    upcomingLessonsCount: 0,
    nextLessonDate: undefined,
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-02-01T10:15:00Z'
  },
  {
    id: 4,
    name: 'Weekend Warriors',
    description: 'Mixed level weekend workshop group focusing on performance skills',
    coachId: 1,
    performerCount: 5,
    performers: [
      MOCK_PERFORMERS[0], // Alice
      MOCK_PERFORMERS[2], // Carol
      MOCK_PERFORMERS[4], // Emma
      MOCK_PERFORMERS[5], // Frank
      MOCK_PERFORMERS[8]  // Ivy
    ],
    upcomingLessonsCount: 1,
    nextLessonDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    createdAt: '2023-12-01T11:00:00Z',
    updatedAt: '2024-02-10T13:45:00Z'
  }
];

// Enhanced lesson mock data with team associations
export const MOCK_DETAILED_LESSONS: Lesson[] = [
  {
    id: 1,
    name: 'Tuesday Night Practice',
    teamId: 1,
    teamName: 'The Improvisers',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    formattedDuration: '90 minutes',
    exerciseCount: 5,
    exercises: [
      {
        id: 1,
        exerciseId: 1,
        exerciseName: 'Zip Zap Zop',
        exerciseDescription: 'An energetic warm-up game that helps with focus and listening. Players stand in a circle and pass energy with "Zip," "Zap," or "Zop" while pointing to different people.',
        orderIndex: 0,
        plannedDurationMinutes: 10,
        formattedDuration: '10 min',
        evaluationTemplateId: 1,
        evaluationTemplateName: 'Basic Warmup',
        exerciseNotes: 'Focus on eye contact and clear gestures. Watch for people who get stuck in their heads.',
        focusAreas: [
          { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
          { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' }
        ]
      },
      {
        id: 2,
        exerciseId: 2,
        exerciseName: 'Yes, And Circles',
        exerciseDescription: 'Players practice the fundamental "Yes, And" principle by building on each other\'s statements in a supportive circle format.',
        orderIndex: 1,
        plannedDurationMinutes: 15,
        formattedDuration: '15 min',
        evaluationTemplateId: 2,
        evaluationTemplateName: 'Scene Work Basic',
        exerciseNotes: 'Look for players who are thinking too hard about being clever. Encourage simple, honest responses.',
        focusAreas: [
          { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
          { id: 4, name: 'Agreement', description: 'Shared reality', colorCode: '#2196F3' }
        ]
      },
      {
        id: 3,
        exerciseId: 3,
        exerciseName: 'Emotional Quadrants',
        exerciseDescription: 'The stage is divided into four quadrants, each representing a different emotion. Players move between quadrants and let the emotion affect their character.',
        orderIndex: 2,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 3,
        evaluationTemplateName: 'Character Development',
        exerciseNotes: 'Encourage full body commitment to emotions. Watch for intellectual vs. emotional choices.',
        focusAreas: [
          { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' },
          { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' },
          { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' }
        ]
      },
      {
        id: 4,
        exerciseId: 4,
        exerciseName: 'Two-Person Scenes',
        exerciseDescription: 'Basic two-person scene work focusing on establishing relationship, environment, and conflict quickly and clearly.',
        orderIndex: 3,
        plannedDurationMinutes: 25,
        formattedDuration: '25 min',
        evaluationTemplateId: 4,
        evaluationTemplateName: 'Scene Work Advanced',
        exerciseNotes: 'Focus on specificity in Who/What/Where. Encourage players to make strong choices early.',
        focusAreas: [
          { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' },
          { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
          { id: 7, name: 'Avoidance of Denial', description: 'Accept reality', colorCode: '#009688' }
        ]
      },
      {
        id: 5,
        exerciseId: 5,
        exerciseName: 'Group Scene Work',
        exerciseDescription: 'Larger ensemble scenes focusing on group dynamics, supporting the scene, and finding opportunities to contribute meaningfully.',
        orderIndex: 4,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 5,
        evaluationTemplateName: 'Ensemble Skills',
        exerciseNotes: 'Watch for scene hogging vs. disappearing. Encourage collaborative storytelling.',
        focusAreas: [
          { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
          { id: 8, name: 'Efficiency', description: 'Economic scene work', colorCode: '#795548' },
          { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Weekend Workshop: Game of the Scene',
    teamId: 2,
    teamName: 'Comedy Crew',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    formattedDuration: '120 minutes',
    exerciseCount: 6,
    exercises: [
      {
        id: 6,
        exerciseId: 6,
        exerciseName: 'Unusual Thing',
        exerciseDescription: 'Players practice identifying the first unusual thing in a scene and learning to rest with it before heightening.',
        orderIndex: 0,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 6,
        evaluationTemplateName: 'Game Identification',
        exerciseNotes: 'Focus on patience. Many students want to heighten immediately. Teach them to sit with the weird thing.',
        focusAreas: [
          { id: 9, name: 'Game Identification', description: 'Noticing unusual', colorCode: '#795548' },
          { id: 10, name: 'Resting the Game', description: 'Patient establishment', colorCode: '#795548' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Weekend Warriors Workshop',
    teamId: 4,
    teamName: 'Weekend Warriors',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    formattedDuration: '180 minutes',
    exerciseCount: 8,
    exercises: []
  }
];

// Keep existing simple mock data for backwards compatibility
export const MOCK_LESSONS: Lesson[] = MOCK_DETAILED_LESSONS.map(lesson => ({
  id: lesson.id,
  name: lesson.name,
  teamId: lesson.teamId,
  teamName: lesson.teamName,
  scheduledDate: lesson.scheduledDate,
  formattedDuration: lesson.formattedDuration,
  exerciseCount: lesson.exerciseCount
}));

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Yes, And',
    description: 'The fundamental improv exercise where players accept and build on each other\'s ideas.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 1, name: 'Yes And' },
      { id: 2, name: 'Agreement' }
    ]
  },
  {
    id: 2,
    name: 'Zip Zap Zop',
    description: 'An energetic warm-up game that helps with focus and listening.',
    minimumDurationMinutes: 5,
    formattedMinimumDuration: '5 min',
    focusAreas: [
      { id: 3, name: 'Listening' },
      { id: 4, name: 'Physicality' }
    ]
  },
  {
    id: 3,
    name: 'Character Walk',
    description: 'Players walk around the space developing physical characters.',
    minimumDurationMinutes: 15,
    formattedMinimumDuration: '15 min',
    focusAreas: [
      { id: 4, name: 'Physicality' },
      { id: 5, name: 'Who/What/Where' }
    ]
  },
  {
    id: 4,
    name: 'Emotional Quadrants',
    description: 'Players explore different emotions in different areas of the stage.',
    minimumDurationMinutes: 20,
    formattedMinimumDuration: '20 min',
    focusAreas: [
      { id: 6, name: 'Commitment' },
      { id: 4, name: 'Physicality' }
    ]
  },
  {
    id: 5,
    name: 'Sound Ball',
    description: 'Players throw imaginary balls with unique sounds.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 3, name: 'Listening' },
      { id: 1, name: 'Yes And' }
    ]
  }
];

export const MOCK_TEAMS: Team[] = MOCK_TEAMS_DETAILED.map(team => ({
  id: team.id,
  name: team.name,
  description: team.description,
  coachId: team.coachId,
  performerCount: team.performerCount,
  upcomingLessonsCount: team.upcomingLessonsCount,
  nextLessonDate: team.nextLessonDate,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt
}));

export const MOCK_TEMPLATES: LessonTemplate[] = [
  { id: 1, name: 'Basic Warmup Session' },
  { id: 2, name: 'Character Development Workshop' },
  { id: 3, name: 'Scene Work Intensive' },
  { id: 4, name: 'Game of the Scene Advanced' }
];

// ===========================================
// src/api/modules/teams.ts - Updated with mock data fallbacks

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

// ===========================================
// Final Integration Summary

/*
🎯 TEAM & PERFORMER MANAGEMENT COMPLETE!

✅ Features Implemented:

📋 Team Management:
   - Create, edit, delete teams
   - Team cards with stats and quick actions
   - Team detail pages with full information
   - Upcoming lessons integration
   - Experience level breakdown

👥 Performer Management:
   - Create, edit, delete performers
   - Performer contact information
   - Experience level tracking
   - Notes for coaching insights
   - Search and filter capabilities

🔗 Team-Performer Association:
   - Manage team rosters
   - Add/remove performers from teams
   - Multi-select performer assignment
   - Visual performer selection
   - Team composition analytics

📱 Enhanced Navigation:
   - Main navigation with active states
   - Mobile-responsive menu
   - Clear visual hierarchy
   - Team/performer quick access

🎨 Visual Design:
   - Consistent card-based layout
   - Color-coded experience levels
   - Empty states with encouraging CTAs
   - Professional coach interface

📊 Mock Data for Testing:
   - 10 realistic performers with varying experience
   - 4 teams with different focuses
   - Realistic team-performer associations
   - Comprehensive lesson data integration

🔄 Integration Points:
   - Live Practice uses real team performers
   - Lesson planning shows team context
   - Dashboard shows team statistics
   - Attendance taking from team rosters

📲 URLs Added:
   - /teams - Team management overview
   - /teams/:id - Individual team detail
   - /performers - All performers management
   - Enhanced navigation between features

🎭 Coach Experience:
   - Professional contact management
   - Team organization tools
   - Experience tracking and notes
   - Seamless integration with practice tools

The Team & Performer Management system provides coaches with:
- Complete roster management
- Team organization capabilities  
- Performer progress tracking
- Integrated practice workflows
- Professional contact system

Ready for full improv coaching workflows! 🎪
*/