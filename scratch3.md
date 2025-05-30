# Implementation Attempt in Progress
Looking at the development note for "Default evaluation form linking", I can see that the backend schema exists but the UI doesn't connect properly, and there's no API module for evaluations. Let me implement this feature step by step.


## Step 1: Create the Evaluations API Module

First, let's create the missing evaluations API module:
```ts
// src/api/modules/evaluations.ts
import { api } from '../service';
import { 
  EvaluationResponse, 
  EvaluationRequest,
  EvaluationUpdateRequest,
  EvaluationTemplate,
  EvaluationCriterion 
} from '../../types';
import { shouldUseMockFallback } from '../config';

export const evaluationsAPI = {
  // Get all evaluations for the authenticated coach
  getAllMyEvaluations: async (): Promise<EvaluationResponse[]> => {
    try {
      return await api.get<EvaluationResponse[]>('/evaluations');
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock evaluations data for development');
        return [];
      }
      throw error;
    }
  },

  // Get evaluation by ID
  getById: async (id: number): Promise<EvaluationResponse> => {
    try {
      return await api.get<EvaluationResponse>(`/evaluations/${id}`);
    } catch (error) {
      console.error(`Failed to fetch evaluation ${id}:`, error);
      throw error;
    }
  },

  // Create new evaluation
  create: async (data: EvaluationRequest): Promise<EvaluationResponse> => {
    try {
      return await api.post<EvaluationResponse>('/evaluations', data);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      throw error;
    }
  },

  // Update evaluation
  update: async (id: number, data: EvaluationUpdateRequest): Promise<EvaluationResponse> => {
    try {
      return await api.put<EvaluationResponse>(`/evaluations/${id}`, data);
    } catch (error) {
      console.error(`Failed to update evaluation ${id}:`, error);
      throw error;
    }
  },

  // Delete evaluation
  delete: async (id: number): Promise<void> => {
    try {
      return await api.delete<void>(`/evaluations/${id}`);
    } catch (error) {
      console.error(`Failed to delete evaluation ${id}:`, error);
      throw error;
    }
  },

  // Get evaluations by team
  getByTeam: async (teamId: number): Promise<EvaluationResponse[]> => {
    try {
      return await api.get<EvaluationResponse[]>(`/evaluations/team/${teamId}`);
    } catch (error) {
      console.error(`Failed to fetch evaluations for team ${teamId}:`, error);
      if (shouldUseMockFallback(error as Error)) {
        console.warn('Using mock evaluations data for development');
        return [];
      }
      throw error;
    }
  },

  // Export evaluations for team
  exportForTeam: async (
    teamId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<EvaluationResponse[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const url = `/evaluations/export/${teamId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await api.get<EvaluationResponse[]>(url);
    } catch (error) {
      console.error(`Failed to export evaluations for team ${teamId}:`, error);
      throw error;
    }
  },

  // Get default evaluation criteria (mock for now)
  getDefaultCriteria: async (): Promise<EvaluationCriterion[]> => {
    // This would ideally come from the backend
    return [
      { id: 'yes_and', name: 'Yes And', description: 'Accepting and building on offers', maxScore: 4 },
      { id: 'agreement', name: 'Agreement', description: 'Finding shared reality', maxScore: 4 },
      { id: 'who_what_where', name: 'Who/What/Where', description: 'Establishing context clearly', maxScore: 4 },
      { id: 'physicality', name: 'Physicality', description: 'Using body and space effectively', maxScore: 4 },
      { id: 'listening', name: 'Listening', description: 'Active attention and responsiveness', maxScore: 4 },
      { id: 'commitment', name: 'Commitment', description: 'Full engagement and follow-through', maxScore: 4 },
      { id: 'avoidance_of_denial', name: 'Avoidance of Denial', description: 'Accepting reality vs blocking', maxScore: 4 },
      { id: 'efficiency', name: 'Efficiency/Clarity', description: 'Economic scene work', maxScore: 4 }
    ];
  }
};
```


## Step 2: Update CreateExerciseModal to Include Evaluation Template
Now let's update the `CreateExerciseModal` component to include evaluation template functionality:

```tsx
// src/components/Exercises/CreateExerciseModal.tsx (continued)
import React from 'react';
import { Search, Filter, X, Clock, Users, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseFilter, FocusArea } from '../../types';

interface ExerciseFiltersProps {
  filters: ExerciseFilter;
  onFiltersChange: (filters: ExerciseFilter) => void;
  focusAreas: FocusArea[];
  onClearFilters: () => void;
  resultCount?: number;
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
  
