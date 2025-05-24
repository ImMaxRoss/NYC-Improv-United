// src/api/mockData.ts - Enhanced with detailed exercise library data

import { ExerciseDetailed, FocusArea } from '../types';

// Comprehensive Focus Areas
export const MOCK_FOCUS_AREAS: FocusArea[] = [
  { id: 1, name: 'Yes And', description: 'Building on ideas and accepting offers', colorCode: '#4CAF50' },
  { id: 2, name: 'Agreement', description: 'Finding shared reality and understanding', colorCode: '#2196F3' },
  { id: 3, name: 'Who/What/Where', description: 'Establishing context and environment', colorCode: '#FF9800' },
  { id: 4, name: 'Physicality', description: 'Using body and space effectively', colorCode: '#9C27B0' },
  { id: 5, name: 'Listening', description: 'Active attention and responsiveness', colorCode: '#F44336' },
  { id: 6, name: 'Commitment', description: 'Full engagement and follow-through', colorCode: '#3F51B5' },
  { id: 7, name: 'Avoidance of Denial', description: 'Accepting and building reality', colorCode: '#009688' },
  { id: 8, name: 'Efficiency', description: 'Economic and purposeful scene work', colorCode: '#795548' },
  { id: 9, name: 'Game Identification', description: 'Noticing the unusual thing', colorCode: '#E91E63' },
  { id: 10, name: 'Resting the Game', description: 'Patiently establishing the pattern', colorCode: '#9C27B0' },
  { id: 11, name: 'Heightening', description: 'Escalating the unusual behavior', colorCode: '#FF5722' },
  { id: 12, name: 'Exploration', description: 'Finding all aspects of the game', colorCode: '#607D8B' },
  { id: 13, name: 'Emotional Truth', description: 'Genuine reactions within scenes', colorCode: '#E91E63' },
  { id: 14, name: 'Character Development', description: 'Creating distinct, believable people', colorCode: '#673AB7' },
  { id: 15, name: 'Improvisation Basics', description: 'Fundamental improv principles', colorCode: '#FFC107' }
];

