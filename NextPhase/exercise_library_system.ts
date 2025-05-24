// src/types/index.ts - Add these exercise library types

export interface FocusArea {
  id: number;
  name: string;
  description: string;
  colorCode: string;
}

export interface ExerciseDetailed {
  id: number;
  name: string;
  description: string;
  minimumDurationMinutes: number;
  formattedMinimumDuration: string;
  createdByCoachId?: number;
  createdByCoachName?: string;
  createdAt: string;
  updatedAt: string;
  focusAreas: FocusArea[];
  hasDefaultEvaluationTemplate: boolean;
  defaultEvaluationTemplateName?: string;
  usageCount: number;
  popular: boolean;
  favorite: boolean;
  durationInfo: string;
  public: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  groupSize?: 'Individual' | 'Pairs' | 'Small Group' | 'Large Group' | 'Any';
  materials?: string[];
  instructions?: string;
  variations?: string[];
  tips?: string[];
}

export interface ExerciseCreateRequest {
  name: string;
  description: string;
  minimumDurationMinutes: number;
  focusAreaIds: number[];
  public: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  groupSize?: 'Individual' | 'Pairs' | 'Small Group' | 'Large Group' | 'Any';
  materials?: string[];
  instructions?: string;
  variations?: string[];
  tips?: string[];
  evaluationTemplateName?: string;
}

export interface ExerciseFilter {
  searchTerm?: string;
  focusAreaIds?: number[];
  difficulty?: string;
  groupSize?: string;
  maxDuration?: number;
  minDuration?: number;
  source?: 'all' | 'public' | 'custom' | 'favorites';
  sortBy?: 'name' | 'popularity' | 'duration' | 'created' | 'updated';
  sortDirection?: 'ASC' | 'DESC';
}

// ===========================================
// src/components/Exercises/ExerciseDetailModal.tsx - Detailed exercise view

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

// ===========================================
// src/components/Exercises/CreateExerciseModal.tsx - Exercise creation form

import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseCreateRequest, FocusArea } from '../../types';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseCreateRequest) => void;
  focusAreas: FocusArea[];
  loading?: boolean;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  focusAreas,
  loading = false
}) => {
  const [formData, setFormData] = useState<ExerciseCreateRequest>({
    name: '',
    description: '',
    minimumDurationMinutes: 10,
    focusAreaIds: [],
    public: false,
    difficulty: 'Easy',
    groupSize: 'Any',
    materials: [],
    instructions: '',
    variations: [],
    tips: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMaterial, setNewMaterial] = useState('');
  const [newVariation, setNewVariation] = useState('');
  const [newTip, setNewTip] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.minimumDurationMinutes < 1) {
      newErrors.minimumDurationMinutes = 'Duration must be at least 1 minute';
    }
    
    if (formData.focusAreaIds.length === 0) {
      newErrors.focusAreaIds = 'Please select at least one focus area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minimumDurationMinutes: 10,
      focusAreaIds: [],
      public: false,
      difficulty: 'Easy',
      groupSize: 'Any',
      materials: [],
      instructions: '',
      variations: [],
      tips: []
    });
    setErrors({});
    setNewMaterial('');
    setNewVariation('');
    setNewTip('');
  };

  const handleChange = (field: keyof ExerciseCreateRequest, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addListItem = (field: 'materials' | 'variations' | 'tips', value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      handleChange(field, [...(formData[field] as string[]), value.trim()]);
      setValue('');
    }
  };

  const removeListItem = (field: 'materials' | 'variations' | 'tips', index: number) => {
    const currentList = formData[field] as string[];
    handleChange(field, currentList.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">Create New Exercise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Emotional Orchestra, Word Association"
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe what this exercise is and how it works..."
                  className={`w-full h-24 px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formData.minimumDurationMinutes}
                    onChange={(e) => handleChange('minimumDurationMinutes', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500 ${
                      errors.minimumDurationMinutes ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.minimumDurationMinutes && <p className="text-red-400 text-sm mt-1">{errors.minimumDurationMinutes}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Group Size
                  </label>
                  <select
                    value={formData.groupSize}
                    onChange={(e) => handleChange('groupSize', e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Any">Any Size</option>
                    <option value="Individual">Individual</option>
                    <option value="Pairs">Pairs</option>
                    <option value="Small Group">Small Group (3-6)</option>
                    <option value="Large Group">Large Group (7+)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Focus Areas */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Focus Areas *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {focusAreas.map((area) => (
                <label
                  key={area.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.focusAreaIds.includes(area.id)
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.focusAreaIds.includes(area.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange('focusAreaIds', [...formData.focusAreaIds, area.id]);
                      } else {
                        handleChange('focusAreaIds', formData.focusAreaIds.filter(id => id !== area.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: area.colorCode }}
                  />
                  <span className="text-gray-100 text-sm">{area.name}</span>
                </label>
              ))}
            </div>
            {errors.focusAreaIds && <p className="text-red-400 text-sm mt-2">{errors.focusAreaIds}</p>}
          </Card>

          {/* Materials */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Materials Needed (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="e.g., Chairs, Props, Music"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('materials', newMaterial, setNewMaterial)}
                  disabled={!newMaterial.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.materials && formData.materials.length > 0 && (
                <div className="space-y-2">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-gray-100">{material}</span>
                      <button
                        onClick={() => removeListItem('materials', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Detailed Instructions (Optional)</h3>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="Step-by-step instructions for running this exercise..."
              className="w-full h-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </Card>

          {/* Variations */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Variations (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newVariation}
                  onChange={(e) => setNewVariation(e.target.value)}
                  placeholder="Describe a variation of this exercise..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('variations', newVariation, setNewVariation)}
                  disabled={!newVariation.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.variations && formData.variations.length > 0 && (
                <div className="space-y-2">
                  {formData.variations.map((variation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-700 rounded">
                      <span className="flex-1 text-gray-100">{variation}</span>
                      <button
                        onClick={() => removeListItem('variations', index)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Coaching Tips (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="What should coaches watch for or emphasize?"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('tips', newTip, setNewTip)}
                  disabled={!newTip.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tips && formData.tips.length > 0 && (
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded">
                      <span className="flex-1 text-yellow-200">{tip}</span>
                      <button
                        onClick={() => removeListItem('tips', index)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.public}
                  onChange={(e) => handleChange('public', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <div>
                  <div className="text-gray-100 font-medium">Make this exercise public</div>
                  <div className="text-gray-400 text-sm">
                    Other coaches will be able to discover and use this exercise
                  </div>
                </div>
              </label>
            </div>
          </Card>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Create Exercise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};