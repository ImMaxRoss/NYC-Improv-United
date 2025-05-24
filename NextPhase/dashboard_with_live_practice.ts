// src/pages/Dashboard.tsx - Updated with Live Practice integration
import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Star, Play, Plus, Search, Menu, X, LogOut, ChevronRight, Sparkles, Filter, Grid, List, Loader2 } from 'lucide-react';
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

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'planner'>('dashboard');
  
  const { data: upcomingLessons, loading: lessonsLoading } = useApi(() => lessonsAPI.getUpcoming());
  const { data: popularExercises, loading: exercisesLoading } = useApi(() => exercisesAPI.getPopular(5));
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());

  const handleStartPractice = (lessonId: number) => {
    // Navigate to live practice mode
    window.location.href = `/live-practice/${lessonId}`;
  };

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
                <p className="text-gray-400 text-sm">Run a live session with any lesson</p>
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

        {/* Upcoming Lessons & Popular Exercises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
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
              <div className="space-y-2">
                {upcomingLessons?.slice(0, 3).map((lesson) => (
                  <div key={lesson.id} className="group">
                    <UpcomingLesson lesson={lesson} />
                    {/* Enhanced with Start Practice button */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        onClick={() => handleStartPractice(lesson.id)}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Practice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

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
        </div>
      </main>
    </div>
  );
};

// ===========================================
// src/App.tsx - Updated with routing for Live Practice
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

// ===========================================
// Updated package.json dependencies - Add these to your package.json
/*
{
  "dependencies": {
    "react-router-dom": "^6.8.1"
  },
  "devDependencies": {
    "@types/react-router-dom": "^5.3.3"
  }
}
*/

// ===========================================
// src/components/UpcomingLesson.tsx - Enhanced version with practice starter
import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { Lesson } from '../types';
import { Button } from './ui/Button';

interface UpcomingLessonProps {
  lesson: Lesson;
  onStartPractice?: (lessonId: number) => void;
}

export const UpcomingLesson: React.FC<UpcomingLessonProps> = ({ 
  lesson, 
  onStartPractice 
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
    }
  };

  const isToday = () => {
    const lessonDate = new Date(lesson.scheduledDate);
    const today = new Date();
    return lessonDate.toDateString() === today.toDateString();
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          isToday() 
            ? 'bg-green-500 bg-opacity-20' 
            : 'bg-yellow-500 bg-opacity-20'
        }`}>
          <Calendar className={`h-6 w-6 ${
            isToday() ? 'text-green-500' : 'text-yellow-500'
          }`} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-gray-100 font-medium">
          {lesson.name || `${lesson.teamName} Practice`}
          {isToday() && (
            <span className="ml-2 px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full">
              Today
            </span>
          )}
        </h4>
        <p className="text-gray-400 text-sm">
          {lesson.teamName} • {formatDate(lesson.scheduledDate)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{lesson.formattedDuration}</p>
        <p className="text-gray-500 text-xs">{lesson.exerciseCount} exercises</p>
        {isToday() && onStartPractice && (
          <Button
            size="sm"
            onClick={() => onStartPractice(lesson.id)}
            className="mt-2"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>
        )}
      </div>
    </div>
  );
};

// ===========================================
// Installation and Setup Instructions
/*

1. Install React Router:
npm install react-router-dom @types/react-router-dom

2. Add the new Live Practice files to your src directory:
   - src/pages/LivePractice.tsx
   - src/components/LivePractice/PracticeTimer.tsx
   - src/components/LivePractice/AttendanceSelector.tsx
   - src/components/LivePractice/SceneEvaluationModal.tsx
   - src/components/LivePractice/PracticeStats.tsx
   - src/api/modules/practice.ts

3. Update your existing files:
   - src/types/index.ts (add the new types)
   - src/pages/Dashboard.tsx (replace with enhanced version)
   - src/App.tsx (add routing)
   - src/components/UpcomingLesson.tsx (enhance with start practice)

4. Key Features Implemented:

   🎯 Live Practice Mode:
   - Pre-practice setup with attendance
   - Real-time timer with play/pause/reset
   - Exercise navigation with progress tracking
   - Live stats dashboard

   📊 Dynamic Evaluation System:
   - Two rubric types (Base Reality & Game of Scene)
   - Visual 1-4 scoring with color coding
   - Performer selection checkboxes
   - Notes section for feedback

   🎨 Visual Enhancements:
   - Progress bars and completion tracking
   - Color-coded scoring (Green=4, Yellow=3, Orange=2, Red=1)
   - Smooth transitions between phases
   - Real-time statistics cards

   🔄 Practice Flow:
   1. Select lesson from dashboard → Live Practice
   2. Take attendance (checkboxes)
   3. Start practice timer
   4. Navigate between exercises
   5. Evaluate scenes with dynamic rubrics
   6. Complete practice with summary

   🎭 Coach Experience:
   - Intuitive timer controls
   - Focus area highlighting
   - Real-time attendance tracking
   - Exercise notes display
   - Evaluation history sidebar

5. To test the Live Practice feature:
   - Navigate to dashboard
   - Click "Start Practice" on any upcoming lesson
   - Or use direct URL: /live-practice/1 (replace 1 with lesson ID)

The implementation follows your design philosophy of "playful professionalism" with:
- Bold yellow accents for primary actions
- Smooth animations and transitions
- Comedy-themed empty states with owl mascot
- Professional coaching tools with fun personality
- Color-coded feedback system
- Intuitive navigation patterns

*/