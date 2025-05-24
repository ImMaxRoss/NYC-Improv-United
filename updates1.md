# Integration Checklist

## ✅ Files to Create
- [ ] `src/api/modules/evaluations.ts`
- [ ] `src/components/EvaluationForm.tsx`
- [ ] `src/pages/LivePracticeMode.tsx`

## ✅ Files to Update

### Types
- [ ] `src/types/index.ts` - Add new interfaces

### API Modules
- [ ] `src/api/modules/teams.ts` - Add getTeamWithPerformers
- [ ] `src/api/modules/lessons.ts` - Update getById, add getFocusBreakdown
- [ ] `src/api/mockData.ts` - Add mock data for new features
- [ ] `src/api/index.ts` - Export evaluationsAPI

### Components
- [ ] `src/components/ui/Button.tsx` - Add 'danger' variant
- [ ] `src/pages/Dashboard.tsx` - Add practice mode support

## ✅ Dependencies to Verify

### Lucide Icons (new ones used)
- CheckCircle
- Circle
- PlayCircle
- PauseCircle
- ClipboardCheck
- Award
- TrendingUp

These should already be available since you have `lucide-react` installed.

## ✅ Testing Steps

1. **Verify Types Compile**
   ```bash
   npm run build
   ```

2. **Test Practice Mode Flow**
   - Login
   - Click "Start Practice" on a lesson
   - Take attendance
   - Start practice
   - Use timer controls
   - Open evaluation form
   - Submit evaluation
   - Navigate exercises

3. **Check Mock Data Fallbacks**
   - Test with backend offline
   - Verify mock data loads correctly

## ✅ Common Issues & Solutions

### Issue: TypeScript errors
**Solution**: Make sure all new types are added before updating components

### Issue: Missing icons
**Solution**: All icons should be available in lucide-react

### Issue: API errors
**Solution**: Mock data fallbacks should handle this automatically

### Issue: Navigation not working
**Solution**: Ensure Dashboard activeView state includes 'practice'

___
```jsx
/* Add these to your existing styles if not already present */

/* For the timer display */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

/* For scaling effect on score buttons */
.scale-105 {
  transform: scale(1.05);
}

/* Ensure checkboxes are styled properly */
input[type="checkbox"] {
  color-scheme: dark;
}

/* Custom focus styles for form elements */
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}


// Additional imports needed for the new features

// For LivePracticeMode.tsx and other components using new icons
import { 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  PauseCircle, 
  SkipForward, 
  ClipboardCheck, 
  Award, 
  TrendingUp 
} from 'lucide-react';

// For components using the evaluation API
import { evaluationsAPI } from '../api/modules/evaluations';

// For components using new types
import { 
  Performer,
  TeamWithPerformers,
  AttendanceRecord,
  Evaluation,
  EvaluationCriterion,
  LessonWithDetails,
  ExerciseInLesson
} from '../types';

// For Dashboard.tsx
import { LivePracticeMode } from './LivePracticeMode';

// For pages using EvaluationForm
import { EvaluationForm } from '../components/EvaluationForm';
```
___
# Integration Guide for New Live Practice Features

## Summary of New Features

Your developer has added:
1. **Live Practice Mode** - A complete practice session runner with timer
2. **Evaluation System** - UCB rubric-based performance evaluation
3. **Enhanced API Support** - New endpoints for evaluations and team performers
4. **Improved Dashboard** - Direct practice launching from upcoming lessons

## Files to Add/Update

### 1. **New Type Definitions** (`src/types/index.ts`)
Add the new interfaces for:
- `Performer`
- `TeamWithPerformers`
- `AttendanceRecord`
- `Evaluation`
- `EvaluationCriterion`
- `LessonWithDetails`
- `ExerciseInLesson`

### 2. **New API Module** (`src/api/modules/evaluations.ts`)
Create this new file for evaluation CRUD operations

### 3. **Updated API Modules**
- **teams.ts**: Add `getTeamWithPerformers` endpoint with mock fallback
- **lessons.ts**: Update `getById` to return `LessonWithDetails` with mock fallback
- **lessons.ts**: Add `getFocusBreakdown` endpoint

### 4. **Updated UI Component** (`src/components/ui/Button.tsx`)
Add the 'danger' variant to the Button component

