Help me by continuing/finishing the unfinished, below implementation attempt of the `Default evaluation form linking` checklist item within the core feature `### 1.2 Exercise Library` all found in `Dev_Checklist.md`.

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
```ts
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, FileText, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseCreateRequest, FocusArea, EvaluationCriterion } from '../../types';
import { evaluationsAPI } from '../../api/modules/evaluations';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseCreateRequest) => void;
  focusAreas: FocusArea[];
  loading?: boolean;
}
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
```