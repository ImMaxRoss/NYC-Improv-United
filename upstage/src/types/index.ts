// Attendance Types
export interface AttendanceRequest {
  performerId: number;
  isPresent: boolean;
}

export interface BulkAttendanceRequest {
  performerIds: number[];
}

export interface AttendanceResponse {
  practiceSessionId: number;
  performerId: number;
  performerFirstName: string;
  performerLastName: string;
}


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  lessons?: Lesson[];
  lessonTemplates?: LessonTemplate[];
}

export interface FocusArea {
  id: number;
  name: string;
  description: string;
  colorCode: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  minimumDurationMinutes: number;
  formattedMinimumDuration?: string;
  focusAreas?: FocusArea[];
  createdByCoachName?: string;
  createdByCoachId?: number;
  createdAt?: string;
  updatedAt?: string;
  hasDefaultEvaluationTemplate?: boolean;
  defaultEvaluationTemplateName?: string;
  usageCount?: number;
  popular?: boolean;
  favorite?: boolean;
  durationInfo?: string;
  public?: boolean;
  // Added for lesson planning
  plannedDurationMinutes?: number;
  orderIndex?: number;
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
  // Added for lesson planning
  plannedDurationMinutes?: number;
  orderIndex?: number;
}

export interface LessonExercise {
  id: number;
  exerciseId: number;
  exerciseName: string;
  exerciseDescription: string;
  orderIndex: number;
  plannedDurationMinutes: number;
  formattedDuration: string;
  evaluationTemplateId?: number;
  evaluationTemplateName?: string;
  exerciseNotes?: string;
  focusAreas: FocusArea[];
}

export interface TimeBreakdown {
  focusAreaName: string;
  colorCode: string;
  minutes: number;
  formattedTime: string;
  percentage: number;
  formattedPercentage: string;
}

export interface Lesson {
  id: number;
  coachId?: number;
  teamId?: number;
  teamName?: string;
  name: string;
  scheduledDate: string;
  totalDurationMinutes?: number;
  formattedDuration: string;
  workshopType?: string;
  createdAt?: string;
  updatedAt?: string;
  exercises?: LessonExercise[];
  focusAreaBreakdown?: Record<string, number>;
  timeBreakdown?: TimeBreakdown[];
  exerciseCount: number;
  scheduled?: boolean;
  template?: boolean;
  upcoming?: boolean;
}

export interface LessonTemplate {
  id: number;
  name: string;
  coachId?: number;
  teamId?: number;
  teamName?: string;
  scheduledDate?: string;
  totalDurationMinutes?: number;
  formattedDuration?: string;
  workshopType?: string;
  createdAt?: string;
  updatedAt?: string;
  exercises?: LessonExercise[];
  exerciseCount?: number;
  template?: boolean;
  description?: string; 
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface PerformerSummary {
  id: number;
  firstName: string;
  lastName: string;
  // Removed experienceLevel
  createdAt?: string;
  updatedAt?: string;
}

export interface Performer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  // Removed experienceLevel
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
  performers?: PerformerSummary[];
  upcomingLessonsCount: number;
  nextLessonDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
}

export interface TeamUpdateRequest {
  name: string;
  description?: string;
  performerIds?: number[];
  performerOperation?: 'ADD' | 'REMOVE' | 'REPLACE';
}

export interface PerformerCreateRequest {
  firstName: string;
  lastName: string;
  email?: string;
  // Removed experienceLevel
  notes?: string;
}

export interface PerformerUpdateRequest {
  performerIds: number[];
  operation: 'ADD' | 'REMOVE' | 'REPLACE';
}

export interface LessonRequest {
  coachId?: number;
  teamId?: number | null; // Allow null values
  name?: string;
  scheduledDate?: string | null; // Allow null values
  workshopType?: string;
  exercises?: LessonExerciseRequest[];
  template?: boolean;
}

export interface LessonExerciseRequest {
  exerciseId: number;
  plannedDurationMinutes?: number;
  evaluationTemplateId?: number;
  exerciseNotes?: string;
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
  { id: 'efficiency', name: 'Efficiency/Clarity', description: 'Economic scene work', maxScore: 4 }
];

