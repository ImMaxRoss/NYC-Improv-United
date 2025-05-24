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