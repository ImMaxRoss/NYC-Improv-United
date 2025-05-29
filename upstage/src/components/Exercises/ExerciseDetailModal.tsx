import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  Star, 
  StarOff, 
  Copy, 
  Edit, 
  Play,
  BookOpen,
  Lightbulb,
  Target,
  Package
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseDetailed } from '../../types';

interface ExerciseDetailModalProps {
  exercise: ExerciseDetailed;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (exercise: ExerciseDetailed) => void;
  onDuplicate?: (exercise: ExerciseDetailed) => void;
  onToggleFavorite?: (exerciseId: number) => void;
  onAddToLesson?: (exercise: ExerciseDetailed) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onAddToLesson
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'variations' | 'tips'>('overview');

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 bg-opacity-20 text-green-300';
      case 'Medium': return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'Hard': return 'bg-red-500 bg-opacity-20 text-red-300';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-100">{exercise.name}</h2>
                {exercise.popular && (
                  <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 text-xs rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty || 'Any Level'}
                </span>
                
                <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 text-xs rounded flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {exercise.formattedMinimumDuration}
                </span>
                
                <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-300 text-xs rounded">
                  {getGroupSizeIcon(exercise.groupSize)} {exercise.groupSize || 'Any Size'}
                </span>
                
                {exercise.usageCount > 0 && (
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-300 text-xs rounded">
                    Used {exercise.usageCount}x
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {exercise.focusAreas.map((area) => (
                  <span
                    key={area.id}
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: `${area.colorCode}20`, 
                      color: area.colorCode 
                    }}
                  >
                    {area.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite && onToggleFavorite(exercise.id)}
              >
                {exercise.favorite ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="h-4 w-4" />
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
              
              {onEdit && exercise.createdByCoachId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(exercise)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex space-x-0">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'instructions', label: 'Instructions', icon: Target },
                { id: 'variations', label: 'Variations', icon: Package },
                { id: 'tips', label: 'Tips', icon: Lightbulb }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-300 bg-yellow-500 bg-opacity-10'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-100 mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{exercise.description}</p>
                </div>

                {exercise.materials && exercise.materials.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-100 mb-3">Materials Needed</h3>
                    <ul className="space-y-2">
                      {exercise.materials.map((material, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-300">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-100 mb-2">Exercise Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-gray-100">{exercise.formattedMinimumDuration}+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Group Size:</span>
                        <span className="text-gray-100">{exercise.groupSize || 'Flexible'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Difficulty:</span>
                        <span className="text-gray-100">{exercise.difficulty || 'Any Level'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Times Used:</span>
                        <span className="text-gray-100">{exercise.usageCount}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium text-gray-100 mb-2">Source</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-gray-100">
                          {exercise.public ? 'Community' : 'Custom'}
                        </span>
                      </div>
                      {exercise.createdByCoachName && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created by:</span>
                          <span className="text-gray-100">{exercise.createdByCoachName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-gray-100">
                          {new Date(exercise.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {exercise.hasDefaultEvaluationTemplate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Evaluation:</span>
                          <span className="text-gray-100">{exercise.defaultEvaluationTemplateName}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div>
                <h3 className="text-lg font-bold text-gray-100 mb-4">Step-by-Step Instructions</h3>
                {exercise.instructions ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300">{exercise.instructions}</div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No detailed instructions available for this exercise.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Use the description as your guide, or add instructions if this is your custom exercise.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'variations' && (
              <div>
                <h3 className="text-lg font-bold text-gray-100 mb-4">Exercise Variations</h3>
                {exercise.variations && exercise.variations.length > 0 ? (
                  <div className="space-y-4">
                    {exercise.variations.map((variation, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium text-gray-100 mb-2">Variation {index + 1}</h4>
                        <p className="text-gray-300">{variation}</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No variations documented for this exercise.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try experimenting with different constraints, emotions, or scenarios!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h3 className="text-lg font-bold text-gray-100 mb-4">Coaching Tips</h3>
                {exercise.tips && exercise.tips.length > 0 ? (
                  <div className="space-y-3">
                    {exercise.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-200">{tip}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No coaching tips available for this exercise.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Consider what to watch for and how to guide students through this exercise.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {onAddToLesson && (
              <Button onClick={() => onAddToLesson(exercise)}>
                <Play className="h-4 w-4 mr-2" />
                Add to Lesson
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};