// Comprehensive Exercise Library
export const MOCK_DETAILED_EXERCISES: ExerciseDetailed[] = [
  {
    id: 1,
    name: 'Zip Zap Zop',
    description: 'A classic improv warm-up game where players stand in a circle and pass energy using "Zip," "Zap," or "Zop" while pointing to different people. This exercise builds focus, energy, and group connection.',
    minimumDurationMinutes: 5,
    formattedMinimumDuration: '5 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[4], MOCK_FOCUS_AREAS[3], MOCK_FOCUS_AREAS[14]], // Listening, Physicality, Improvisation Basics
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Warm-up Basic',
    usageCount: 89,
    popular: true,
    favorite: true,
    durationInfo: '5-10 minutes ideal',
    public: true,
    difficulty: 'Easy',
    groupSize: 'Large Group',
    materials: [],
    instructions: `1. Have all players stand in a circle
2. Explain that they will pass energy around the circle using three words: "Zip," "Zap," or "Zop"
3. Start with just "Zip" - player points to someone else and says "Zip"
4. That person immediately points to another person and says "Zip"
5. After a few rounds, add "Zap" which reverses direction
6. Finally add "Zop" which passes to the person across the circle
7. Increase speed gradually
8. If someone hesitates or uses wrong word, they're out (optional)`,
    variations: [
      'Add more words like "Zoom" or "Zoop" with different rules',
      'Play with eyes closed for advanced groups',
      'Add physical gestures to each word',
      'Use gibberish words instead of Zip Zap Zop'
    ],
    tips: [
      'Start slow and build speed gradually',
      'Emphasize clear pointing and eye contact',
      'Watch for people overthinking - keep energy high',
      'Use this to gauge energy level of the group'
    ]
  },
  {
    id: 2,
    name: 'Yes, And Circle',
    description: 'Players practice the fundamental "Yes, And" principle by building on each other\'s statements in a supportive circle format. Each person accepts what came before and adds something new.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[0], MOCK_FOCUS_AREAS[1], MOCK_FOCUS_AREAS[4]], // Yes And, Agreement, Listening
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Scene Work Basic',
    usageCount: 156,
    popular: true,
    favorite: false,
    durationInfo: '10-15 minutes recommended',
    public: true,
    difficulty: 'Easy',
    groupSize: 'Small Group',
    materials: [],
    instructions: `1. Sit or stand in a circle
2. Start with a simple statement like "I'm going to the store"
3. Next person must say "Yes, and..." then add to the idea
4. Continue around the circle, each person accepting and building
5. Let ideas evolve naturally - don't force connections
6. If the scene gets too complex, start fresh with new idea
7. Practice multiple rounds with different starting statements`,
    variations: [
      'Use only gestures and "Yes, and" miming',
      'Tell a complete story as a group',
      'Each person can only add one word',
      'Focus on emotional building rather than plot'
    ],
    tips: [
      'Emphasize acceptance before adding new information',
      'Watch for disguised "No" statements like "Yes, but..."',
      'Encourage specificity in additions',
      'Model good "Yes, And" behavior as the coach'
    ]
  },
  {
    id: 3,
    name: 'Emotional Orchestra',
    description: 'The coach acts as a conductor, directing players to express different emotions through sound and movement. Players become an "orchestra" of emotions that can be mixed and controlled.',
    minimumDurationMinutes: 8,
    formattedMinimumDuration: '8 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[5], MOCK_FOCUS_AREAS[3], MOCK_FOCUS_AREAS[12]], // Commitment, Physicality, Emotional Truth
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Character Development',
    usageCount: 73,
    popular: false,
    favorite: true,
    durationInfo: '8-12 minutes ideal',
    public: true,
    difficulty: 'Medium',
    groupSize: 'Large Group',
    materials: [],
    instructions: `1. Assign each player or section an emotion (happy, sad, angry, excited, etc.)
2. Explain that they will express this emotion through sound and movement
3. As conductor, start with one emotion - point to that section
4. They begin expressing their emotion through sound/movement
5. Layer in other emotions by pointing to different sections
6. Use conducting gestures to control volume (louder/softer)
7. Practice blending emotions and creating emotional landscapes
8. End by bringing all emotions to silence`,
    variations: [
      'Assign specific characters instead of emotions',
      'Use different locations or weather patterns',
      'Have players switch emotions during the exercise',
      'Create specific emotional journey/story'
    ],
    tips: [
      'Encourage full-body commitment to emotions',
      'Watch for intellectual choices vs. felt emotions',
      'Use this to warm up emotional expression',
      'Great for breaking down emotional barriers'
    ]
  },
  {
    id: 4,
    name: 'Two-Person Scene Work',
    description: 'Basic two-person scene exercise focusing on establishing relationship, environment, and conflict quickly and clearly. The foundation of improv scene work.',
    minimumDurationMinutes: 20,
    formattedMinimumDuration: '20 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[2], MOCK_FOCUS_AREAS[0], MOCK_FOCUS_AREAS[6]], // Who/What/Where, Yes And, Avoidance of Denial
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Scene Work Advanced',
    usageCount: 134,
    popular: true,
    favorite: false,
    durationInfo: '20-30 minutes recommended',
    public: true,
    difficulty: 'Medium',
    groupSize: 'Pairs',
    materials: ['Chairs (optional)', 'Scene suggestion slips'],
    instructions: `1. Two players take the stage
2. Get a suggestion for location, relationship, or conflict from audience
3. Begin scene establishing Who (relationship), What (activity), Where (location)
4. Focus on making each other look good
5. Find the conflict or unusual thing in the scene
6. Explore and heighten that element
7. Find a natural ending
8. Side-coach if needed to help with specific skills
9. Debrief what worked well and areas for growth`,
    variations: [
      'Give specific constraints (only questions, no physical contact, etc.)',
      'Start scene in middle of action',
      'Practice specific relationship dynamics',
      'Focus on single scene element (just establishing where, etc.)'
    ],
    tips: [
      'Emphasize relationship over plot',
      'Look for players trying to be funny vs being truthful',
      'Stop and start scenes if needed for teaching moments',
      'Focus on making strong choices early'
    ]
  },
  {
    id: 5,
    name: 'Character Walks',
    description: 'Players develop physical characters by exploring different ways of moving through space. This exercise builds character awareness and physical expression skills.',
    minimumDurationMinutes: 12,
    formattedMinimumDuration: '12 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[3], MOCK_FOCUS_AREAS[13], MOCK_FOCUS_AREAS[5]], // Physicality, Character Development, Commitment
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Character Development',
    usageCount: 67,
    popular: false,
    favorite: false,
    durationInfo: '12-18 minutes ideal',
    public: true,
    difficulty: 'Medium',
    groupSize: 'Any',
    materials: ['Open space for movement'],
    instructions: `1. Have players spread out in the space
2. Start with normal walking to feel the space
3. Call out different character traits to embody while walking:
   - Age (very old, very young)
   - Physical conditions (injury, strength, etc.)
   - Emotional states (confidence, fear, excitement)
   - Occupations (construction worker, ballet dancer)
4. Let players explore each for 30-60 seconds
5. Combine traits (old + angry, young + scared)
6. Have players freeze and observe others
7. Practice walking as specific characters
8. End with players choosing one character to develop`,
    variations: [
      'Add character voices while walking',
      'Practice character interactions during walks',
      'Focus on one aspect (just hands, just posture)',
      'Use music to inspire character choices'
    ],
    tips: [
      'Encourage exaggeration to find truth',
      'Watch for stereotypical vs. specific choices',
      'Help players find characters in their own body',
      'Great for warming up physicality before scenes'
    ]
  },
  {
    id: 6,
    name: 'Word Association Chain',
    description: 'Players stand in a circle and quickly say the first word that comes to mind based on the previous word. Builds spontaneity and connection between ideas.',
    minimumDurationMinutes: 5,
    formattedMinimumDuration: '5 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[4], MOCK_FOCUS_AREAS[14]], // Listening, Improvisation Basics
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Warm-up Basic',
    usageCount: 45,
    popular: false,
    favorite: false,
    durationInfo: '5-8 minutes recommended',
    public: true,
    difficulty: 'Easy',
    groupSize: 'Small Group',
    materials: [],
    instructions: `1. Stand in a circle
2. First player says any word
3. Next player immediately says first word that comes to mind
4. Continue around circle quickly
5. Don't think - trust first instinct
6. If someone hesitates too long, move on
7. Notice interesting connections that emerge
8. Can restart with new word if chain gets stuck`,
    variations: [
      'Only use words of specific type (nouns, emotions, colors)',
      'Try to return to original word after set number',
      'Use gibberish sounds instead of words',
      'Add physical gestures with each word'
    ],
    tips: [
      'Emphasize speed over cleverness',
      'Watch for people trying to be funny',
      'Good diagnostic tool for group energy',
      'Stop if patterns become inappropriate'
    ]
  },
  {
    id: 7,
    name: 'Gibberish Translator',
    description: 'One player speaks in gibberish while their partner translates into English. Builds trust, commitment, and collaborative storytelling skills.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    createdByCoachId: 1,
    createdByCoachName: 'John Doe',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[5], MOCK_FOCUS_AREAS[0], MOCK_FOCUS_AREAS[4]], // Commitment, Yes And, Listening
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Partnership Skills',
    usageCount: 23,
    popular: false,
    favorite: true,
    durationInfo: '10-15 minutes ideal',
    public: false,
    difficulty: 'Medium',
    groupSize: 'Pairs',
    materials: [],
    instructions: `1. Pair up players - one is gibberish speaker, one is translator
2. Get a topic suggestion from group
3. Gibberish speaker begins talking about topic in made-up language
4. Translator listens to rhythm, emotion, and gesture to "translate"
5. Switch roles every 2-3 minutes
6. Encourage full commitment to the gibberish sounds
7. Translator should make speaker look smart and interesting
8. Focus on emotional content over literal meaning`,
    variations: [
      'Add third person who reacts to the translation',
      'Gibberish speaker plays specific character',
      'Use specific gibberish "languages" (angry, romantic, etc.)',
      'Translator can ask clarifying questions in gibberish'
    ],
    tips: [
      'Encourage musical, expressive gibberish',
      'Watch for translators making speaker look bad',
      'Great exercise for building trust between partners',
      'Use to practice supporting scene partners'
    ]
  },
  {
    id: 8,
    name: 'Genre Replay',
    description: 'Perform the same basic scene multiple times in different genres (horror, romance, comedy, etc.). Teaches how style and genre affect storytelling.',
    minimumDurationMinutes: 15,
    formattedMinimumDuration: '15 min',
    createdByCoachId: 1,
    createdByCoachName: 'John Doe',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[13], MOCK_FOCUS_AREAS[5], MOCK_FOCUS_AREAS[3]], // Character Development, Commitment, Physicality
    hasDefaultEvaluationTemplate: false,
    usageCount: 31,
    popular: false,
    favorite: false,
    durationInfo: '15-25 minutes recommended',
    public: false,
    difficulty: 'Hard',
    groupSize: 'Small Group',
    materials: ['Genre suggestion cards'],
    instructions: `1. Get a simple scene premise (location + activity)
2. Perform 2-3 minute scene in neutral style
3. Replay same scene in different genre (horror, romance, western, etc.)
4. Keep basic story elements but change tone, pacing, character motivations
5. Repeat with 3-4 different genres
6. Discuss how genre affected choices
7. Notice what stayed consistent vs what changed`,
    variations: [
      'Use specific movie or TV show styles',
      'Combine genres (romantic horror, comedy western)',
      'Let audience call out genre changes mid-scene',
      'Focus on single genre element (just music style, just lighting)'
    ],
    tips: [
      'Start with familiar, distinct genres',
      'Emphasize commitment to genre conventions',
      'Watch for parody vs. truthful representation',
      'Great for exploring how context shapes meaning'
    ]
  },
  {
    id: 9,
    name: 'Unusual Thing Identification',
    description: 'Advanced exercise for finding and developing the "game" of a scene. Players practice identifying what makes a scene unusual and worth exploring.',
    minimumDurationMinutes: 25,
    formattedMinimumDuration: '25 min',
    createdByCoachId: null,
    createdByCoachName: 'Community',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[8], MOCK_FOCUS_AREAS[9], MOCK_FOCUS_AREAS[11]], // Game Identification, Resting the Game, Exploration
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Game of Scene Advanced',
    usageCount: 19,
    popular: false,
    favorite: false,
    durationInfo: '25-35 minutes ideal',
    public: true,
    difficulty: 'Hard',
    groupSize: 'Pairs',
    materials: [],
    instructions: `1. Two players begin basic scene
2. When something unusual happens (weird behavior, strange reaction), freeze
3. Identify what was unusual about that moment
4. Restart scene and explore that unusual element
5. Practice "resting" with the weird thing before heightening
6. Let the unusual behavior become the engine of the scene
7. Side-coach to help players notice game opportunities
8. Debrief what made each moment worth exploring`,
    variations: [
      'Start with pre-established unusual behavior',
      'Practice different ways to heighten same game',
      'Have watchers call out when they see game',
      'Focus only on emotional game vs. behavioral game'
    ],
    tips: [
      'Teach patience - don\'t heighten immediately',
      'Help players see game in ordinary moments',
      'Most scenes have multiple potential games',
      'Focus on what\'s unusual for THAT character in THAT situation'
    ]
  },
  {
    id: 10,
    name: 'Mirroring Exercise',
    description: 'Two players face each other and mirror movements exactly. Builds connection, awareness, and nonverbal communication skills.',
    minimumDurationMinutes: 8,
    formattedMinimumDuration: '8 min',
    createdByCoachId: 1,
    createdByCoachName: 'John Doe',
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
    focusAreas: [MOCK_FOCUS_AREAS[4], MOCK_FOCUS_AREAS[3]], // Listening, Physicality
    hasDefaultEvaluationTemplate: true,
    defaultEvaluationTemplateName: 'Partnership Skills',
    usageCount: 41,
    popular: false,
    favorite: true,
    durationInfo: '8-12 minutes recommended',
    public: false,
    difficulty: 'Easy',
    groupSize: 'Pairs',
    materials: [],
    instructions: `1. Partners face each other, maintaining eye contact
2. One person leads with slow, deliberate movements
3. Partner mirrors movements exactly, like a reflection
4. Start with simple hand and arm movements
5. Progress to facial expressions and full body
6. Switch leader every 2-3 minutes
7. End with both leading/following simultaneously
8. Notice when you lose connection and reconnect`,
    variations: [
      'Mirror emotions instead of movements',
      'Add sound mirroring with movement',
      'Mirror in slow motion or different speeds',
      'Try to mirror without designating leader'
    ],
    tips: [
      'Emphasize connection over perfect mirroring',
      'Start very slow to build trust',
      'Watch for leaders trying to "trick" followers',
      'Great warm-up for partner scene work'
    ]
  }
];

