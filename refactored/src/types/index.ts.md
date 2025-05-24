# src/types/index.ts - Add these team management types
```ts
export interface Performer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  coachId: number;
  performerCount: number;
  performers?: Performer[];
  upcomingLessonsCount: number;
  nextLessonDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
}

export interface PerformerCreateRequest {
  firstName: string;
  lastName: string;
  email?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  notes?: string;
}

```

# src/types/index.ts - Add these new types to your existing file
```ts
export interface PracticeSession {
  id: number;
  lessonId: number;
  startTime: string;
  endTime?: string;
  currentExerciseIndex: number;
  presentPerformerIds: number[];
}

export interface Performer {
  id: number;
  firstName: string;
  lastName: string;
  experienceLevel?: string;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface SceneEvaluation {
  id?: number;
  lessonExerciseId: number;
  practiceSessionId?: number;
  performerIds: number[];
  scores: Record<string, number>;
  notes: string;
  rubricType: 'base-reality' | 'game-of-scene';
}

export interface PracticeStats {
  totalDuration: number;
  exercisesCompleted: number;
  evaluationsCompleted: number;
  attendanceCount: number;
}

// Base Reality Rubric (UCB Manual)
export const BASE_REALITY_CRITERIA: EvaluationCriterion[] = [
  { id: 'yes_and', name: 'Yes And', description: 'Accepting and building on offers', maxScore: 4 },
  { id: 'agreement', name: 'Agreement', description: 'Finding shared reality', maxScore: 4 },
  { id: 'who_what_where', name: 'Who/What/Where', description: 'Establishing context clearly', maxScore: 4 },
  { id: 'physicality', name: 'Physicality', description: 'Using body and space effectively', maxScore: 4 },
  { id: 'listening', name: 'Listening', description: 'Active attention and responsiveness', maxScore: 4 },
  { id: 'commitment', name: 'Commitment', description: 'Full engagement and follow-through', maxScore: 4 },
  { id: 'avoidance_of_denial', name: 'Avoidance of Denial', description: 'Accepting reality vs blocking', maxScore: 4 },
  { id: 'efficiency', name: 'Efficiency', description: 'Economic scene work', maxScore: 4 }
];

// Game of Scene Rubric (Advanced)
export const GAME_OF_SCENE_CRITERIA: EvaluationCriterion[] = [
  { id: 'identification', name: 'Game Identification', description: 'Noticing the unusual thing', maxScore: 4 },
  { id: 'resting', name: 'Resting the Game', description: 'Patiently establishing game', maxScore: 4 },
  { id: 'heightening', name: 'Heightening', description: 'Escalating the game appropriately', maxScore: 4 },
  { id: 'exploration', name: 'Exploration', description: 'Exploring the game fully', maxScore: 4 },
  { id: 'top_of_intelligence', name: 'Top of Intelligence', description: 'Smart reactions to absurdity', maxScore: 4 },
  { id: 'justification', name: 'Justification', description: 'Making absurdity believable', maxScore: 4 },
  { id: 'framing', name: 'Framing', description: 'Communicating unusual behaviors clearly', maxScore: 4 },
  { id: 'labeling', name: 'Labeling', description: 'Concisely summarizing game for teammates', maxScore: 4 },
  { id: 'emotional_truth', name: 'Emotional Truth', description: 'Genuine reactions within the game', maxScore: 4 }
];

```


# src/types/index.ts - Add these exercise library types
```ts
export interface FocusArea {
  id: number;
  name: string;
  description: string;
  colorCode: string;
}

export interface ExerciseDetailed {
  id: number;
  name: string;
  description: string;
  minimumDurationMinutes: number;
  formattedMinimumDuration: string;
  createdByCoachId?: number;
  createdByCoachName?: string;
  createdAt: string;
  updatedAt: string;
  focusAreas: FocusArea[];
  hasDefaultEvaluationTemplate: boolean;
  defaultEvaluationTemplateName?: string;
  usageCount: number;
  popular: boolean;
  favorite: boolean;
  durationInfo: string;
  public: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  groupSize?: 'Individual' | 'Pairs' | 'Small Group' | 'Large Group' | 'Any';
  materials?: string[];
  instructions?: string;
  variations?: string[];
  tips?: string[];
}

export interface ExerciseCreateRequest {
  name: string;
  description: string;
  minimumDurationMinutes: number;
  focusAreaIds: number[];
  public: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  groupSize?: 'Individual' | 'Pairs' | 'Small Group' | 'Large Group' | 'Any';
  materials?: string[];
  instructions?: string;
  variations?: string[];
  tips?: string[];
  evaluationTemplateName?: string;
}

export interface ExerciseFilter {
  searchTerm?: string;
  focusAreaIds?: number[];
  difficulty?: string;
  groupSize?: string;
  maxDuration?: number;
  minDuration?: number;
  source?: 'all' | 'public' | 'custom' | 'favorites';
  sortBy?: 'name' | 'popularity' | 'duration' | 'created' | 'updated';
  sortDirection?: 'ASC' | 'DESC';
}
```

# src/types/index.ts - Add analytics and reporting types
```ts
export interface PerformerProgress {
  performerId: number;
  performerName: string;
  focusAreaScores: Record<string, {
    current: number;
    previous: number;
    trend: 'improving' | 'declining' | 'stable';
    evaluationCount: number;
  }>;
  overallProgress: number;
  strengths: string[];
  areasForGrowth: string[];
  attendanceRate: number;
  lastEvaluated: string;
}

export interface TeamAnalytics {
  teamId: number;
  teamName: string;
  performerCount: number;
  averageScore: number;
  scoreImprovement: number;
  attendanceRate: number;
  practicesCompleted: number;
  evaluationsCompleted: number;
  focusAreaBreakdown: Record<string, number>;
  strengthsAndWeaknesses: {
    strengths: Array<{ area: string; score: number }>;
    weaknesses: Array<{ area: string; score: number }>;
  };
  progressTrend: Array<{ date: string; score: number }>;
}

export interface ExerciseEffectiveness {
  exerciseId: number;
  exerciseName: string;
  usageCount: number;
  averageRating: number;
  effectivenessScore: number;
  focusAreaImpact: Record<string, number>;
  coachNotes: string[];
  recommendedFor: string[];
  timeSpentAverage: number;
}

export interface CoachingInsights {
  totalPractices: number;
  totalEvaluations: number;
  averageSessionLength: number;
  mostUsedExercises: ExerciseEffectiveness[];
  teamPerformanceComparison: TeamAnalytics[];
  overallTeachingEffectiveness: number;
  coachingStrengths: string[];
  areasForDevelopment: string[];
  monthlyActivity: Array<{ month: string; practices: number; evaluations: number }>;
}

export interface AnalyticsFilter {
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  teamIds?: number[];
  focusAreaIds?: number[];
  dateRange?: {
    start: string;
    end: string;
  };
}

```