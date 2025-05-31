// src/pages/LivePractice.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Save, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AttendanceSelector } from '../components/Performers/LivePractice/AttendanceSelector';
import { ExerciseProgressBar } from '../components/Performers/LivePractice/ExerciseProgressBar';
import { PracticeTimer } from '../components/Performers/LivePractice/PracticeTimer';
import { QuickNotes } from '../components/Performers/LivePractice/QuickNotes';
import { PracticeStats } from '../components/Performers/LivePractice/PracticeStats';
import { SceneEvaluationModal } from '../components/Performers/LivePractice/SceneEvaluationModal';
import { Lesson, PracticeSession, Performer, SceneEvaluation, PracticeStats as Stats } from '../types';
import { lessonsAPI, practiceAPI, attendanceAPI, performersAPI } from '../api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const LivePractice: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // State
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [attendeeIds, setAttendeeIds] = useState<number[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalDuration: 0,
    exercisesCompleted: 0,
    evaluationsCompleted: 0,
    attendanceCount: 0
  });
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load lesson and performers
  useEffect(() => {
    const loadData = async () => {
      if (!lessonId) return;
      
      try {
        setLoading(true);
        const lessonData = await lessonsAPI.getById(parseInt(lessonId));
        setLesson(lessonData);
        
        // Load performers if team-based lesson
        if (lessonData.teamId) {
          const performerData = await performersAPI.getMyPerformers();
          setPerformers(performerData);
        }
      } catch (err) {
        setError('Failed to load lesson data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lessonId]);

  // Start practice session
  const startPractice = async () => {
    if (!lesson) return;
    
    try {
      setSaving(true);
      const newSession = await practiceAPI.startPractice(lesson.id);
      setSession(newSession);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        attendanceCount: attendeeIds.length
      }));
      
      // Save initial attendance if any performers selected
      if (attendeeIds.length > 0) {
        await attendanceAPI.updateBulkAttendance(newSession.id, attendeeIds);
      }
    } catch (err) {
      setError('Failed to start practice session');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Update attendance
  const handleAttendanceChange = async (selectedIds: number[]) => {
    setAttendeeIds(selectedIds);
    setStats(prev => ({ ...prev, attendanceCount: selectedIds.length }));
    
    // If session is active, update attendance in real-time
    if (session) {
      try {
        await attendanceAPI.updateBulkAttendance(session.id, selectedIds);
      } catch (err) {
        console.error('Failed to update attendance:', err);
      }
    }
  };

  // Navigate between exercises
  const goToExercise = async (index: number) => {
    if (!session || !lesson?.exercises) return;
    
    const exercise = lesson.exercises[index];
    if (!exercise) return;
    
    try {
      const updatedSession = await practiceAPI.updateCurrentExercise(
        session.id, 
        exercise.id
      );
      setSession(updatedSession);
      setCurrentExerciseIndex(index);
      setIsTimerRunning(false);
    } catch (err) {
      console.error('Failed to update exercise:', err);
    }
  };

  // Save evaluation
  const handleSaveEvaluation = async (evaluation: Omit<SceneEvaluation, 'id'>) => {
    try {
      await practiceAPI.createEvaluation(evaluation);
      setStats(prev => ({
        ...prev,
        evaluationsCompleted: prev.evaluationsCompleted + 1
      }));
      setShowEvaluationModal(false);
    } catch (err) {
      console.error('Failed to save evaluation:', err);
    }
  };

  // Save notes
  const handleSaveNote = async (note: string, type: 'exercise' | 'overall') => {
    if (!lesson || !session) return;
    
    try {
      await practiceAPI.savePracticeNotes(lesson.id, session.id, note, type);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  // End practice
  const endPractice = async () => {
    if (!session) return;
    
    try {
      await practiceAPI.endPractice(session.id);
      navigate(`/lessons/${lessonId}`);
    } catch (err) {
      console.error('Failed to end practice:', err);
    }
  };

  // Timer callbacks
  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
  };

  const handleTimeUp = () => {
    // Could auto-advance or show notification
  };

  // Update total duration every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (session && isTimerRunning) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          totalDuration: prev.totalDuration + 1
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [session, isTimerRunning]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <ErrorMessage error={error || 'Lesson not found'} />
    );
  }

  const currentExercise = lesson.exercises?.[currentExerciseIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">{lesson.name}</h1>
          <p className="text-gray-400 mt-1">
            {lesson.teamName ? `${lesson.teamName} • ` : ''}
            {new Date(lesson.scheduledDate).toLocaleDateString()}
          </p>
        </div>
        {session && (
          <Button onClick={endPractice} variant="secondary">
            End Practice
          </Button>
        )}
      </div>

      {!session ? (
        // Pre-practice setup
        <div className="space-y-6">
          {performers.length > 0 && (
            <AttendanceSelector
              performers={performers}
              selectedIds={attendeeIds}
              onSelectionChange={handleAttendanceChange}
            />
          )}
          
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              Ready to start practice?
            </h2>
            <p className="text-gray-300 mb-6">
              {lesson.exercises?.length || 0} exercises • 
              {lesson.formattedDuration || '0 minutes'}
            </p>
            <Button onClick={startPractice} size="lg" loading={saving}>
              <Play className="h-5 w-5 mr-2" />
              Start Practice
            </Button>
          </Card>
        </div>
      ) : (
        // Active practice session
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Exercise progress */}
          <div className="lg:col-span-1 space-y-6">
            <ExerciseProgressBar
              exercises={lesson.exercises || []}
              currentIndex={currentExerciseIndex}
              onExerciseClick={goToExercise}
            />
            <QuickNotes onSaveNote={handleSaveNote} />
          </div>

          {/* Center column - Current exercise */}
          <div className="lg:col-span-1 space-y-6">
            {currentExercise && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">
                  {currentExercise.exerciseName}
                </h2>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">
                  {currentExercise.exerciseDescription}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowEvaluationModal(true)}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Evaluate Scene
                  </Button>
                  
                  {currentExerciseIndex < (lesson.exercises?.length || 0) - 1 && (
                    <Button
                      onClick={() => goToExercise(currentExerciseIndex + 1)}
                      variant="secondary"
                      className="w-full"
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Next Exercise
                    </Button>
                  )}
                </div>
              </Card>
            )}
            
            <PracticeTimer
              plannedDuration={currentExercise?.plannedDurationMinutes || 5}
              onTimeUp={handleTimeUp}
              isRunning={isTimerRunning}
              onToggle={handleTimerToggle}
              onReset={handleTimerReset}
            />
          </div>

          {/* Right column - Stats */}
          <div className="lg:col-span-1">
            <PracticeStats
              stats={stats}
              currentExercise={currentExerciseIndex + 1}
              totalExercises={lesson.exercises?.length || 0}
            />
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && currentExercise && (
        <SceneEvaluationModal
          isOpen={showEvaluationModal}
          onClose={() => setShowEvaluationModal(false)}
          onSave={handleSaveEvaluation}
          performers={performers.filter(p => attendeeIds.includes(p.id))}
          lessonExerciseId={currentExercise.id}
          practiceSessionId={session?.id}
          evaluationTemplateId={currentExercise.evaluationTemplateId}
          evaluationTemplateName={currentExercise.evaluationTemplateName}
        />
      )}
    </div>
  );
};