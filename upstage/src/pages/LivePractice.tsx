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
    {
      id: 1, firstName: 'Alice', lastName: 'Johnson', experienceLevel: 'Intermediate',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 2, firstName: 'Bob', lastName: 'Smith', experienceLevel: 'Beginner',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 3, firstName: 'Carol', lastName: 'Davis', experienceLevel: 'Advanced',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 4, firstName: 'David', lastName: 'Wilson', experienceLevel: 'Intermediate',
      createdAt: '',
      updatedAt: ''
    }
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
      </div>
    </div>

  );
};