### 5. **New Component** (`src/components/EvaluationForm.tsx`)
Complete evaluation form with:
- Two rubric types (Base Reality & Game of Scene)
- Performer selection
- Score grid (1-4 scoring)
- Notes section

### 6. **New Page** (`src/pages/LivePracticeMode.tsx`)
Full practice mode implementation with:
- Pre-practice setup and attendance
- Live timer functionality
- Exercise navigation
- Evaluation integration
- Progress tracking

### 7. **Updated Dashboard** (`src/pages/Dashboard.tsx`)
- Add practice mode to activeView states
- Add `handleStartPractice` function
- Update lesson display with Start Practice buttons
- Handle navigation to LivePracticeMode

### 8. **Mock Data Updates** (`src/api/mockData.ts`)
Add mock data for:
- Performers
- Team with performers
- Exercises in lesson format
- Lesson with full details

### 9. **API Index** (`src/api/index.ts`)
Export the new `evaluationsAPI`

## Implementation Steps

1. **Update Types First**
   - Add all new type definitions to ensure TypeScript compatibility

2. **Add Mock Data**
   - Update mockData.ts with the new mock structures

3. **Update API Modules**
   - Add evaluations API module
   - Update teams and lessons modules with new endpoints and fallbacks

4. **Add UI Components**
   - Update Button component
   - Add EvaluationForm component

5. **Add Live Practice Mode**
   - Create the LivePracticeMode page component

6. **Update Dashboard**
   - Modify Dashboard to support practice mode navigation

## Testing the New Features

1. **Login** to the app
2. **Create a lesson** using the Lesson Planner
3. From the Dashboard, click **"Start Practice"** on any upcoming lesson
4. **Take attendance** and start the practice
5. **Run exercises** with the timer
6. **Evaluate performances** using the rubric system
7. **Navigate between exercises** and track progress

## Key Features in Practice Mode

- **Timer Controls**: Play/Pause/Reset for each exercise
- **Evaluation Rubrics**: 
  - Base Reality (8 criteria)
  - Game of Scene (9 criteria)
- **Real-time Stats**: Track evaluations, attendance, and progress
- **Exercise Navigation**: Move between exercises with progress bar
- **Attendance Tracking**: Mark present performers before starting

## Notes

- The evaluation system stores data via the `/api/evaluations` endpoint
- Mock data fallbacks ensure the app works even if the backend is unavailable
- The UCB rubric implementation matches the manual exactly
- All original functionality is preserved while adding these new features

## Future Enhancements (mentioned by the dev)
- Export evaluations to PDF
- Historical performance tracking graphs
- Comparison views between evaluations
- Voice notes during practice
- Video recording integration markers


// Add these to src/api/mockData.ts
```ts
import { Performer, TeamWithPerformers, LessonWithDetails, ExerciseInLesson } from '../types';

export const MOCK_PERFORMERS: Performer[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', teamId: 1 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', teamId: 1 },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', teamId: 1 },
  { id: 4, firstName: 'Alice', lastName: 'Williams', teamId: 1 },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', teamId: 2 },
  { id: 6, firstName: 'Diana', lastName: 'Prince', teamId: 2 },
];

export const MOCK_TEAM_WITH_PERFORMERS: TeamWithPerformers = {
  id: 1,
  name: 'The Improvisers',
  performers: MOCK_PERFORMERS.filter(p => p.teamId === 1)
};

export const MOCK_EXERCISES_IN_LESSON: ExerciseInLesson[] = [
  {
    id: 1,
    exerciseName: 'Yes, And Circle',
    exerciseDescription: 'Players stand in a circle and practice accepting and building on each other\'s offers.',
    exerciseNotes: 'Focus on eye contact and clear verbal agreement',
    formattedDuration: '10 minutes',
    plannedDurationMinutes: 10,
    focusAreas: [
      { id: 1, name: 'Yes And' },
      { id: 2, name: 'Agreement' }
    ]
  },
  {
    id: 2,
    exerciseName: 'Emotional Quadrants',
    exerciseDescription: 'Stage is divided into four emotional zones. Players explore how emotions affect character and scene.',
    formattedDuration: '15 minutes',
    plannedDurationMinutes: 15,
    focusAreas: [
      { id: 6, name: 'Commitment' },
      { id: 4, name: 'Physicality' }
    ]
  },
  {
    id: 3,
    exerciseName: 'Pattern Game',
    exerciseDescription: 'Players identify and heighten patterns in scenes, focusing on game mechanics.',
    exerciseNotes: 'Remember: if this is unusual, what is usual?',
    formattedDuration: '20 minutes',
    plannedDurationMinutes: 20,
    focusAreas: [
      { id: 3, name: 'Listening' },
      { id: 1, name: 'Yes And' }
    ]
  }
];

export const MOCK_LESSON_WITH_DETAILS: LessonWithDetails = {
  id: 1,
  name: 'Tuesday Night Practice',
  teamId: 1,
  teamName: 'The Improvisers',
  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  formattedDuration: '90 minutes',
  exerciseCount: 3,
  exercises: MOCK_EXERCISES_IN_LESSON
};
```

