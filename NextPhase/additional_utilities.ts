// src/api/mockData.ts - Enhanced with detailed lesson data for Live Practice
import { Lesson, Exercise, Team, LessonTemplate, LessonExercise } from '../types';

export const MOCK_DETAILED_LESSONS: Lesson[] = [
  {
    id: 1,
    name: 'Tuesday Night Practice',
    teamId: 1,
    teamName: 'The Improvisers',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    formattedDuration: '90 minutes',
    exerciseCount: 5,
    exercises: [
      {
        id: 1,
        exerciseId: 1,
        exerciseName: 'Zip Zap Zop',
        exerciseDescription: 'An energetic warm-up game that helps with focus and listening. Players stand in a circle and pass energy with "Zip," "Zap," or "Zop" while pointing to different people.',
        orderIndex: 0,
        plannedDurationMinutes: 10,
        formattedDuration: '10 min',
        evaluationTemplateId: 1,
        evaluationTemplateName: 'Basic Warmup',
        exerciseNotes: 'Focus on eye contact and clear gestures. Watch for people who get stuck in their heads.',
        focusAreas: [
          { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
          { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' }
        ]
      },
      {
        id: 2,
        exerciseId: 2,
        exerciseName: 'Yes, And Circles',
        exerciseDescription: 'Players practice the fundamental "Yes, And" principle by building on each other\'s statements in a supportive circle format.',
        orderIndex: 1,
        plannedDurationMinutes: 15,
        formattedDuration: '15 min',
        evaluationTemplateId: 2,
        evaluationTemplateName: 'Scene Work Basic',
        exerciseNotes: 'Look for players who are thinking too hard about being clever. Encourage simple, honest responses.',
        focusAreas: [
          { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
          { id: 4, name: 'Agreement', description: 'Shared reality', colorCode: '#2196F3' }
        ]
      },
      {
        id: 3,
        exerciseId: 3,
        exerciseName: 'Emotional Quadrants',
        exerciseDescription: 'The stage is divided into four quadrants, each representing a different emotion. Players move between quadrants and let the emotion affect their character.',
        orderIndex: 2,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 3,
        evaluationTemplateName: 'Character Development',
        exerciseNotes: 'Encourage full body commitment to emotions. Watch for intellectual vs. emotional choices.',
        focusAreas: [
          { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' },
          { id: 2, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' },
          { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' }
        ]
      },
      {
        id: 4,
        exerciseId: 4,
        exerciseName: 'Two-Person Scenes',
        exerciseDescription: 'Basic two-person scene work focusing on establishing relationship, environment, and conflict quickly and clearly.',
        orderIndex: 3,
        plannedDurationMinutes: 25,
        formattedDuration: '25 min',
        evaluationTemplateId: 4,
        evaluationTemplateName: 'Scene Work Advanced',
        exerciseNotes: 'Focus on specificity in Who/What/Where. Encourage players to make strong choices early.',
        focusAreas: [
          { id: 6, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' },
          { id: 3, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
          { id: 7, name: 'Avoidance of Denial', description: 'Accept reality', colorCode: '#009688' }
        ]
      },
      {
        id: 5,
        exerciseId: 5,
        exerciseName: 'Group Scene Work',
        exerciseDescription: 'Larger ensemble scenes focusing on group dynamics, supporting the scene, and finding opportunities to contribute meaningfully.',
        orderIndex: 4,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 5,
        evaluationTemplateName: 'Ensemble Skills',
        exerciseNotes: 'Watch for scene hogging vs. disappearing. Encourage collaborative storytelling.',
        focusAreas: [
          { id: 1, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
          { id: 8, name: 'Efficiency', description: 'Economic scene work', colorCode: '#795548' },
          { id: 5, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Weekend Workshop: Game of the Scene',
    teamId: 2,
    teamName: 'Comedy Crew',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    formattedDuration: '120 minutes',
    exerciseCount: 6,
    exercises: [
      {
        id: 6,
        exerciseId: 6,
        exerciseName: 'Unusual Thing',
        exerciseDescription: 'Players practice identifying the first unusual thing in a scene and learning to rest with it before heightening.',
        orderIndex: 0,
        plannedDurationMinutes: 20,
        formattedDuration: '20 min',
        evaluationTemplateId: 6,
        evaluationTemplateName: 'Game Identification',
        exerciseNotes: 'Focus on patience. Many students want to heighten immediately. Teach them to sit with the weird thing.',
        focusAreas: [
          { id: 9, name: 'Game Identification', description: 'Noticing unusual', colorCode: '#795548' },
          { id: 10, name: 'Resting the Game', description: 'Patient establishment', colorCode: '#795548' }
        ]
      }
    ]
  }
];

export const MOCK_TEAMS_DETAILED: Team[] = [
  { 
    id: 1, 
    name: 'The Improvisers',
    description: 'Intermediate level team focusing on scene work fundamentals'
  },
  { 
    id: 2, 
    name: 'Comedy Crew',
    description: 'Advanced team working on game of the scene and performance'
  },
  { 
    id: 3, 
    name: 'Laugh Track',
    description: 'Beginner-friendly team for new improvisers'
  }
];

export const MOCK_PERFORMERS = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', experienceLevel: 'Intermediate' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', experienceLevel: 'Beginner' },
  { id: 3, firstName: 'Carol', lastName: 'Davis', experienceLevel: 'Advanced' },
  { id: 4, firstName: 'David', lastName: 'Wilson', experienceLevel: 'Intermediate' },
  { id: 5, firstName: 'Emma', lastName: 'Brown', experienceLevel: 'Advanced' },
  { id: 6, firstName: 'Frank', lastName: 'Miller', experienceLevel: 'Beginner' },
  { id: 7, firstName: 'Grace', lastName: 'Lee', experienceLevel: 'Intermediate' },
  { id: 8, firstName: 'Henry', lastName: 'Garcia', experienceLevel: 'Advanced' }
];

// ===========================================
// src/utils/practiceHelpers.ts - New utility file
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getScoreColor = (score: number): string => {
  switch (score) {
    case 4: return 'bg-green-500 text-white';
    case 3: return 'bg-yellow-500 text-gray-900';
    case 2: return 'bg-orange-500 text-white';
    case 1: return 'bg-red-500 text-white';
    default: return 'bg-gray-600 text-gray-300';
  }
};

export const getScoreLabel = (score: number): string => {
  switch (score) {
    case 4: return 'Excellent';
    case 3: return 'Good';
    case 2: return 'Needs Improvement';
    case 1: return 'Unsatisfactory';
    default: return 'Not Scored';
  }
};

export const calculateSessionProgress = (
  currentExercise: number,
  totalExercises: number
): number => {
  if (totalExercises === 0) return 0;
  return Math.round((currentExercise / totalExercises) * 100);
};

export const generatePracticeId = (): string => {
  return `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ===========================================
// src/components/LivePractice/ExerciseProgressBar.tsx - New component
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

// ===========================================
// src/components/LivePractice/QuickNotes.tsx - New component for practice notes
import React, { useState } from 'react';
import { FileText, Save, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface QuickNotesProps {
  onSaveNote?: (note: string, type: 'exercise' | 'overall') => void;
}

export const QuickNotes: React.FC<QuickNotesProps> = ({ onSaveNote }) => {
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState<'exercise' | 'overall'>('exercise');
  const [savedNotes, setSavedNotes] = useState<Array<{
    id: number;
    text: string;
    type: 'exercise' | 'overall';
    timestamp: Date;
  }>>([]);

  const handleSaveNote = () => {
    if (note.trim()) {
      const newNote = {
        id: Date.now(),
        text: note.trim(),
        type: noteType,
        timestamp: new Date()
      };
      
      setSavedNotes([newNote, ...savedNotes]);
      onSaveNote && onSaveNote(note.trim(), noteType);
      setNote('');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="h-5 w-5 text-blue-500" />
        <span className="font-medium text-gray-100">Quick Notes</span>
      </div>

      {/* Note Type Toggle */}
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setNoteType('exercise')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            noteType === 'exercise'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Exercise Note
        </button>
        <button
          onClick={() => setNoteType('overall')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            noteType === 'overall'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Overall Note
        </button>
      </div>

      {/* Note Input */}
      <div className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`Add ${noteType} note...`}
          className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
        />
        
        <Button
          onClick={handleSaveNote}
          disabled={!note.trim()}
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      </div>

      {/* Saved Notes */}
      {savedNotes.length > 0 && (
        <div className="mt-4 max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Notes</h4>
          <div className="space-y-2">
            {savedNotes.map((savedNote) => (
              <div
                key={savedNote.id}
                className="p-2 bg-gray-700 rounded text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    savedNote.type === 'exercise'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                      : 'bg-purple-500 bg-opacity-20 text-purple-300'
                  }`}>
                    {savedNote.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {savedNote.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-gray-200">{savedNote.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// ===========================================
// src/api/modules/lessons.ts - Updated with detailed lesson fetching
import { api } from '../service';
import { Lesson, LessonTemplate } from '../../types';
import { MOCK_DETAILED_LESSONS, MOCK_LESSONS, MOCK_TEMPLATES } from '../mockData';

export const lessonsAPI = {
  getUpcoming: async (): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>('/lessons/upcoming');
    } catch (error) {
      console.warn('Failed to fetch upcoming lessons, using mock data:', error);
      return MOCK_LESSONS;
    }
  },
  
  getRecent: async (limit: number = 10): Promise<Lesson[]> => {
    try {
      return await api.get<Lesson[]>(`/lessons/recent?limit=${limit}`);
    } catch (error) {
      console.warn('Failed to fetch recent lessons, using mock data:', error);
      return MOCK_LESSONS.slice(0, limit);
    }
  },
  
  getById: async (id: number): Promise<Lesson> => {
    try {
      return await api.get<Lesson>(`/lessons/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch lesson ${id}, using mock data:`, error);
      // Return detailed mock lesson for Live Practice testing
      const mockLesson = MOCK_DETAILED_LESSONS.find(l => l.id === id);
      if (mockLesson) {
        return mockLesson;
      }
      // Fallback to basic mock
      return {
        id,
        name: `Mock Lesson ${id}`,
        teamId: 1,
        teamName: 'Test Team',
        scheduledDate: new Date().toISOString(),
        formattedDuration: '60 minutes',
        exerciseCount: 3,
        exercises: [
          {
            id: 1,
            exerciseId: 1,
            exerciseName: 'Mock Exercise 1',
            exerciseDescription: 'A test exercise for development',
            orderIndex: 0,
            plannedDurationMinutes: 10,
            formattedDuration: '10 min',
            evaluationTemplateId: 1,
            evaluationTemplateName: 'Basic',
            exerciseNotes: 'This is a mock exercise for testing',
            focusAreas: [
              { id: 1, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' }
            ]
          }
        ]
      };
    }
  },
  
  create: (data: any): Promise<Lesson> => api.post<Lesson>('/lessons', data),
  update: (id: number, data: any): Promise<Lesson> => api.put<Lesson>(`/lessons/${id}`, data),
  delete: (id: number): Promise<void> => api.delete<void>(`/lessons/${id}`),
  addExercise: (lessonId: number, exerciseId: number, duration?: number): Promise<void> => 
    api.post<void>(`/lessons/${lessonId}/exercises?exerciseId=${exerciseId}${duration ? `&duration=${duration}` : ''}`),
  saveAsTemplate: (id: number): Promise<LessonTemplate> => api.post<LessonTemplate>(`/lessons/${id}/save-as-template`),
  
  getTemplates: async (): Promise<LessonTemplate[]> => {
    try {
      return await api.get<LessonTemplate[]>('/lessons/templates');
    } catch (error) {
      console.warn('Failed to fetch templates, using mock data:', error);
      return MOCK_TEMPLATES;
    }
  },
};

// ===========================================
// Key Features Summary:

/*
🎯 LIVE PRACTICE MODE COMPLETE:

✅ Pre-Practice Setup:
   - Lesson overview with exercise list
   - Attendance taking with checkboxes
   - Team and duration display
   - Start practice button

✅ Active Practice Features:
   - Real-time timer with play/pause/reset
   - Exercise navigation (previous/next)
   - Progress tracking and statistics
   - Current exercise display with focus areas
   - Present performers sidebar

✅ Dynamic Evaluation System:
   - Two rubric types: Base Reality (8 criteria) & Game of Scene (9 criteria)
   - Visual 1-4 scoring with color coding:
     * 4 = Excellent (Green)
     * 3 = Good (Yellow)  
     * 2 = Needs Improvement (Orange)
     * 1 = Unsatisfactory (Red)
   - Performer selection checkboxes
   - Notes section for coaching feedback
   - Evaluation history tracking

✅ Visual Enhancements:
   - Progress bars for lesson completion
   - Color-coded scoring throughout
   - Focus area tags with themed colors
   - Real-time statistics cards
   - Smooth transitions between modes
   - Exercise progress sidebar

✅ Additional Features:
   - Quick notes for exercises and overall practice
   - Exercise progress timeline
   - Practice completion summary
   - Mock data for testing
   - Utility functions for formatting
   - Routing integration

🎭 Coach Experience:
   - Dashboard integration with "Start Practice" buttons
   - Intuitive timer controls
   - Focus area highlighting
   - Real-time attendance tracking  
   - Exercise notes display
   - Evaluation history sidebar
   - Practice session statistics

📱 Mobile-Friendly:
   - Responsive design for tablets/phones
   - Touch-friendly controls
   - Optimized layouts for different screen sizes

🔄 Practice Flow:
   1. Select lesson from dashboard
   2. Take attendance (checkboxes)
   3. Start practice timer
   4. Navigate between exercises
   5. Evaluate scenes with dynamic rubrics
   6. View real-time stats
   7. Complete practice with summary

The implementation maintains your "playful professionalism" design philosophy with comedy-themed elements, professional coaching tools, and an intuitive user experience.
*/