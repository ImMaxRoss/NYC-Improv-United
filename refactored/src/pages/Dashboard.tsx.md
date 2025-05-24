## src/pages/Dashboard.tsx - Updated with Live Practice integration
```tsx
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

```



## src/pages/Dashboard.tsx - Updated to include analytics preview
```tsx
import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Star, Play, Plus, ChevronRight, Sparkles, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { lessonsAPI } from '../api/modules/lessons';
import { exercisesAPI } from '../api/modules/exercises';
import { teamsAPI } from '../api/modules/teams';
import { analyticsAPI } from '../api/modules/analytics';
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
  
  // Analytics preview data
  const { data: coachingInsights } = useApi(() => analyticsAPI.getCoachingInsights({ timeRange: '30d' }));
  const { data: performerProgress } = useApi(() => analyticsAPI.getPerformerProgress({ timeRange: '30d' }));

  const handleStartPractice = (lessonId: number) => {
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

  // Calculate analytics preview stats
  const avgScore = performerProgress 
    ? (performerProgress.reduce((sum, p) => sum + p.overallProgress, 0) / performerProgress.length).toFixed(1)
    : '0.0';
  
  const improvingPerformers = performerProgress 
    ? performerProgress.filter(p => Object.values(p.focusAreaScores).some(score => score.trend === 'improving')).length
    : 0;

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
            icon={TrendingUp} 
            label="Avg Score" 
            value={avgScore} 
            color="bg-green-500 text-green-500" 
          />
          <StatCard 
            icon={BarChart3} 
            label="Improving" 
            value={improvingPerformers} 
            color="bg-purple-500 text-purple-500" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
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
                <h3 className="text-lg font-bold text-gray-100">Plan Lesson</h3>
                <p className="text-gray-400 text-sm">Create practice</p>
              </div>
            </div>
          </Card>

          <Card 
            hoverable 
            className="p-6 cursor-pointer"
            onClick={() => window.location.href = '/analytics'}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Analytics</h3>
                <p className="text-gray-400 text-sm">View insights</p>
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
                <p className="text-gray-400 text-sm">Run live session</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-6 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Exercises</h3>
                <p className="text-gray-400 text-sm">Browse library</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Lessons */}
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

          {/* Popular Exercises */}
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

          {/* Analytics Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-100">Quick Insights</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/analytics'}
              >
                View Analytics
              </Button>
            </div>

            {coachingInsights ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-500 to-green-500 bg-opacity-20 rounded-lg">
                  <div className="text-2xl font-bold text-gray-100">
                    {(coachingInsights.overallTeachingEffectiveness * 100).toFixed(0)}%
                  </div>
                  <div className="text-gray-300 text-sm">Teaching Effectiveness</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <div className="text-lg font-bold text-blue-400">{coachingInsights.totalPractices}</div>
                    <div className="text-gray-400 text-xs">Practices</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <div className="text-lg font-bold text-purple-400">{coachingInsights.totalEvaluations}</div>
                    <div className="text-gray-400 text-xs">Evaluations</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-100 mb-2 text-sm">Recent Strengths</h4>
                  <div className="space-y-1">
                    {coachingInsights.coachingStrengths.slice(0, 2).map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-green-300 text-xs">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Analytics will appear after conducting practice sessions</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};
```