```ts
// Add these imports to your existing API index file (src/api/index.ts)
export { authAPI } from './modules/auth';
export { lessonsAPI } from './modules/lessons';
export { exercisesAPI } from './modules/exercises';
export { teamsAPI } from './modules/teams';
export { evaluationsAPI } from './modules/evaluations'; // NEW
export { api } from './service';
```

```tsx
// src/pages/Dashboard.tsx (UPDATED VERSION - add practice mode support)
import React, { useState } from 'react';
import { 
  Calendar, Clock, Users, BookOpen, Star, Play, Plus, 
  ChevronRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { lessonsAPI } from '../api/modules/lessons';
import { exercisesAPI } from '../api/modules/exercises';
import { teamsAPI } from '../api/modules/teams';
import { useApi } from '../hooks/useApi';
import { Navigation } from '../components/Navigation';
import { StatCard } from '../components/StatCard';
import { UpcomingLesson } from '../components/UpcomingLesson';
import { ExerciseCard } from '../components/ExerciseCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LessonPlanner } from './LessonPlanner';
import { LivePracticeMode } from './LivePracticeMode';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'planner' | 'practice'>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  
  const { data: upcomingLessons, loading: lessonsLoading } = useApi(() => lessonsAPI.getUpcoming());
  const { data: popularExercises, loading: exercisesLoading } = useApi(() => exercisesAPI.getPopular(5));
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());

  const handleStartPractice = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setActiveView('practice');
  };

  // Show Live Practice Mode
  if (activeView === 'practice' && selectedLessonId) {
    return <LivePracticeMode lessonId={selectedLessonId} />;
  }

  // Show Lesson Planner
  if (activeView === 'planner') {
    return (
      <>
        <Navigation />
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-4 ml-4 text-gray-400 hover:text-gray-200 flex items-center space-x-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          <span>Back to Dashboard</span>
        </button>
        <LessonPlanner />
      </>
    );
  }

  // Show Dashboard
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-100">
            Welcome back, {user?.firstName}! <span className="inline-block animate-bounce">🎭</span>
          </h1>
          <p className="text-gray-400 mt-2">Ready to make some comedy magic happen?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Active Teams" 
            value={teams?.length || 0} 
            color="bg-yellow-500 text-yellow-500" 
          />
          <StatCard 
            icon={Calendar} 
            label="Upcoming Lessons" 
            value={upcomingLessons?.length || 0} 
            color="bg-red-500 text-red-500" 
          />
          <StatCard 
            icon={BookOpen} 
            label="Total Lessons" 
            value={user?.lessons?.length || 0} 
            color="bg-purple-500 text-purple-500" 
          />
          <StatCard 
            icon={Star} 
            label="Saved Templates" 
            value={user?.lessonTemplates?.length || 0} 
            color="bg-green-500 text-green-500" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            hoverable 
            className="p-6 cursor-pointer"
            onClick={() => setActiveView('planner')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                <Plus className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Plan New Lesson</h3>
                <p className="text-gray-400 text-sm">Create your next practice session</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-6 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500 bg-opacity-20 rounded-lg">
                <Play className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Start Practice</h3>
                <p className="text-gray-400 text-sm">Run a live session</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-6 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Browse Exercises</h3>
                <p className="text-gray-400 text-sm">Discover new activities</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Lessons with Practice Buttons */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-100">Upcoming Lessons</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          {lessonsLoading ? (
            <LoadingSpinner />
          ) : upcomingLessons?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No upcoming lessons scheduled</p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4"
                onClick={() => setActiveView('planner')}
              >
                Plan a Lesson
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingLessons?.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-gray-100 font-medium">
                      {lesson.name || `${lesson.teamName} Practice`}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {lesson.teamName} • {new Date(lesson.scheduledDate).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-xs mt-1">
                      <span>{lesson.formattedDuration}</span>
                      <span>{lesson.exerciseCount} exercises</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartPractice(lesson.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Popular Exercises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-100">Popular Exercises</h2>
              <Button variant="ghost" size="sm">Browse All</Button>
            </div>
            {exercisesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {popularExercises?.slice(0, 3).map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            )}
          </Card>

          {/* Quick Stats or Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-display font-bold text-gray-100 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">
                <p className="mb-2">• Completed practice with The Improvisers</p>
                <p className="mb-2">• Added 3 new exercises to library</p>
                <p className="mb-2">• Created template "Character Workshop"</p>
                <p>• 5 evaluations submitted this week</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
```

