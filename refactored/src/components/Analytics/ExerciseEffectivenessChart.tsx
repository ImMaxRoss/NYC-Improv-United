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