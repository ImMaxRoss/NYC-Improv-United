import React from 'react';
import { Clock, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { PracticeStats as Stats } from '../../../types';

interface PracticeStatsProps {
  stats: Stats;
  currentExercise: number;
  totalExercises: number;
}

export const PracticeStats: React.FC<PracticeStatsProps> = ({
  stats,
  currentExercise,
  totalExercises
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const progressPercentage = totalExercises > 0 ? (currentExercise / totalExercises) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Session Time</p>
            <p className="text-2xl font-bold text-gray-100 mt-1">
              {formatDuration(stats.totalDuration)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500 bg-opacity-20">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Progress</p>
            <p className="text-2xl font-bold text-gray-100 mt-1">
              {currentExercise}/{totalExercises}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-500 bg-opacity-20">
            <BarChart3 className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Evaluations</p>
            <p className="text-2xl font-bold text-gray-100 mt-1">
              {stats.evaluationsCompleted}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500 bg-opacity-20">
            <CheckCircle className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Attendance</p>
            <p className="text-2xl font-bold text-gray-100 mt-1">
              {stats.attendanceCount}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500 bg-opacity-20">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};