// Game of Scene Rubric (Advanced)
export const GAME_OF_SCENE_CRITERIA: EvaluationCriterion[] = [
  { id: 'identification', name: 'Game Identification', description: 'Spot & frame first unusual thing clearly', maxScore: 4 },
  { id: 'building', name: 'Building Pattern', description: 'Solid, focused pattern established', maxScore: 4 },
  { id: 'heightening', name: 'Heightening', description: 'Logical escalation within pattern', maxScore: 4 },
  { id: 'exploration', name: 'Exploration', description: 'Believable "why?", smart logic', maxScore: 4 },
  { id: 'topOfIntelligence', name: 'Top of Intelligence', description: 'Realistic, emotionally honest reactions', maxScore: 4 },
  { id: 'teamwork', name: 'Agreement/Teamwork', description: 'Players support, don\'t sandbag/steamroll', maxScore: 4 },
  { id: 'gameListening', name: 'Listening During Game', description: 'Moves connect, no pattern jumping', maxScore: 4 },
  { id: 'clarity', name: 'Clarity of Game', description: 'One clear game, no crazy town', maxScore: 4 },
  { id: 'believability', name: 'Commitment/Believability', description: 'No winking/commentary, full buy-in', maxScore: 4 }
];

export interface PracticeSession {
  id: number;
  lessonId: number;
  lessonName?: string;
  startTime: string;
  endTime?: string;
  currentExerciseIndex: number;
  currentExerciseId?: number; 
  currentExerciseName?: string;
  attendeeIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface PracticeNoteResponse {
  id: number;
  lessonId: number;
  practiceSessionId?: number;
  noteType: string;
  content: string;
  createdAt: string;
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

export interface EvaluationTemplate {
  id: number;
  name: string;
  criteria: EvaluationCriterion[];
  createdAt: string;
  updatedAt: string;
}

interface EvaluationTemplateDTO {
  id: number;
  name: string;
  criteria: {
    name: string;
    description: string;
    maxScore: number;
  }[];
}

export interface ExerciseRequest {
  name: string;
  description: string;
  minimumDurationMinutes: number;
  focusAreaIds: number[];
  evaluationTemplateName?: string;
  evaluationCriteria?: EvaluationCriterionRequest[];
  public?: boolean;
}

export interface EvaluationCriterionRequest {
  name: string;
  description?: string;
  maxScore?: number;
  focusAreaId?: number;
}

export interface ExerciseResponse {
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
}

export interface ExerciseSummaryResponse {
  id: number;
  name: string;
  minimumDurationMinutes: number;
  formattedMinimumDuration: string;
  sourceLabel?: string;
  focusAreas: FocusArea[];
  hasDefaultEvaluationTemplate: boolean;
  public: boolean;
}

export interface EvaluationRequest {
  teamId: number;
  performanceDate: string;
  performerNames?: string;
  yesAnd?: number;
  agreement?: number;
  whoWhatWhere?: number;
  physicality?: number;
  listening?: number;
  commitment?: number;
  avoidanceOfDenial?: number;
  efficiency?: number;
  notes?: string;
}

export interface EvaluationUpdateRequest {
  teamId?: number;
  performanceDate?: string;
  performerNames?: string;
  yesAnd?: number;
  agreement?: number;
  whoWhatWhere?: number;
  physicality?: number;
  listening?: number;
  commitment?: number;
  avoidanceOfDenial?: number;
  efficiency?: number;
  notes?: string;
}

export interface EvaluationResponse {
  id: number;
  teamId: number;
  performanceDate: string;
  teamName?: string;
  performerNames?: string;
  yesAnd?: number;
  agreement?: number;
  whoWhatWhere?: number;
  physicality?: number;
  listening?: number;
  commitment?: number;
  avoidanceOfDenial?: number;
  efficiency?: number;
  notes?: string;
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
  hasEvaluation?: boolean;
}

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