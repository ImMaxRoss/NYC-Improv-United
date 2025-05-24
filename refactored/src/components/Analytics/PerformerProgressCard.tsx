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