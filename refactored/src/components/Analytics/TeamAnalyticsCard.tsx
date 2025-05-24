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