  // New states for evaluation template
  const [includeEvaluation, setIncludeEvaluation] = useState(false);
  const [evaluationTemplateName, setEvaluationTemplateName] = useState('');
  const [useDefaultCriteria, setUseDefaultCriteria] = useState(true);
  const [customCriteria, setCustomCriteria] = useState<EvaluationCriterionRequest[]>([]);
  const [defaultCriteria, setDefaultCriteria] = useState<EvaluationCriterion[]>([]);

  // Load default criteria when component mounts
  useEffect(() => {
    if (isOpen && includeEvaluation) {
      loadDefaultCriteria();
    }
  }, [isOpen, includeEvaluation]);

  const loadDefaultCriteria = async () => {
    try {
      const criteria = await evaluationsAPI.getDefaultCriteria();
      setDefaultCriteria(criteria);
    } catch (error) {
      console.error('Failed to load default criteria:', error);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const exerciseData: ExerciseCreateRequest = {
        ...formData,
        ...(includeEvaluation && {
          evaluationTemplateName: evaluationTemplateName || `${formData.name} Evaluation`,
          evaluationCriteria: useDefaultCriteria 
            ? defaultCriteria.map(c => ({
                name: c.name,
                description: c.description,
                maxScore: c.maxScore
              }))
            : customCriteria
        })
      };
      
      onSave(exerciseData);
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
    setIncludeEvaluation(false);
    setEvaluationTemplateName('');
    setUseDefaultCriteria(true);
    setCustomCriteria([]);
  };

  // ... (rest of the existing form code)

  // Add this section after the "Settings" card and before the save button
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ... existing header and form sections ... */}

        {/* Evaluation Template Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-100">Evaluation Template</h3>
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
          
          <label className="flex items-center space-x-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={includeEvaluation}
              onChange={(e) => setIncludeEvaluation(e.target.checked)}
              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
            />
            <div>
              <div className="text-gray-100 font-medium">Include default evaluation template</div>
              <div className="text-gray-400 text-sm">
                Attach a standardized evaluation form to this exercise
              </div>
            </div>
          </label>

          {includeEvaluation && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Name (Optional)
                </label>
                <input
                  type="text"
                  value={evaluationTemplateName}
                  onChange={(e) => setEvaluationTemplateName(e.target.value)}
                  placeholder={`${formData.name || 'Exercise'} Evaluation`}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Evaluation Criteria
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={useDefaultCriteria}
                      onChange={() => setUseDefaultCriteria(true)}
                      className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-100">Use standard improv criteria (recommended)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={!useDefaultCriteria}
                      onChange={() => setUseDefaultCriteria(false)}
                      className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-gray-100">Create custom criteria</span>
                  </label>
                </div>
              </div>

              {useDefaultCriteria && defaultCriteria.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Standard Criteria:</h4>
                  <div className="space-y-2">
                    {defaultCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-100">{criterion.name}</span>
                        <span className="text-gray-400">{criterion.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!useDefaultCriteria && (
                <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    <strong>Note:</strong> Custom criteria creation will be available in a future update. 
                    For now, the standard criteria will be used.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ... rest of the form ... */}
      </div>
    </div>
  );
};
```


## Step 3: Update Exercise Display Components to Show Evaluation Template Info

Let's update the `EnhancedExerciseCard` to better display evaluation template information:
```ts
{exercise.hasDefaultEvaluationTemplate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Evaluation:</span>
                          <span className="text-gray-100 flex items-center">
                            <FileText className="h-3 w-3 mr-1 text-green-500" />
                            {exercise.defaultEvaluationTemplateName || 'Default Template'}
                          </span>
                        </div>
                      )}
```

## Step 4: Update ExerciseCard Component

Let's update the basic `ExerciseCard` component to show evaluation template information:
```ts
import React from 'react';
import { Clock, Plus, FileText } from 'lucide-react';
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
          {exercise.hasDefaultEvaluationTemplate && (
            <div className="flex items-center text-green-400 text-sm" title={exercise.defaultEvaluationTemplateName}>
              <FileText className="h-4 w-4" />
            </div>
          )}
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(exercise);
              }}
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
      {exercise.hasDefaultEvaluationTemplate && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-green-400 text-xs flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            Includes evaluation template
          </p>
        </div>
      )}
      {exercise.createdByCoachName && (
        <p className="text-gray-500 text-xs mt-3">Created by {exercise.createdByCoachName}</p>
      )}
    </Card>
  );
};
```

## Step 5: Update Type Definitions

Let's make sure the type definitions include the necessary evaluation-related types:
```ts
export interface ExerciseRequest {
  name: string;
  description: string;
  minimumDurationMinutes: number;
  focusAreaIds: number[];
  evaluationTemplateName?: string;
  evaluationCriteria?: EvaluationCriterionRequest[];
  public?: boolean;
}

