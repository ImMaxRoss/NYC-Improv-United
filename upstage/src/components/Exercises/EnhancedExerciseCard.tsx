import React from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  StarOff, 
  Eye, 
  Play, 
  Heart, 
  Copy,
  MoreVertical,
  Bookmark,
  BookmarkCheck,
  FileText
} from 'lucide-react';
import { ExerciseDetailed } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EnhancedExerciseCardProps {
  exercise: ExerciseDetailed;
  onView?: (exercise: ExerciseDetailed) => void;
  onAddToLesson?: (exercise: ExerciseDetailed) => void;
  onToggleFavorite?: (exerciseId: number) => void;
  onDuplicate?: (exercise: ExerciseDetailed) => void;
  compact?: boolean;
}

export const EnhancedExerciseCard: React.FC<EnhancedExerciseCardProps> = ({
  exercise,
  onView,
  onAddToLesson,
  onToggleFavorite,
  onDuplicate,
  compact = false
}) => {
  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 bg-opacity-20 text-green-300 border-green-500';
      case 'Medium': return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500';
      case 'Hard': return 'bg-red-500 bg-opacity-20 text-red-300 border-red-500';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-500';
    }
  };

  const getGroupSizeIcon = (groupSize?: string) => {
    switch (groupSize) {
      case 'Individual': return '👤';
      case 'Pairs': return '👥';
      case 'Small Group': return '👥👥';
      case 'Large Group': return '👥👥👥';
      default: return '🎭';
    }
  };

  return (
    <Card hoverable className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-100 truncate">{exercise.name}</h3>
              {exercise.popular && (
                <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
              {exercise.favorite && (
                <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
              )}
            </div>
            
            <p className={`text-gray-400 text-sm ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
              {exercise.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite && onToggleFavorite(exercise.id)}
            >
              {exercise.favorite ? (
                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(exercise)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Exercise Details */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded border text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty || 'Any Level'}
          </span>
          
          <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 text-xs rounded flex items-center border border-blue-500 border-opacity-30">
            <Clock className="h-3 w-3 mr-1" />
            {exercise.formattedMinimumDuration}
          </span>
          
          <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-300 text-xs rounded border border-purple-500 border-opacity-30">
            {getGroupSizeIcon(exercise.groupSize)} {exercise.groupSize || 'Any Size'}
          </span>
          
          {/* Add this block for evaluation template indicator */}
          {exercise.hasDefaultEvaluationTemplate && (
            <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-300 text-xs rounded flex items-center border border-green-500 border-opacity-30">
              <FileText className="h-3 w-3 mr-1" />
              Evaluation
            </span>
          )}
          
          {exercise.usageCount > 0 && (
            <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-300 text-xs rounded border border-gray-500 border-opacity-30">
              Used {exercise.usageCount}x
            </span>
          )}
        </div>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2">
          {exercise.focusAreas.slice(0, 3).map((area, index) => (
            <span
              key={area.id}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: `${area.colorCode}20`, 
                color: area.colorCode,
                border: `1px solid ${area.colorCode}30`
              }}
            >
              {area.name}
            </span>
          ))}
          {exercise.focusAreas.length > 3 && (
            <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
              +{exercise.focusAreas.length - 3} more
            </span>
          )}
        </div>

        {/* Materials & Source */}
        {!compact && (
          <div className="space-y-2">
            {exercise.materials && exercise.materials.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">Materials:</span>
                <span className="text-gray-300 text-xs">
                  {exercise.materials.slice(0, 2).join(', ')}
                  {exercise.materials.length > 2 && ` +${exercise.materials.length - 2} more`}
                </span>
              </div>
            )}
            
            {exercise.createdByCoachName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  by {exercise.createdByCoachName}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(exercise.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView && onView(exercise)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          {onAddToLesson && (
            <Button
              size="sm"
              onClick={() => onAddToLesson(exercise)}
            >
              <Play className="h-4 w-4 mr-2" />
              Add to Lesson
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};