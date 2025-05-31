import { 
  Lesson, 
  Exercise, 
  Team, 
  LessonTemplate, 
  LessonExercise, 
  Performer,
  PerformerSummary,
  FocusArea,
  TimeBreakdown
} from '../types';

// Mock Performers with detailed information (experienceLevel removed)
export const MOCK_PERFORMERS: Performer[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@email.com',
    notes: 'Great at character work, working on saying yes to bigger emotions',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@email.com',
    notes: 'New to improv but very enthusiastic. Focus on listening skills.',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 3,
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@email.com',
    notes: 'Excellent game player, natural teacher, helps newer students',
    createdAt: '2023-11-20T14:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    notes: 'Strong scene work, needs to work on supporting scenes vs leading',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'emma.brown@email.com',
    notes: 'Exceptional physicality and commitment, great scene partner',
    createdAt: '2023-10-15T13:00:00Z',
    updatedAt: '2024-01-08T10:15:00Z'
  },
  {
    id: 6,
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank.miller@email.com',
    notes: 'Quiet but makes strong choices when he commits. Building confidence.',
    createdAt: '2024-02-10T16:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z'
  },
  {
    id: 7,
    firstName: 'Grace',
    lastName: 'Lee',
    email: 'grace.lee@email.com',
    notes: 'Natural comedian with great timing. Working on more grounded scenes.',
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 8,
    firstName: 'Henry',
    lastName: 'Garcia',
    email: 'henry.garcia@email.com',
    notes: 'Professional performer, great mentor figure for the team',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-12-20T11:30:00Z'
  },
  {
    id: 9,
    firstName: 'Ivy',
    lastName: 'Chen',
    email: 'ivy.chen@email.com',
    notes: 'Excellent at relationship establishment, working on heightening',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-02-05T09:45:00Z'
  },
  {
    id: 10,
    firstName: 'Jack',
    lastName: 'Taylor',
    email: 'jack.taylor@email.com',
    notes: 'Very analytical, learning to trust instincts over thinking',
    createdAt: '2024-02-15T13:30:00Z',
    updatedAt: '2024-02-15T13:30:00Z'
  }
];

// Convert Performer to PerformerSummary for Team associations
const toPerformerSummary = (performer: Performer): PerformerSummary => ({
  id: performer.id,
  firstName: performer.firstName,
  lastName: performer.lastName,
  createdAt: performer.createdAt,
  updatedAt: performer.updatedAt
});

// Mock Teams with performer associations
export const MOCK_TEAMS_DETAILED: Team[] = [
  {
    id: 1,
    name: 'The Improvisers',
    description: 'Intermediate level team focusing on scene work fundamentals and character development',
    coachId: 1,
    performerCount: 6,
    performers: [
      toPerformerSummary(MOCK_PERFORMERS[0]), // Alice
      toPerformerSummary(MOCK_PERFORMERS[1]), // Bob
      toPerformerSummary(MOCK_PERFORMERS[3]), // David
      toPerformerSummary(MOCK_PERFORMERS[6]), // Grace
      toPerformerSummary(MOCK_PERFORMERS[8]), // Ivy
      toPerformerSummary(MOCK_PERFORMERS[9])  // Jack
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
      toPerformerSummary(MOCK_PERFORMERS[2]), // Carol
      toPerformerSummary(MOCK_PERFORMERS[4]), // Emma
      toPerformerSummary(MOCK_PERFORMERS[7]), // Henry
      toPerformerSummary(MOCK_PERFORMERS[6])  // Grace
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
      toPerformerSummary(MOCK_PERFORMERS[1]), // Bob
      toPerformerSummary(MOCK_PERFORMERS[5]), // Frank
      toPerformerSummary(MOCK_PERFORMERS[9])  // Jack
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
      toPerformerSummary(MOCK_PERFORMERS[0]), // Alice
      toPerformerSummary(MOCK_PERFORMERS[2]), // Carol
      toPerformerSummary(MOCK_PERFORMERS[4]), // Emma
      toPerformerSummary(MOCK_PERFORMERS[5]), // Frank
      toPerformerSummary(MOCK_PERFORMERS[8])  // Ivy
    ],
    upcomingLessonsCount: 1,
    nextLessonDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    createdAt: '2023-12-01T11:00:00Z',
    updatedAt: '2024-02-10T13:45:00Z'
  }
];

