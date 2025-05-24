// src/types/index.ts - Add analytics and reporting types

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

// ===========================================
// src/components/Analytics/PerformerProgressCard.tsx - Individual performer analytics

import React from 'react';
import { TrendingUp, TrendingDown, Minus, User, Calendar, Target } from 'lucide-react';
import { PerformerProgress } from '../../types';
import { Card } from '../ui/Card';

interface PerformerProgressCardProps {
  progress: PerformerProgress;
  onViewDetails?: (performerId: number) => void;
}

export const PerformerProgressCard: React.FC<PerformerProgressCardProps> = ({
  progress,
  onViewDetails
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAttendanceColor = (rate: number): string => {
    if (rate >= 0.8) return 'text-green-400';
    if (rate >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card 
      hoverable 
      className="p-6 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(progress.performerId)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-300" />
            </div>
            <div>
              <h3 className="font-medium text-gray-100">{progress.performerName}</h3>
              <p className="text-gray-400 text-sm">
                {Math.round(progress.attendanceRate * 100)}% attendance
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-100">
              {progress.overallProgress.toFixed(1)}
            </div>
            <div className="text-gray-400 text-xs">Overall Score</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Overall Progress</span>
              <span className="text-gray-400">{progress.overallProgress.toFixed(1)}/4.0</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(progress.overallProgress / 4) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Attendance Rate</span>
              <span className={getAttendanceColor(progress.attendanceRate)}>
                {Math.round(progress.attendanceRate * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  progress.attendanceRate >= 0.8 ? 'bg-green-500' :
                  progress.attendanceRate >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${progress.attendanceRate * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Focus Area Trends */}
        <div>
          <h4 className="font-medium text-gray-100 mb-2 text-sm">Focus Area Trends</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(progress.focusAreaScores).slice(0, 4).map(([area, score]) => (
              <div key={area} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 truncate">{area}</span>
                <div className="flex items-center space-x-1">
                  <span className={getTrendColor(score.trend)}>{score.current.toFixed(1)}</span>
                  {getTrendIcon(score.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Last evaluated: {new Date(progress.lastEvaluated).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{Object.keys(progress.focusAreaScores).length} areas tracked</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ===========================================
// src/components/Analytics/TeamAnalyticsCard.tsx - Team performance overview

import React from 'react';
import { Users, TrendingUp, Calendar, BarChart3, Award } from 'lucide-react';
import { TeamAnalytics } from '../../types';
import { Card } from '../ui/Card';

interface TeamAnalyticsCardProps {
  analytics: TeamAnalytics;
  onViewDetails?: (teamId: number) => void;
}

export const TeamAnalyticsCard: React.FC<TeamAnalyticsCardProps> = ({
  analytics,
  onViewDetails
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 3.5) return 'text-green-400';
    if (score >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImprovementColor = (improvement: number): string => {
    if (improvement > 0) return 'text-green-400';
    if (improvement < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card 
      hoverable 
      className="p-6 cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(analytics.teamId)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-100">{analytics.teamName}</h3>
            <p className="text-gray-400 text-sm">
              {analytics.performerCount} performers • {analytics.practicesCompleted} practices
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
              {analytics.averageScore.toFixed(1)}
            </div>
            <div className="text-gray-400 text-xs">Avg Score</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-gray-100">
              {Math.round(analytics.attendanceRate * 100)}%
            </div>
            <div className="text-gray-400 text-xs">Attendance</div>
          </div>
          
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className={`text-lg font-bold ${getImprovementColor(analytics.scoreImprovement)}`}>
              {analytics.scoreImprovement > 0 ? '+' : ''}{analytics.scoreImprovement.toFixed(1)}
            </div>
            <div className="text-gray-400 text-xs">Improvement</div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <Award className="h-4 w-4 mr-2 text-green-500" />
              Top Strengths
            </h4>
            <div className="space-y-1">
              {analytics.strengthsAndWeaknesses.strengths.slice(0, 2).map((strength, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-green-300">{strength.area}</span>
                  <span className="text-green-400">{strength.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-red-500" />
              Areas for Growth
            </h4>
            <div className="space-y-1">
              {analytics.strengthsAndWeaknesses.weaknesses.slice(0, 2).map((weakness, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-red-300">{weakness.area}</span>
                  <span className="text-red-400">{weakness.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Progress Chart */}
        <div>
          <h4 className="font-medium text-gray-100 mb-2 text-sm">Progress Trend</h4>
          <div className="flex items-end space-x-1 h-8">
            {analytics.progressTrend.slice(-8).map((point, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-yellow-500 to-green-500 rounded-t flex-1 transition-all duration-300"
                style={{ height: `${(point.score / 4) * 100}%` }}
                title={`${point.date}: ${point.score.toFixed(1)}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="pt-3 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{analytics.evaluationsCompleted} evaluations</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{analytics.practicesCompleted} practices</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ===========================================
// src/components/Analytics/ExerciseEffectivenessChart.tsx - Exercise performance visualization

import React from 'react';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { ExerciseEffectiveness } from '../../types';
import { Card } from '../ui/Card';

interface ExerciseEffectivenessChartProps {
  exercises: ExerciseEffectiveness[];
  onExerciseClick?: (exerciseId: number) => void;
}

export const ExerciseEffectivenessChart: React.FC<ExerciseEffectivenessChartProps> = ({
  exercises,
  onExerciseClick
}) => {
  const maxUsage = Math.max(...exercises.map(e => e.usageCount));
  
  const getEffectivenessColor = (score: number): string => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-100">Exercise Effectiveness</h3>
        </div>
        <div className="text-gray-400 text-sm">Top {exercises.length} exercises</div>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.exerciseId}
            className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => onExerciseClick && onExerciseClick(exercise.exerciseId)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">{exercise.exerciseName}</h4>
                <p className="text-gray-400 text-sm">Used {exercise.usageCount} times</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-100">
                    {(exercise.effectivenessScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-gray-400 text-xs">Effectiveness</div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-100">
                    {exercise.averageRating.toFixed(1)}
                  </div>
                  <div className="text-gray-400 text-xs">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Usage Frequency</span>
                <span>{exercise.usageCount} uses</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(exercise.usageCount / maxUsage) * 100}%` }}
                />
              </div>
            </div>

            {/* Effectiveness Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Effectiveness Score</span>
                <span>{(exercise.effectivenessScore * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getEffectivenessColor(exercise.effectivenessScore)}`}
                  style={{ width: `${exercise.effectivenessScore * 100}%` }}
                />
              </div>
            </div>

            {/* Focus Area Impact */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Most Effective For:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(exercise.focusAreaImpact)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([area, impact]) => (
                    <span
                      key={area}
                      className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 text-xs rounded"
                    >
                      {area} ({(impact * 100).toFixed(0)}%)
                    </span>
                  ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-600">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>Avg {exercise.timeSpentAverage}min</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Target className="h-3 w-3" />
                <span>Recommended for {exercise.recommendedFor.length} levels</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ===========================================
// src/components/Analytics/CoachingInsightsWidget.tsx - Overall coaching performance

import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar,
  Users,
  BarChart3,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { CoachingInsights } from '../../types';
import { Card } from '../ui/Card';

interface CoachingInsightsWidgetProps {
  insights: CoachingInsights;
}

export const CoachingInsightsWidget: React.FC<CoachingInsightsWidgetProps> = ({
  insights
}) => {
  const getEffectivenessColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-100">Coaching Performance</h3>
          </div>
          <div className={`text-2xl font-bold ${getEffectivenessColor(insights.overallTeachingEffectiveness)}`}>
            {(insights.overallTeachingEffectiveness * 100).toFixed(0)}%
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-blue-400">{insights.totalPractices}</div>
              <div className="text-gray-400 text-xs">Total Practices</div>
            </div>
            
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-purple-400">{insights.totalEvaluations}</div>
              <div className="text-gray-400 text-xs">Evaluations Given</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Teaching Effectiveness</span>
              <span>{(insights.overallTeachingEffectiveness * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${insights.overallTeachingEffectiveness * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Average session: {insights.averageSessionLength} minutes</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Strengths & Development Areas */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-100">Growth Areas</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
              Your Coaching Strengths
            </h4>
            <div className="space-y-2">
              {insights.coachingStrengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-300 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-100 mb-2 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Areas for Development
            </h4>
            <div className="space-y-2">
              {insights.areasForDevelopment.slice(0, 3).map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-yellow-300 text-sm">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card className="p-6 lg:col-span-2">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-100">Monthly Activity</h3>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {insights.monthlyActivity.slice(-6).map((month, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-100">{month.month}</div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="bg-gray-700 rounded-full h-20 w-8 mx-auto flex flex-col justify-end overflow-hidden">
                    <div
                      className="bg-blue-500 rounded-b-full transition-all duration-500"
                      style={{ height: `${Math.min((month.practices / 20) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-blue-400 mt-1">{month.practices}p</div>
                </div>
                
                <div className="relative">
                  <div className="bg-gray-700 rounded-full h-16 w-6 mx-auto flex flex-col justify-end overflow-hidden">
                    <div
                      className="bg-purple-500 rounded-b-full transition-all duration-500"
                      style={{ height: `${Math.min((month.evaluations / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-purple-400 mt-1">{month.evaluations}e</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-400 text-sm">Practices</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-gray-400 text-sm">Evaluations</span>
          </div>
        </div>
      </Card>
    </div>
  );
};