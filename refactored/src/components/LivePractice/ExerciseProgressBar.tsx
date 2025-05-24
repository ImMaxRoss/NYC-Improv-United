import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { LessonExercise } from '../../types';
import { Card } from '../ui/Card';

interface ExerciseProgressBarProps {
  exercises: LessonExercise[];
  currentIndex: number;
  onExerciseClick?: (index: number) => void;
}

export const ExerciseProgressBar: React.FC<ExerciseProgressBarProps> = ({
  exercises,
  currentIndex,
  onExerciseClick
}) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium text-gray-100 mb-3">Lesson Progress</h3>
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={exercise.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer ${
                isActive 
                  ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-50' 
                  : isCompleted
                  ? 'bg-green-500 bg-opacity-10 hover:bg-green-500 hover:bg-opacity-20'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => onExerciseClick && onExerciseClick(index)}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : isActive ? (
                  <Clock className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${
                  isActive ? 'text-yellow-100' : 
                  isCompleted ? 'text-green-100' : 'text-gray-300'
                }`}>
                  {exercise.exerciseName}
                </h4>
                <p className={`text-xs ${
                  isActive ? 'text-yellow-200' : 
                  isCompleted ? 'text-green-200' : 'text-gray-400'
                }`}>
                  {exercise.formattedDuration}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {exercise.focusAreas?.slice(0, 2).map((area, areaIndex) => (
                  <span
                    key={areaIndex}
                    className={`px-2 py-1 text-xs rounded ${
                      isActive
                        ? 'bg-yellow-600 text-yellow-100'
                        : isCompleted
                        ? 'bg-green-600 text-green-100'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {area.name}
                  </span>
                ))}
                {exercise.focusAreas && exercise.focusAreas.length > 2 && (
                  <span className={`px-2 py-1 text-xs rounded ${
                    isActive
                      ? 'bg-yellow-600 text-yellow-100'
                      : isCompleted
                      ? 'bg-green-600 text-green-100'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    +{exercise.focusAreas.length - 2}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0}%` 
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{currentIndex} completed</span>
        <span>{exercises.length} total</span>
      </div>
    </Card>
  );
};