// Focus Areas mock data
export const MOCK_FOCUS_AREAS: FocusArea[] = [
  { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
  { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' },
  { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
  { id: 4, name: 'Agreement', description: 'Shared reality', colorCode: '#2196F3' },
  { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' },
  { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' },
  { id: 7, name: 'Avoidance of Denial', description: 'Accept reality', colorCode: '#009688' },
  { id: 8, name: 'Efficiency', description: 'Economic scene work', colorCode: '#795548' },
  { id: 9, name: 'Game Identification', description: 'Noticing unusual', colorCode: '#607D8B' },
  { id: 10, name: 'Resting the Game', description: 'Patient establishment', colorCode: '#E91E63' }
];

// Enhanced lesson mock data with team associations
export const MOCK_DETAILED_LESSONS: Lesson[] = [
  {
    id: 1,
    coachId: 1,
    name: 'Tuesday Night Practice',
    teamId: 1,
    teamName: 'The Improvisers',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    totalDurationMinutes: 90,
    formattedDuration: '90 minutes',
    workshopType: 'Scene Work',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    exerciseCount: 5,
    scheduled: true,
    template: false,
    upcoming: true,
    focusAreaBreakdown: {
      'Listening': 30,
      'Physicality': 30,
      'Yes And': 15,
      'Agreement': 15,
      'Commitment': 20,
      'Who/What/Where': 45,
      'Avoidance of Denial': 25,
      'Efficiency': 20
    },
    timeBreakdown: [
      {
        focusAreaName: 'Who/What/Where',
        colorCode: '#FF9800',
        minutes: 45,
        formattedTime: '45 min',
        percentage: 50,
        formattedPercentage: '50%'
      },
      {
        focusAreaName: 'Listening',
        colorCode: '#F44336',
        minutes: 30,
        formattedTime: '30 min',
        percentage: 33.3,
        formattedPercentage: '33%'
      },
      {
        focusAreaName: 'Physicality',
        colorCode: '#9C27B0',
        minutes: 30,
        formattedTime: '30 min',
        percentage: 33.3,
        formattedPercentage: '33%'
      }
    ],
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
    coachId: 1,
    name: 'Weekend Workshop: Game of the Scene',
    teamId: 2,
    teamName: 'Comedy Crew',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    totalDurationMinutes: 120,
    formattedDuration: '120 minutes',
    workshopType: 'Game Workshop',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
    exerciseCount: 6,
    scheduled: true,
    template: false,
    upcoming: true,
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
          { id: 9, name: 'Game Identification', description: 'Noticing unusual', colorCode: '#607D8B' },
          { id: 10, name: 'Resting the Game', description: 'Patient establishment', colorCode: '#E91E63' }
        ]
      }
    ]
  },
  {
    id: 3,
    coachId: 1,
    name: 'Weekend Warriors Workshop',
    teamId: 4,
    teamName: 'Weekend Warriors',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    totalDurationMinutes: 180,
    formattedDuration: '180 minutes',
    workshopType: 'Performance Prep',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-30T16:00:00Z',
    exerciseCount: 8,
    scheduled: true,
    template: false,
    upcoming: true,
    exercises: []
  }
];

// Keep existing simple mock data for backwards compatibility
export const MOCK_LESSONS: Lesson[] = MOCK_DETAILED_LESSONS.map(lesson => ({
  id: lesson.id,
  coachId: lesson.coachId,
  name: lesson.name,
  teamId: lesson.teamId,
  teamName: lesson.teamName,
  scheduledDate: lesson.scheduledDate,
  totalDurationMinutes: lesson.totalDurationMinutes,
  formattedDuration: lesson.formattedDuration,
  workshopType: lesson.workshopType,
  exerciseCount: lesson.exerciseCount,
  scheduled: lesson.scheduled,
  template: lesson.template,
  upcoming: lesson.upcoming
}));

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Yes, And',
    description: 'The fundamental improv exercise where players accept and build on each other\'s ideas.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
      { id: 4, name: 'Agreement', description: 'Shared reality', colorCode: '#2196F3' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    public: true,
    usageCount: 150,
    popular: true,
    favorite: false,
    durationInfo: '10-15 minutes'
  },
  {
    id: 2,
    name: 'Zip Zap Zop',
    description: 'An energetic warm-up game that helps with focus and listening.',
    minimumDurationMinutes: 5,
    formattedMinimumDuration: '5 min',
    focusAreas: [
      { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
      { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    public: true,
    usageCount: 200,
    popular: true,
    favorite: true,
    durationInfo: '5-10 minutes'
  },
  {
    id: 3,
    name: 'Character Walk',
    description: 'Players walk around the space developing physical characters.',
    minimumDurationMinutes: 15,
    formattedMinimumDuration: '15 min',
    focusAreas: [
      { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' },
      { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    public: true,
    usageCount: 75,
    popular: false,
    favorite: false,
    durationInfo: '15-20 minutes'
  },
  {
    id: 4,
    name: 'Emotional Quadrants',
    description: 'Players explore different emotions in different areas of the stage.',
    minimumDurationMinutes: 20,
    formattedMinimumDuration: '20 min',
    focusAreas: [
      { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' },
      { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    public: true,
    usageCount: 90,
    popular: false,
    favorite: true,
    durationInfo: '20-25 minutes'
  },
  {
    id: 5,
    name: 'Sound Ball',
    description: 'Players throw imaginary balls with unique sounds.',
    minimumDurationMinutes: 10,
    formattedMinimumDuration: '10 min',
    focusAreas: [
      { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
      { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    public: true,
    usageCount: 120,
    popular: true,
    favorite: false,
    durationInfo: '10-15 minutes'
  }
];

export const MOCK_TEAMS: Team[] = MOCK_TEAMS_DETAILED;

export const MOCK_TEMPLATES: LessonTemplate[] = [
  { 
    id: 1, 
    name: 'Basic Warmup Session',
    coachId: 1,
    template: true,
    formattedDuration: '60 minutes',
    exerciseCount: 3
  },
  { 
    id: 2, 
    name: 'Character Development Workshop',
    coachId: 1,
    template: true,
    formattedDuration: '90 minutes',
    exerciseCount: 5
  },
  { 
    id: 3, 
    name: 'Scene Work Intensive',
    coachId: 1,
    template: true,
    formattedDuration: '120 minutes',
    exerciseCount: 6
  },
  { 
    id: 4, 
    name: 'Game of the Scene Advanced',
    coachId: 1,
    template: true,
    formattedDuration: '150 minutes',
    exerciseCount: 7
  }
];