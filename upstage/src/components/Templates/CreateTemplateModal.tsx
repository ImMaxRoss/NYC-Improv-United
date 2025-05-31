import React, { useState } from 'react';
import { X, Save, BookmarkPlus, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseCard } from '../ExerciseCard';
import { LessonRequest, Team, ExerciseSummaryResponse, Exercise } from '../../types';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: LessonRequest) => void;
  teams?: Team[];
  availableExercises?: ExerciseSummaryResponse[];
  loading?: boolean;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teams = [],
  availableExercises = [],
  loading = false
}) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workshopType, setWorkshopType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to convert ExerciseSummaryResponse to Exercise
  const convertToExercise = (exercise: ExerciseSummaryResponse): Exercise => ({
    ...exercise,
    description: '', // Add required description field (empty for summaries)
    formattedMinimumDuration: exercise.formattedMinimumDuration,
    createdByCoachName: exercise.sourceLabel,
    hasDefaultEvaluationTemplate: exercise.hasDefaultEvaluationTemplate,
    public: exercise.public,
    focusAreas: exercise.focusAreas || []
  });

  const handleAddExercise = (exercise: Exercise) => {
    const exerciseWithPlanning: Exercise = {
      ...exercise,
      plannedDurationMinutes: exercise.minimumDurationMinutes,
      orderIndex: selectedExercises.length
    };
    
    setSelectedExercises([...selectedExercises, exerciseWithPlanning]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    }
    
    if (selectedExercises.length === 0) {
      newErrors.exercises = 'At least one exercise is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const templateData: LessonRequest = {
      name: templateName.trim(),
      workshopType: workshopType.trim() || undefined,
      exercises: selectedExercises.map((ex, index) => ({
        exerciseId: ex.id,
        plannedDurationMinutes: ex.plannedDurationMinutes || ex.minimumDurationMinutes,
        orderIndex: index
      })),
      template: true // Mark as template
    };
    
    onSave(templateData);
    resetForm();
  };

  const resetForm = () => {
    setTemplateName('');
    setDescription('');
    setSelectedExercises([]);
    setWorkshopType('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const totalDuration = selectedExercises.reduce((sum, ex) => 
    sum + (ex.plannedDurationMinutes || ex.minimumDurationMinutes), 0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookmarkPlus className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-100">Create New Template</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => {
                        setTemplateName(e.target.value);
                        if (errors.templateName) {
                          setErrors({ ...errors, templateName: '' });
                        }
                      }}
                      placeholder="e.g., Beginner Scene Work, Advanced Game Practice"
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                        errors.templateName ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {errors.templateName && (
                      <p className="text-red-400 text-sm mt-1">{errors.templateName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Workshop Type (Optional)
                    </label>
                    <input
                      type="text"
                      value={workshopType}
                      onChange={(e) => setWorkshopType(e.target.value)}
                      placeholder="e.g., Scene Work, Game of Scene, Character Development"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-100">Template Exercises</h3>
                  <span className="text-gray-400">
                    {selectedExercises.length} exercises • {totalDuration} minutes
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedExercises.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-gray-400">No exercises added yet</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Add exercises from the library to build your template
                      </p>
                    </div>
                  ) : (
                    selectedExercises.map((exercise, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                        <div className="text-gray-400 font-bold">{index + 1}</div>
                        <div className="flex-1">
                          <h4 className="text-gray-100 font-medium">{exercise.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <input
                              type="number"
                              value={exercise.plannedDurationMinutes || exercise.minimumDurationMinutes}
                              onChange={(e) => {
                                const updated = [...selectedExercises];
                                updated[index] = {
                                  ...updated[index],
                                  plannedDurationMinutes: parseInt(e.target.value) || exercise.minimumDurationMinutes
                                };
                                setSelectedExercises(updated);
                              }}
                              min={exercise.minimumDurationMinutes}
                              className="w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100 text-sm"
                            />
                            <span className="text-gray-400 text-sm">minutes</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveExercise(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))
                  )}
                  {errors.exercises && (
                    <p className="text-red-400 text-sm">{errors.exercises}</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Exercise Library */}
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Exercise Library</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {availableExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={convertToExercise(exercise)}
                      onAdd={handleAddExercise}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Template Info */}
          <Card className="p-4 mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <BookmarkPlus className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-100">Template Information</span>
            </div>
            <p className="text-gray-400 text-sm">
              Templates save your exercise sequence and durations for future use. You can create lessons 
              from templates and customize them with different teams and schedules. Templates don't include 
              team assignments or specific dates.
            </p>
          </Card>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              loading={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};