// ===========================================
// src/api/modules/exercises.ts - Enhanced exercises API

import { api } from '../service';
import { ExerciseDetailed, ExerciseCreateRequest, ExerciseFilter } from '../../types';
import { MOCK_DETAILED_EXERCISES } from '../mockData';

export const exercisesAPI = {
  // Get all exercises with detailed information
  getAll: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/detailed');
    } catch (error) {
      console.warn('Failed to fetch detailed exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES;
    }
  },

  // Search exercises with advanced filtering
  search: async (filters: ExerciseFilter): Promise<ExerciseDetailed[]> => {
    try {
      const queryString = new URLSearchParams();
      
      // Build query parameters
      if (filters.searchTerm) queryString.append('searchTerm', filters.searchTerm);
      if (filters.difficulty) queryString.append('difficulty', filters.difficulty);
      if (filters.groupSize) queryString.append('groupSize', filters.groupSize);
      if (filters.maxDuration) queryString.append('maxDuration', filters.maxDuration.toString());
      if (filters.minDuration) queryString.append('minDuration', filters.minDuration.toString());
      if (filters.source && filters.source !== 'all') queryString.append('source', filters.source);
      if (filters.sortBy) queryString.append('sortBy', filters.sortBy);
      if (filters.sortDirection) queryString.append('sortDirection', filters.sortDirection);
      if (filters.focusAreaIds) {
        filters.focusAreaIds.forEach(id => queryString.append('focusAreaIds', id.toString()));
      }

      return await api.get<ExerciseDetailed[]>(`/exercises/search?${queryString.toString()}`);
    } catch (error) {
      console.warn('Failed to search exercises, using mock data:', error);
      // Apply basic filtering to mock data
      return MOCK_DETAILED_EXERCISES.filter(exercise => {
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const matches = 
            exercise.name.toLowerCase().includes(searchLower) ||
            exercise.description.toLowerCase().includes(searchLower);
          if (!matches) return false;
        }
        return true;
      });
    }
  },
  
  getPopular: async (limit: number = 10): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>(`/exercises/popular?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch popular exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES
        .filter(e => e.popular)
        .slice(0, limit);
    }
  },
  
  getById: async (id: number): Promise<ExerciseDetailed> => {
    try {
      return await api.get<ExerciseDetailed>(`/exercises/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch exercise ${id}, using mock data:`, error);
      const mockExercise = MOCK_DETAILED_EXERCISES.find(e => e.id === id);
      if (!mockExercise) throw new Error('Exercise not found');
      return mockExercise;
    }
  },
  
  create: (data: ExerciseCreateRequest): Promise<ExerciseDetailed> => 
    api.post<ExerciseDetailed>('/exercises', data),
  
  update: (id: number, data: Partial<ExerciseCreateRequest>): Promise<ExerciseDetailed> =>
    api.put<ExerciseDetailed>(`/exercises/${id}`, data),
  
  delete: (id: number): Promise<void> => api.delete<void>(`/exercises/${id}`),
  
  duplicate: (id: number, newName?: string): Promise<ExerciseDetailed> =>
    api.post<ExerciseDetailed>(`/exercises/${id}/duplicate`, { newName }),
    
  toggleFavorite: (id: number): Promise<ExerciseDetailed> =>
    api.post<ExerciseDetailed>(`/exercises/${id}/favorite`),
  
  getForLessonPlanning: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/lesson-planning');
    } catch (error) {
      console.warn('Failed to fetch lesson planning exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.slice(0, 8); // Return subset for lesson planning
    }
  },
  
  getCustom: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/custom');
    } catch (error) {
      console.warn('Failed to fetch custom exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.filter(e => !e.public);
    }
  },

  getFavorites: async (): Promise<ExerciseDetailed[]> => {
    try {
      return await api.get<ExerciseDetailed[]>('/exercises/favorites');
    } catch (error) {
      console.warn('Failed to fetch favorite exercises, using mock data:', error);
      return MOCK_DETAILED_EXERCISES.filter(e => e.favorite);
    }
  },

  // Import/Export functionality
  exportExercises: async (exerciseIds?: number[]): Promise<Blob> => {
    try {
      const queryString = exerciseIds ? `?ids=${exerciseIds.join(',')}` : '';
      return await api.get<Blob>(`/exercises/export${queryString}`);
    } catch (error) {
      console.warn('Failed to export exercises:', error);
      throw error;
    }
  },

  importExercises: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post('/exercises/import', formData);
    } catch (error) {
      console.warn('Failed to import exercises:', error);
      throw error;
    }
  }
};

// ===========================================
// src/App.tsx - Updated with Exercises route

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Performers } from './pages/Performers';
import { Exercises } from './pages/Exercises';
import { LessonPlanner } from './pages/LessonPlanner';
import { Login } from './pages/Login';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-practice/:lessonId" element={<LivePractice />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/performers" element={<Performers />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

// ===========================================
// Integration Summary & Usage Guide

/*
🎯 ENHANCED EXERCISE LIBRARY COMPLETE!

✅ Features Implemented:

📚 Advanced Exercise Discovery:
   - Comprehensive filtering by focus area, difficulty, duration, group size
   - Search by name, description, or creator
   - Sort by popularity, name, creation date, duration
   - Source filtering (community, custom, favorites)
   - Grid and list view modes

🎨 Rich Exercise Details:
   - Complete exercise information with instructions
   - Materials needed, variations, coaching tips
   - Focus area color coding and difficulty levels
   - Usage statistics and popularity indicators
   - Creator attribution and creation dates

🛠️ Exercise Creation & Management:
   - Comprehensive creation form with all details
   - Step-by-step instructions builder
   - Materials list management
   - Variations and coaching tips
   - Public/private sharing options

⭐ Advanced Features:
   - Favorite/bookmark system
   - Exercise duplication for customization
   - Import/export functionality (placeholder)
   - "Surprise Me" random selection
   - Usage tracking and popularity metrics

🎭 Detailed Exercise Library:
   - 10 comprehensive exercises with full details
   - Instructions, variations, tips for each
   - Realistic usage statistics
   - Mix of difficulty levels and group sizes
   - Community and custom exercises

📊 Enhanced Visual Design:
   - Color-coded focus areas throughout
   - Difficulty and group size indicators
   - Comprehensive exercise cards
   - Professional tabbed detail modal
   - Responsive filtering sidebar

🔗 Integration Points:
   - Works with Live Practice for exercise selection
   - Integrates with Lesson Planner
   - Connected to Team & Performer management
   - Consistent navigation and design

📱 Mobile-Responsive:
   - Adaptive layouts for all screen sizes
   - Touch-friendly controls
   - Collapsible filter sidebar
   - Optimized card layouts

🎪 Coach Experience:
   - Professional exercise library management
   - Easy discovery of new exercises
   - Custom exercise creation tools
   - Comprehensive exercise information
   - Efficient lesson planning integration

The Enhanced Exercise Library provides coaches with:
- Professional exercise discovery and organization
- Comprehensive exercise creation and management
- Rich exercise details with full instructions
- Advanced filtering and search capabilities
- Seamless integration with practice workflows

Ready for comprehensive improv coaching! 🎭
*/