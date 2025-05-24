// src/types/index.ts - Add these new types to your existing file

export interface PracticeSession {
  id: number;
  lessonId: number;
  startTime: string;
  endTime?: string;
  currentExerciseIndex: number;
  presentPerformerIds: number[];
}

export interface Performer {
  id: number;
  firstName: string;
  lastName: string;
  experienceLevel?: string;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface SceneEvaluation {
  id?: number;
  lessonExerciseId: number;
  practiceSessionId?: number;
  performerIds: number[];
  scores: Record<string, number>;
  notes: string;
  rubricType: 'base-reality' | 'game-of-scene';
}

export interface PracticeStats {
  totalDuration: number;
  exercisesCompleted: number;
  evaluationsCompleted: number;
  attendanceCount: number;
}

// Base Reality Rubric (UCB Manual)
export const BASE_REALITY_CRITERIA: EvaluationCriterion[] = [
  { id: 'yes_and', name: 'Yes And', description: 'Accepting and building on offers', maxScore: 4 },
  { id: 'agreement', name: 'Agreement', description: 'Finding shared reality', maxScore: 4 },
  { id: 'who_what_where', name: 'Who/What/Where', description: 'Establishing context clearly', maxScore: 4 },
  { id: 'physicality', name: 'Physicality', description: 'Using body and space effectively', maxScore: 4 },
  { id: 'listening', name: 'Listening', description: 'Active attention and responsiveness', maxScore: 4 },
  { id: 'commitment', name: 'Commitment', description: 'Full engagement and follow-through', maxScore: 4 },
  { id: 'avoidance_of_denial', name: 'Avoidance of Denial', description: 'Accepting reality vs blocking', maxScore: 4 },
  { id: 'efficiency', name: 'Efficiency', description: 'Economic scene work', maxScore: 4 }
];

// Game of Scene Rubric (Advanced)
export const GAME_OF_SCENE_CRITERIA: EvaluationCriterion[] = [
  { id: 'identification', name: 'Game Identification', description: 'Noticing the unusual thing', maxScore: 4 },
  { id: 'resting', name: 'Resting the Game', description: 'Patiently establishing game', maxScore: 4 },
  { id: 'heightening', name: 'Heightening', description: 'Escalating the game appropriately', maxScore: 4 },
  { id: 'exploration', name: 'Exploration', description: 'Exploring the game fully', maxScore: 4 },
  { id: 'top_of_intelligence', name: 'Top of Intelligence', description: 'Smart reactions to absurdity', maxScore: 4 },
  { id: 'justification', name: 'Justification', description: 'Making absurdity believable', maxScore: 4 },
  { id: 'framing', name: 'Framing', description: 'Communicating unusual behaviors clearly', maxScore: 4 },
  { id: 'labeling', name: 'Labeling', description: 'Concisely summarizing game for teammates', maxScore: 4 },
  { id: 'emotional_truth', name: 'Emotional Truth', description: 'Genuine reactions within the game', maxScore: 4 }
];

// ===========================================
// src/api/modules/practice.ts - New file
import { api } from '../service';
import { PracticeSession, SceneEvaluation, Performer } from '../../types';

export const practiceAPI = {
  startPractice: (lessonId: number, presentPerformerIds: number[]): Promise<PracticeSession> =>
    api.post<PracticeSession>(`/lessons/${lessonId}/start-practice`, { presentPerformerIds }),
  
  endPractice: (sessionId: number): Promise<void> =>
    api.put<void>(`/practice-sessions/${sessionId}/end`),
  
  updateCurrentExercise: (sessionId: number, exerciseIndex: number): Promise<PracticeSession> =>
    api.put<PracticeSession>(`/practice-sessions/${sessionId}/current-exercise`, { exerciseIndex }),
  
  createEvaluation: (evaluation: Omit<SceneEvaluation, 'id'>): Promise<SceneEvaluation> =>
    api.post<SceneEvaluation>('/evaluations', evaluation),
  
  updateEvaluation: (id: number, evaluation: Partial<SceneEvaluation>): Promise<SceneEvaluation> =>
    api.put<SceneEvaluation>(`/evaluations/${id}`, evaluation),
  
  getSessionStats: (sessionId: number): Promise<any> =>
    api.get(`/practice-sessions/${sessionId}/stats`)
};

// ===========================================
// src/components/LivePractice/PracticeTimer.tsx - New file
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PracticeTimerProps {
  plannedDuration: number; // in minutes
  onTimeUp?: () => void;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({
  plannedDuration,
  onTimeUp,
  isRunning,
  onToggle,
  onReset
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const plannedSeconds = plannedDuration * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime >= plannedSeconds && onTimeUp) {
            onTimeUp();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, plannedSeconds, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min((timeElapsed / plannedSeconds) * 100, 100);
  const isOvertime = timeElapsed > plannedSeconds;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          <span className="text-gray-300 font-medium">Exercise Timer</span>
        </div>
        <div className="text-gray-400 text-sm">
          Target: {formatTime(plannedSeconds)}
        </div>
      </div>

      {/* Large Time Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold ${isOvertime ? 'text-red-400' : 'text-gray-100'}`}>
          {formatTime(timeElapsed)}
        </div>
        {isOvertime && (
          <div className="text-red-400 text-sm mt-1 animate-pulse">
            +{formatTime(timeElapsed - plannedSeconds)} overtime
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              isOvertime ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0:00</span>
          <span>{formatTime(plannedSeconds)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        <Button
          onClick={onToggle}
          variant={isRunning ? 'secondary' : 'primary'}
          size="lg"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button onClick={onReset} variant="ghost" size="lg">
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
};

// ===========================================
// src/components/LivePractice/AttendanceSelector.tsx - New file
import React from 'react';
import { Users, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Performer } from '../../types';

interface AttendanceSelectorProps {
  performers: Performer[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

export const AttendanceSelector: React.FC<AttendanceSelectorProps> = ({
  performers,
  selectedIds,
  onSelectionChange
}) => {
  const togglePerformer = (performerId: number) => {
    const isSelected = selectedIds.includes(performerId);
    if (isSelected) {
      onSelectionChange(selectedIds.filter(id => id !== performerId));
    } else {
      onSelectionChange([...selectedIds, performerId]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-100">Take Attendance</h3>
        <span className="text-gray-400 text-sm">({selectedIds.length} present)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {performers.map((performer) => {
          const isSelected = selectedIds.includes(performer.id);
          return (
            <button
              key={performer.id}
              onClick={() => togglePerformer(performer.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-100'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {performer.firstName} {performer.lastName}
                </span>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
              {performer.experienceLevel && (
                <div className="text-xs text-gray-400 mt-1">
                  {performer.experienceLevel}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// ===========================================
// src/components/LivePractice/SceneEvaluationModal.tsx - New file
import React, { useState } from 'react';
import { X, Save, Users, FileText, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  SceneEvaluation, 
  Performer, 
  EvaluationCriterion,
  BASE_REALITY_CRITERIA,
  GAME_OF_SCENE_CRITERIA
} from '../../types';

interface SceneEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluation: Omit<SceneEvaluation, 'id'>) => void;
  performers: Performer[];
  lessonExerciseId: number;
  practiceSessionId?: number;
}

export const SceneEvaluationModal: React.FC<SceneEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  performers,
  lessonExerciseId,
  practiceSessionId
}) => {
  const [rubricType, setRubricType] = useState<'base-reality' | 'game-of-scene'>('base-reality');
  const [selectedPerformers, setSelectedPerformers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const criteria = rubricType === 'base-reality' ? BASE_REALITY_CRITERIA : GAME_OF_SCENE_CRITERIA;

  const handleSave = () => {
    const evaluation: Omit<SceneEvaluation, 'id'> = {
      lessonExerciseId,
      practiceSessionId,
      performerIds: selectedPerformers,
      scores,
      notes,
      rubricType
    };
    onSave(evaluation);
    onClose();
    // Reset form
    setSelectedPerformers([]);
    setScores({});
    setNotes('');
  };

  const getScoreColor = (score: number): string => {
    switch (score) {
      case 4: return 'bg-green-500 text-white';
      case 3: return 'bg-yellow-500 text-gray-900';
      case 2: return 'bg-orange-500 text-white';
      case 1: return 'bg-red-500 text-white';
      default: return 'bg-gray-600 text-gray-300 hover:bg-gray-500';
    }
  };

  const getScoreLabel = (score: number): string => {
    switch (score) {
      case 4: return 'Excellent';
      case 3: return 'Good';
      case 2: return 'Needs Improvement';
      case 1: return 'Unsatisfactory';
      default: return 'Not Scored';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">Scene Evaluation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rubric Type Selection */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Evaluation Type</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setRubricType('base-reality')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  rubricType === 'base-reality'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Base Reality (8 criteria)
              </button>
              <button
                onClick={() => setRubricType('game-of-scene')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  rubricType === 'game-of-scene'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Game of Scene (9 criteria)
              </button>
            </div>
          </Card>

          {/* Performer Selection */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Who was in this scene?</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {performers.map((performer) => {
                const isSelected = selectedPerformers.includes(performer.id);
                return (
                  <button
                    key={performer.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPerformers(selectedPerformers.filter(id => id !== performer.id));
                      } else {
                        setSelectedPerformers([...selectedPerformers, performer.id]);
                      }
                    }}
                    className={`p-2 rounded-lg border transition-all text-sm ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-100'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {performer.firstName} {performer.lastName}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Scoring Grid */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Score Each Criterion (1-4)</h3>
            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div>
                    <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                    <p className="text-sm text-gray-400">{criterion.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        onClick={() => setScores({ ...scores, [criterion.id]: score })}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          scores[criterion.id] === score
                            ? getScoreColor(score)
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                    <span className="flex items-center px-3 py-2 text-sm text-gray-400">
                      {scores[criterion.id] ? getScoreLabel(scores[criterion.id]) : 'Not scored'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Coaching Notes</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific feedback, strengths, areas for improvement..."
              className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </Card>
        </div>

        <div className="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedPerformers.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save Evaluation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// src/components/LivePractice/PracticeStats.tsx - New file
import React from 'react';
import { Clock, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { PracticeStats as Stats } from '../../types';

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

// ===========================================
// src/pages/LivePractice.tsx - Main component
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Star,
  CheckCircle,
  ArrowLeft,
  Users,
  Target
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { PracticeTimer } from '../components/LivePractice/PracticeTimer';
import { AttendanceSelector } from '../components/LivePractice/AttendanceSelector';
import { SceneEvaluationModal } from '../components/LivePractice/SceneEvaluationModal';
import { PracticeStats } from '../components/LivePractice/PracticeStats';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { lessonsAPI } from '../api/modules/lessons';
import { practiceAPI } from '../api/modules/practice';
import { 
  Lesson, 
  PracticeSession, 
  Performer, 
  SceneEvaluation,
  PracticeStats as Stats
} from '../types';

export const LivePractice: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [practicePhase, setPracticePhase] = useState<'setup' | 'active' | 'complete'>('setup');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [selectedPerformers, setSelectedPerformers] = useState<number[]>([]);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluations, setEvaluations] = useState<SceneEvaluation[]>([]);
  const [practiceStartTime, setPracticeStartTime] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  // API calls
  const { data: lesson, loading: lessonLoading } = useApi(
    () => lessonsAPI.getById(parseInt(lessonId!)),
    [lessonId]
  );

  // Mock performers - in real app, get from lesson.team
  const mockPerformers: Performer[] = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', experienceLevel: 'Intermediate' },
    { id: 2, firstName: 'Bob', lastName: 'Smith', experienceLevel: 'Beginner' },
    { id: 3, firstName: 'Carol', lastName: 'Davis', experienceLevel: 'Advanced' },
    { id: 4, firstName: 'David', lastName: 'Wilson', experienceLevel: 'Intermediate' }
  ];

  // Calculate practice stats
  const practiceStats: Stats = {
    totalDuration: sessionDuration,
    exercisesCompleted: currentExerciseIndex,
    evaluationsCompleted: evaluations.length,
    attendanceCount: selectedPerformers.length
  };

  // Timer effect for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (practicePhase === 'active') {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - practiceStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [practicePhase, practiceStartTime]);

  const handleStartPractice = async () => {
    if (selectedPerformers.length === 0) {
      alert('Please select at least one performer');
      return;
    }

    try {
      const session = await practiceAPI.startPractice(parseInt(lessonId!), selectedPerformers);
      setPracticeSession(session);
      setPracticePhase('active');
      setPracticeStartTime(Date.now());
      setTimerRunning(true);
    } catch (error) {
      console.error('Failed to start practice:', error);
      // Fallback: create mock session
      const mockSession: PracticeSession = {
        id: Date.now(),
        lessonId: parseInt(lessonId!),
        startTime: new Date().toISOString(),
        currentExerciseIndex: 0,
        presentPerformerIds: selectedPerformers
      };
      setPracticeSession(mockSession);
      setPracticePhase('active');
      setPracticeStartTime(Date.now());
      setTimerRunning(true);
    }
  };

  const handleEndPractice = async () => {
    if (practiceSession) {
      try {
        await practiceAPI.endPractice(practiceSession.id);
      } catch (error) {
        console.error('Failed to end practice:', error);
      }
    }
    setPracticePhase('complete');
    setTimerRunning(false);
  };

  const handleNextExercise = () => {
    if (lesson && currentExerciseIndex < lesson.exercises!.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimerRunning(false);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setTimerRunning(false);
    }
  };

  const handleSaveEvaluation = async (evaluation: Omit<SceneEvaluation, 'id'>) => {
    try {
      const savedEvaluation = await practiceAPI.createEvaluation(evaluation);
      setEvaluations([...evaluations, savedEvaluation]);
    } catch (error) {
      console.error('Failed to save evaluation:', error);
      // Fallback: add to local state
      const mockEvaluation: SceneEvaluation = {
        id: Date.now(),
        ...evaluation
      };
      setEvaluations([...evaluations, mockEvaluation]);
    }
  };

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-100 mb-4">Lesson Not Found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = lesson.exercises?.[currentExerciseIndex];
  const presentPerformers = mockPerformers.filter(p => selectedPerformers.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                {lesson.name || `${lesson.teamName} Practice`}
              </h1>
              <p className="text-gray-400">
                {practicePhase === 'setup' && 'Prepare for practice'}
                {practicePhase === 'active' && 'Practice in session'}
                {practicePhase === 'complete' && 'Practice completed'}
              </p>
            </div>
          </div>
          
          {practicePhase === 'active' && (
            <Button variant="secondary" onClick={handleEndPractice}>
              End Practice
            </Button>
          )}
        </div>

        {/* Practice Stats (shown during active phase) */}
        {practicePhase === 'active' && (
          <div className="mb-6">
            <PracticeStats
              stats={practiceStats}
              currentExercise={currentExerciseIndex + 1}
              totalExercises={lesson.exercises?.length || 0}
            />
          </div>
        )}

        {/* Setup Phase */}
        {practicePhase === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lesson Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-100 mb-4">Lesson Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-gray-100">{lesson.formattedDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exercises:</span>
                  <span className="text-gray-100">{lesson.exerciseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Team:</span>
                  <span className="text-gray-100">{lesson.teamName || 'No team'}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-100 mb-3">Exercises</h3>
                <div className="space-y-2">
                  {lesson.exercises?.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <span className="text-gray-100">{exercise.exerciseName}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.focusAreas?.map((area, areaIndex) => (
                            <span
                              key={areaIndex}
                              className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 text-xs rounded"
                            >
                              {area.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {exercise.formattedDuration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Attendance */}
            <div className="space-y-6">
              <AttendanceSelector
                performers={mockPerformers}
                selectedIds={selectedPerformers}
                onSelectionChange={setSelectedPerformers}
              />
              
              <Button
                onClick={handleStartPractice}
                disabled={selectedPerformers.length === 0}
                size="lg"
                className="w-full"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Practice
              </Button>
            </div>
          </div>
        )}

        {/* Active Practice Phase */}
        {practicePhase === 'active' && currentExercise && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Exercise & Timer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exercise Header */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">
                      {currentExercise.exerciseName}
                    </h2>
                    <p className="text-gray-400">
                      Exercise {currentExerciseIndex + 1} of {lesson.exercises?.length}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {currentExercise.focusAreas?.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 text-sm rounded-full"
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {currentExercise.exerciseDescription && (
                  <p className="text-gray-300 mb-4">
                    {currentExercise.exerciseDescription}
                  </p>
                )}

                {currentExercise.exerciseNotes && (
                  <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-3">
                    <p className="text-yellow-200 text-sm">
                      <strong>Coach Notes:</strong> {currentExercise.exerciseNotes}
                    </p>
                  </div>
                )}
              </Card>

              {/* Timer */}
              <PracticeTimer
                plannedDuration={currentExercise.plannedDurationMinutes || 10}
                isRunning={timerRunning}
                onToggle={() => setTimerRunning(!timerRunning)}
                onReset={() => {}}
                onTimeUp={() => setTimerRunning(false)}
              />

              {/* Exercise Navigation */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    onClick={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={() => setShowEvaluationModal(true)}
                    disabled={!presentPerformers.length}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Evaluate Scene
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleNextExercise}
                    disabled={currentExerciseIndex === (lesson.exercises?.length || 0) - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Present Performers */}
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-100">Present Today</span>
                </div>
                <div className="space-y-2">
                  {presentPerformers.map((performer) => (
                    <div
                      key={performer.id}
                      className="flex items-center space-x-2 p-2 bg-gray-700 rounded"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-100 text-sm">
                        {performer.firstName} {performer.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Evaluations */}
              <Card className="p-4">
                <h3 className="font-medium text-gray-100 mb-3">Recent Evaluations</h3>
                {evaluations.length === 0 ? (
                  <p className="text-gray-400 text-sm">No evaluations yet</p>
                ) : (
                  <div className="space-y-2">
                    {evaluations.slice(-3).map((evaluation, index) => (
                      <div
                        key={evaluation.id}
                        className="p-2 bg-gray-700 rounded text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-100">
                            {evaluation.rubricType === 'base-reality' ? 'Base Reality' : 'Game of Scene'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {evaluation.performerIds.length} performer(s)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Completion Phase */}
        {practicePhase === 'complete' && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Practice Complete!
            </h2>
            <p className="text-gray-400 mb-6">
              Great work today! Here's a summary of your session:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {Math.floor(sessionDuration / 60)}m
                </div>
                <div className="text-gray-400 text-sm">Total Time</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {lesson.exercises?.length || 0}
                </div>
                <div className="text-gray-400 text-sm">Exercises</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">
                  {evaluations.length}
                </div>
                <div className="text-gray-400 text-sm">Evaluations</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {selectedPerformers.length}
                </div>
                <div className="text-gray-400 text-sm">Performers</div>
              </div>
            </div>

            <Button onClick={() => navigate('/dashboard')} size="lg">
              Return to Dashboard
            </Button>
          </Card>
        )}
      </div>

      {/* Evaluation Modal */}
      <SceneEvaluationModal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
        onSave={handleSaveEvaluation}
        performers={presentPerformers}
        lessonExerciseId={currentExercise?.id || 0}
        practiceSessionId={practiceSession?.id}
      />
    </div>
  );
};