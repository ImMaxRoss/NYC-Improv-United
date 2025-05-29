import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Exercise } from '../types';
import { Card } from './ui/Card';

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => void;
  onClick?: () => void; 
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAdd, onClick }) => {
  const focusAreaColors: Record<string, string> = {
    'Yes And': 'bg-green-500',
    'Listening': 'bg-red-500',
    'Who/What/Where': 'bg-orange-500',
    'Physicality': 'bg-purple-500',
    'Agreement': 'bg-blue-500',
    'Commitment': 'bg-indigo-500',
  };

  return (
    <Card hoverable className="p-6" onClick={onClick}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-100">{exercise.name}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {exercise.formattedMinimumDuration || `${exercise.minimumDurationMinutes} min`}
          </div>
          {onAdd && (
            <button
              onClick={() => onAdd(exercise)}
              className="text-yellow-500 hover:text-yellow-400"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{exercise.description}</p>
      <div className="flex flex-wrap gap-2">
        {exercise.focusAreas?.map((area, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium text-gray-900 ${
              focusAreaColors[area.name] || 'bg-gray-600'
            }`}
          >
            {area.name}
          </span>
        ))}
      </div>
      {exercise.createdByCoachName && (
        <p className="text-gray-500 text-xs mt-3">Created by {exercise.createdByCoachName}</p>
      )}
    </Card>
  );
};