### src/api/mockData.ts - Enhanced with detailed lesson data for Live Practice

```ts
import { Lesson, Exercise, Team, LessonTemplate, LessonExercise } from '../types';

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
  }
];

export const MOCK_TEAMS_DETAILED: Team[] = [
  { 
    id: 1, 
    name: 'The Improvisers',
    description: 'Intermediate level team focusing on scene work fundamentals'
  },
  { 
    id: 2, 
    name: 'Comedy Crew',
    description: 'Advanced team working on game of the scene and performance'
  },
  { 
    id: 3, 
    name: 'Laugh Track',
    description: 'Beginner-friendly team for new improvisers'
  }
];

export const MOCK_PERFORMERS = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', experienceLevel: 'Intermediate' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', experienceLevel: 'Beginner' },
  { id: 3, firstName: 'Carol', lastName: 'Davis', experienceLevel: 'Advanced' },
  { id: 4, firstName: 'David', lastName: 'Wilson', experienceLevel: 'Intermediate' },
  { id: 5, firstName: 'Emma', lastName: 'Brown', experienceLevel: 'Advanced' },
  { id: 6, firstName: 'Frank', lastName: 'Miller', experienceLevel: 'Beginner' },
  { id: 7, firstName: 'Grace', lastName: 'Lee', experienceLevel: 'Intermediate' },
  { id: 8, firstName: 'Henry', lastName: 'Garcia', experienceLevel: 'Advanced' }
];
```

# src/api/mockData.ts - Enhanced with comprehensive team and performer data
```ts
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

```



# src/api/mockData.ts - Enhanced with detailed exercise library data
```ts
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
```