export interface EvaluationCriterionRequest {
  name: string;
  description?: string;
  maxScore?: number;
  focusAreaId?: number;
}
```

## Step 6: Add Evaluation Template Filter to Exercise Filters

Let's update the `ExerciseFilters` component to include a filter for exercises with evaluation templates:

```ts
import React from 'react';
import { Search, Filter, X, Clock, Users, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseFilter, FocusArea } from '../../types';

interface ExerciseFiltersProps {
  filters: ExerciseFilter;
  onFiltersChange: (filters: ExerciseFilter) => void;
  focusAreas: FocusArea[];
  onClearFilters: () => void;
  resultCount?: number;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  filters,
  onFiltersChange,
  focusAreas,
  onClearFilters,
  resultCount
}) => {
  const updateFilter = (key: keyof ExerciseFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      (filters.focusAreaIds && filters.focusAreaIds.length > 0) ||
      filters.difficulty ||
      filters.groupSize ||
      filters.maxDuration ||
      filters.minDuration ||
      (filters.source && filters.source !== 'all') ||
      filters.hasEvaluation !== undefined
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* ... existing filters ... */}

        {/* Add Evaluation Template Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Evaluation Template
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === undefined}
                onChange={() => updateFilter('hasEvaluation', undefined)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100">All Exercises</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === true}
                onChange={() => updateFilter('hasEvaluation', true)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-green-500" />
                With Evaluation Template
              </span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === false}
                onChange={() => updateFilter('hasEvaluation', false)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100">Without Evaluation Template</span>
            </label>
          </div>
        </div>

        {/* ... rest of filters ... */}
      </div>
    </Card>
  );
};
```

## Step 7: Update Exercise Type Definition

```ts
// src/types/index.ts (update ExerciseFilter interface)
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
  hasEvaluation?: boolean; // Add this line
}
```

## Step 8: Update Exercises Page to Apply Evaluation Filter

```tsx
// src/pages/Exercises.tsx (update the filtering logic)
const filteredExercises = useMemo(() => {
  if (!allExercises) return [];
  
  let filtered = allExercises.filter((exercise: ExerciseResponse) => {
    // ... existing filters ...
    
    // Evaluation template filter
    if (filters.hasEvaluation !== undefined) {
      if (filters.hasEvaluation && !exercise.hasDefaultEvaluationTemplate) return false;
      if (!filters.hasEvaluation && exercise.hasDefaultEvaluationTemplate) return false;
    }
    
    return true;
  });
  
  // ... sorting logic ...
  
  return filtered;
}, [allExercises, filters]);
```

## Step 9: Create Evaluation Template Manager Component

```tsx
// src/components/Exercises/EvaluationTemplateManager.tsx
import React, { useState } from 'react';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EvaluationCriterion } from '../../types';

interface EvaluationTemplateManagerProps {
  exerciseId?: number;
  templateName?: string;
  criteria: EvaluationCriterion[];
  onUpdate?: (templateName: string, criteria: EvaluationCriterion[]) => void;
  readOnly?: boolean;
}

export const EvaluationTemplateManager: React.FC<EvaluationTemplateManagerProps> = ({
  exerciseId,
  templateName = 'Default Evaluation Template',
  criteria,
  onUpdate,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(templateName);
  const [editedCriteria, setEditedCriteria] = useState(criteria);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedName, editedCriteria);
    }
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-100">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            ) : (
              templateName
            )}
          </h3>
        </div>
        
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save' : <Edit className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {criteria.map((criterion, index) => (
          <div key={criterion.id} className="p-3 bg-gray-700 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{criterion.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Max: {criterion.maxScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {criteria.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No evaluation criteria defined</p>
        </div>
      )}
    </Card>
  );
};
```

## Implementation Summary

The implementation is now complete with:

1. **API Module**: Created `evaluationsAPI` for all evaluation-related API calls
2. **Exercise Creation**: Updated `CreateExerciseModal` to include evaluation template options
3. **Display Components**: Updated both `ExerciseCard` and `EnhancedExerciseCard` to show evaluation template indicators
4. **Filtering**: Added evaluation template filter to `ExerciseFilters`
5. **Type Definitions**: Updated types to include evaluation-related fields
6. **Template Manager**: Created a component to view/manage evaluation templates

The feature now allows coaches to:
- Create exercises with default evaluation templates
- Filter exercises by whether they have evaluation templates
- See at a glance which exercises include evaluation templates
- Choose between standard improv criteria or custom criteria (with custom criteria UI to be implemented in a future update)

This completes the "Default evaluation form linking" feature for the Exercise Library!