```tsx
// src/pages/LivePracticeMode.tsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, BookOpen, Play, Timer, ChevronRight, 
  PlayCircle, PauseCircle, ClipboardCheck, Award, 
  TrendingUp, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { lessonsAPI } from '../api/modules/lessons';
import { teamsAPI } from '../api/modules/teams';
import { evaluationsAPI } from '../api/modules/evaluations';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EvaluationForm } from '../components/EvaluationForm';
import { 
  LessonWithDetails, 
  AttendanceRecord, 
  Evaluation, 
  ExerciseInLesson 
} from '../types';

interface LivePracticeModeProps {
  lessonId: number;
}

export const LivePracticeMode: React.FC<LivePracticeModeProps> = ({ lessonId }) => {
  const [lesson, setLesson] = useState<LessonWithDetails | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<Array<{ exerciseIndex: number } & Evaluation>>([]);
  
  // Timer state
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const lessonData = await lessonsAPI.getById(lessonId);
        setLesson(lessonData);
        
        if (lessonData.teamId) {
          const teamData = await teamsAPI.getTeamWithPerformers(lessonData.teamId);
          setAttendance(teamData.performers?.map(p => ({ ...p, present: true })) || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load lesson:', error);
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = lesson?.exercises?.[currentExerciseIndex];
  const progress = lesson?.exercises ? ((currentExerciseIndex + 1) / lesson.exercises.length) * 100 : 0;

  const handleStartPractice = () => {
    setPracticeStarted(true);
    setIsTimerRunning(true);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < lesson!.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimer(0);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setTimer(0);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleEvaluationSubmit = async (evaluationData: Omit<Evaluation, 'id'>) => {
    try {
      await evaluationsAPI.create(evaluationData);
      setEvaluations([...evaluations, { exerciseIndex: currentExerciseIndex, ...evaluationData }]);
      setShowEvaluation(false);
      alert('Evaluation saved successfully!');
    } catch (error) {
      alert('Failed to save evaluation: ' + (error as Error).message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!lesson) return <ErrorMessage error="Lesson not found" />;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-100 mb-2">
            {lesson.name || `${lesson.teamName} Practice`}
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {lesson.teamName}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.formattedDuration}
            </span>
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {lesson.exerciseCount} exercises
            </span>
          </div>
        </div>

        {!practiceStarted ? (
          /* Pre-Practice Setup */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Practice Overview</h2>
                <div className="space-y-4">
                  {lesson.exercises.map((exercise, index) => (
                    <div 
                      key={exercise.id}
                      className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="text-gray-400 font-bold">{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="text-gray-100 font-medium">{exercise.exerciseName}</h4>
                        <p className="text-gray-400 text-sm">{exercise.formattedDuration}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.focusAreas?.map((area, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-gray-600 rounded-full text-xs text-gray-300"
                          >
                            {area.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button size="lg" onClick={handleStartPractice}>
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Practice
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Attendance</h3>
                <div className="space-y-2">
                  {attendance.map((performer) => (
                    <label
                      key={performer.id}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={performer.present}
                        onChange={(e) => {
                          setAttendance(attendance.map(p => 
                            p.id === performer.id ? { ...p, present: e.target.checked } : p
                          ));
                        }}
                        className="rounded bg-gray-700 border-gray-600 text-yellow-500"
                      />
                      <span className="text-gray-300">
                        {performer.firstName} {performer.lastName}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  {attendance.filter(p => p.present).length} of {attendance.length} present
                </div>
              </Card>
            </div>
          </div>
        ) : showEvaluation ? (
          /* Evaluation Form */
          <EvaluationForm
            exercise={{ ...currentExercise!, teamId: lesson.teamId! }}
            performers={attendance.filter(p => p.present)}
            onSubmit={handleEvaluationSubmit}
            onCancel={() => setShowEvaluation(false)}
          />
        ) : (
          /* Live Practice Interface */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-yellow-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Current Exercise */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm mb-2">
                  Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-100 mb-4">
                  {currentExercise!.exerciseName}
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  {currentExercise!.exerciseDescription}
                </p>
              </div>

              {/* Timer */}
              <div className="flex justify-center items-center space-x-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-mono font-bold text-yellow-500">
                    {formatTime(timer)}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Target: {currentExercise!.formattedDuration}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleToggleTimer}
                  >
                    {isTimerRunning ? (
                      <>
                        <PauseCircle className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimer(0)}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                {currentExercise!.focusAreas?.map((area, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-700 rounded-full text-gray-100 font-medium"
                  >
                    {area.name}
                  </span>
                ))}
              </div>

              {/* Exercise Notes */}
              {currentExercise!.exerciseNotes && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-100 mb-2">Notes:</h4>
                  <p className="text-gray-300">{currentExercise!.exerciseNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handlePreviousExercise}
                  disabled={currentExerciseIndex === 0}
                >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                  Previous
                </Button>

                <Button
                  variant="primary"
                  onClick={() => setShowEvaluation(true)}
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Evaluate Scene
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleNextExercise}
                  disabled={currentExerciseIndex === lesson.exercises.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Evaluations</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {evaluations.length}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Present</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {attendance.filter(p => p.present).length}/{attendance.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Progress</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {Math.round(progress)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* End Practice Button */}
            {currentExerciseIndex === lesson.exercises.length - 1 && (
              <div className="text-center">
                <Button variant="danger" size="lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  End Practice
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

```tsx
// src/components/EvaluationForm.tsx
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ExerciseInLesson, Performer, Evaluation, EvaluationCriterion } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface EvaluationFormProps {
  exercise: ExerciseInLesson & { teamId: number };
  performers: Performer[];
  onSubmit: (evaluationData: Omit<Evaluation, 'id'>) => void;
  onCancel: () => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  exercise, 
  performers, 
  onSubmit, 
  onCancel 
}) => {
  const [selectedPerformers, setSelectedPerformers] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [activeRubric, setActiveRubric] = useState<'base-reality' | 'game'>('base-reality');
  
  // Base Reality criteria
  const baseRealityCriteria: EvaluationCriterion[] = [
    { key: 'yesAnd', name: 'Yes And', description: 'Accept & add relevant, present-tense info' },
    { key: 'agreement', name: 'Agreement', description: 'Clear, responsive agreement (verbal & physical)' },
    { key: 'whoWhatWhere', name: 'Who/What/Where', description: 'Quickly/specifically establishes W/W/W' },
    { key: 'physicality', name: 'Object Work/Show Don\'t Tell', description: 'Believable & consistent environment' },
    { key: 'listening', name: 'Listening', description: 'Incorporates all partner offers' },
    { key: 'commitment', name: 'Commitment', description: 'Full, grounded, honest playing' },
    { key: 'avoidanceOfDenial', name: 'Avoidance of Denial', description: 'Never undermines or rejects offers' },
    { key: 'efficiency', name: 'Efficiency/Clarity', description: 'Defines reality quickly, no filler' },
  ];

  // Game of Scene criteria
  const gameCriteria: EvaluationCriterion[] = [
    { key: 'identification', name: 'Game Identification', description: 'Spot & frame first unusual thing clearly' },
    { key: 'building', name: 'Building Pattern', description: 'Solid, focused pattern established' },
    { key: 'heightening', name: 'Heightening', description: 'Logical escalation within pattern' },
    { key: 'exploration', name: 'Exploration', description: 'Believable "why?", smart logic' },
    { key: 'topOfIntelligence', name: 'Top of Intelligence', description: 'Realistic, emotionally honest reactions' },
    { key: 'teamwork', name: 'Agreement/Teamwork', description: 'Players support, don\'t sandbag/steamroll' },
    { key: 'gameListening', name: 'Listening During Game', description: 'Moves connect, no pattern jumping' },
    { key: 'clarity', name: 'Clarity of Game', description: 'One clear game, no crazy town' },
    { key: 'believability', name: 'Commitment/Believability', description: 'No winking/commentary, full buy-in' },
  ];

  const currentCriteria = activeRubric === 'base-reality' ? baseRealityCriteria : gameCriteria;

  const handleScoreChange = (criterion: string, value: string) => {
    setScores({ ...scores, [criterion]: parseInt(value) });
  };

  const handleSubmit = () => {
    const evaluationData: Omit<Evaluation, 'id'> = {
      teamId: exercise.teamId,
      performanceDate: new Date().toISOString(),
      performerNames: selectedPerformers.join(', '),
      notes,
      ...scores
    };
    onSubmit(evaluationData);
  };

  const getScoreColor = (score?: number): string => {
    if (!score) return 'bg-gray-700';
    if (score === 4) return 'bg-green-600';
    if (score === 3) return 'bg-yellow-600';
    if (score === 2) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Evaluate Scene</h2>
          <p className="text-gray-400 mt-1">{exercise.exerciseName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Rubric Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveRubric('base-reality')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeRubric === 'base-reality' 
              ? 'bg-yellow-500 text-gray-900' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Base Reality
        </button>
        <button
          onClick={() => setActiveRubric('game')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeRubric === 'game' 
              ? 'bg-yellow-500 text-gray-900' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Game of Scene
        </button>
      </div>

      {/* Performer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Performers in Scene
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {performers.map((performer) => (
            <label
              key={performer.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
                checked={selectedPerformers.includes(performer.firstName + ' ' + performer.lastName)}
                onChange={(e) => {
                  const name = performer.firstName + ' ' + performer.lastName;
                  if (e.target.checked) {
                    setSelectedPerformers([...selectedPerformers, name]);
                  } else {
                    setSelectedPerformers(selectedPerformers.filter(n => n !== name));
                  }
                }}
              />
              <span className="text-gray-300 text-sm">
                {performer.firstName} {performer.lastName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Scoring Grid */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-bold text-gray-100">
          {activeRubric === 'base-reality' ? 'Base Reality Evaluation' : 'Game of Scene Evaluation'}
        </h3>
        {currentCriteria.map((criterion) => (
          <div key={criterion.key} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                <p className="text-sm text-gray-400">{criterion.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-white font-bold ${getScoreColor(scores[criterion.key])}`}>
                {scores[criterion.key] || '—'}
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              {[1, 2, 3, 4].map((score) => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(criterion.key, score.toString())}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    scores[criterion.key] === score
                      ? 'bg-yellow-500 text-gray-900 font-bold scale-105'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes & Feedback
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          placeholder="Specific feedback, moments to highlight, areas for improvement..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={selectedPerformers.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Evaluation
        </Button>
      </div>
    </Card>
  );
};
```

## New Features Added:
1. **Live Practice Mode** - Complete practice session management
2. **Evaluation System** - Performance evaluation with UCB rubrics
3. **Enhanced API modules** - New evaluation endpoints and team performer data
4. **Updated UI components** - New button variant and additional functionality

Here are the new files to add to your structure:## Summary

I've isolated and organized all the new features your developer added into separate TypeScript files that fit your current structure. Here's what they built:

### 🎭 **New Features Overview**:
1. **Live Practice Mode** - Complete practice session management with timer
2. **Evaluation System** - UCB rubric-based scoring (Base Reality & Game of Scene)
3. **Enhanced API** - New endpoints for evaluations and team data
4. **Practice Integration** - Direct launch from dashboard

### 📁 **Files to Add**:
- `EvaluationForm.tsx` - Performance evaluation component
- `LivePracticeMode.tsx` - Full practice session page
- `evaluations.ts` - New API module

### 🔧 **Files to Update**:
- Types, API modules, Button component, and Dashboard

### ✅ **No New Dependencies**:
Everything uses your existing packages (React, TypeScript, lucide-react, Tailwind)

### 🚀 **Quick Start**:
1. Add the new type definitions first
2. Create the new files
3. Update existing files with the new code
4. Test by starting a practice session from the dashboard

The integration guide and checklist artifacts contain all the details you need. Since everything is already working, you can add these features incrementally without breaking your current setup!
