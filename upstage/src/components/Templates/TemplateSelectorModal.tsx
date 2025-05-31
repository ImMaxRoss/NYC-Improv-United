import React, { useState } from 'react';
import { X, Copy, Calendar, Clock, BookOpen, Edit, Trash2, Plus, MoreVertical, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ExerciseSelectorModal } from '../Exercises/ExerciseSelectorModal';
import { useApi } from '../../hooks/useApi';
import { lessonsAPI } from '../../api/modules/lessons';
import { exercisesAPI } from '../../api/modules/exercises';
import { focusAreasAPI } from '../../api/modules/focusAreas';
import { teamsAPI } from '../../api/modules/teams';
import { LessonTemplate, Exercise, ExerciseDetailed, FocusArea } from '../../types';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: number, customName?: string, teamId?: number, scheduledDate?: string) => void;
  loading?: boolean;
}

interface TemplateExercise {
  id: number;
  name: string;
  description?: string;
  minimumDurationMinutes: number;
  plannedDurationMinutes?: number;
  focusAreas?: FocusArea[];
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  loading = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);
  const [customName, setCustomName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<LessonTemplate | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const { data: templates, loading: templatesLoading } = useApi(() => lessonsAPI.getTemplates(), [refreshTrigger]);
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());
  const { data: availableExercises, loading: exercisesLoading } = useApi(() => exercisesAPI.getAll());
  const { data: focusAreas, loading: focusAreasLoading } = useApi(() => focusAreasAPI.getAll());

  const refreshTemplates = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectTemplate = () => {
    if (!selectedTemplate) return;
    
    onSelectTemplate(
      selectedTemplate.id,
      customName.trim() || undefined,
      selectedTeamId ? parseInt(selectedTeamId) : undefined,
      scheduledDate || undefined
    );
    
    // Reset form
    setSelectedTemplate(null);
    setCustomName('');
    setSelectedTeamId('');
    setScheduledDate('');
  };

  const handleTemplateClick = (template: LessonTemplate) => {
    if (editingTemplate?.id === template.id) return;
    setSelectedTemplate(template);
    setCustomName(template.name);
  };

  const handleEditTemplate = async (template: LessonTemplate) => {
    try {
      setLoadingExercises(true);
      const templateDetails = await lessonsAPI.getById(template.id);
      
      // Transform LessonExercise[] to TemplateExercise[]
      const exercises: TemplateExercise[] = templateDetails.exercises?.map(ex => ({
        id: ex.exerciseId,
        name: ex.exerciseName,
        description: ex.exerciseDescription || '',
        minimumDurationMinutes: ex.plannedDurationMinutes || 5,
        plannedDurationMinutes: ex.plannedDurationMinutes,
        focusAreas: ex.focusAreas
      })) || [];
      
      setTemplateExercises(exercises);
      setEditingTemplate(template);
      setSelectedTemplate(null);
      setShowExerciseSelector(true);
    } catch (error) {
      alert('Failed to load template details: ' + (error as Error).message);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSaveExercises = async (exercises: TemplateExercise[]) => {
    if (!editingTemplate) return;
    
    setSavingTemplate(true);
    try {
      const updateData = {
        name: editingTemplate.name,
        workshopType: editingTemplate.workshopType || undefined,
        description: editingTemplate.description || undefined,
        exercises: exercises.map((ex, index) => ({
          exerciseId: ex.id,
          plannedDurationMinutes: ex.plannedDurationMinutes || ex.minimumDurationMinutes,
          orderIndex: index
        }))
      };
      
      await lessonsAPI.updateTemplate(editingTemplate.id, updateData);
      setEditingTemplate(null);
      setShowExerciseSelector(false);
      setTemplateExercises([]);
      refreshTemplates();
      alert('Template updated successfully!');
    } catch (error) {
      alert('Failed to update template: ' + (error as Error).message);
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setShowExerciseSelector(false);
    setTemplateExercises([]);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    setDeletingTemplateId(templateId);
    
    const template = templates?.find(t => t.id === templateId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the template "${template?.name}"? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await lessonsAPI.deleteTemplate(templateId);
        refreshTemplates();
        
        if (selectedTemplate?.id === templateId) {
          setSelectedTemplate(null);
          setCustomName('');
        }
      } catch (error) {
        alert('Failed to delete template: ' + (error as Error).message);
      }
    }
    
    setDeletingTemplateId(null);
  };

  // Convert ExerciseDetailed to format expected by ExerciseSelectorModal
  const convertExercisesForSelector = (exercises: ExerciseDetailed[]): ExerciseDetailed[] => {
    return exercises || [];
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-100">Lesson Templates</h2>
                <p className="text-gray-400 text-sm">Create lessons from saved templates or manage your templates</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {templatesLoading ? (
              <LoadingSpinner />
            ) : !templates || templates.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-100 mb-2">No Templates Yet</h3>
                <p className="text-gray-400">
                  Save your first lesson as a template to see it here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-100">Available Templates</h3>
                    <div className="text-gray-400 text-sm">
                      {templates.length} template{templates.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => {
                      const isEditing = editingTemplate?.id === template.id;
                      const isSelected = selectedTemplate?.id === template.id;
                      const isDeleting = deletingTemplateId === template.id;
                      
                      return (
                        <Card
                          key={template.id}
                          className={`p-4 transition-all ${
                            isSelected && !isEditing
                              ? 'ring-2 ring-yellow-500 bg-yellow-500 bg-opacity-10'
                              : isEditing
                              ? 'ring-2 ring-blue-500 bg-blue-500 bg-opacity-10'
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          <div 
                            className="cursor-pointer"
                            onClick={() => handleTemplateClick(template)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-100 truncate">{template.name}</h4>
                                {template.description && (
                                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{template.description}</p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-2">
                                {isSelected && (
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                )}
                                
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditTemplate(template);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                    title="Edit template"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTemplate(template.id);
                                    }}
                                    disabled={isDeleting}
                                    className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                    title="Delete template"
                                  >
                                    {isDeleting ? (
                                      <LoadingSpinner size="sm" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{template.formattedDuration || 'No duration'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{template.exerciseCount || 0} exercises</span>
                              </div>
                            </div>
                            
                            {template.teamName && (
                              <div className="mt-2">
                                <span className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded">
                                  {template.teamName}
                                </span>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Customization Form */}
                {selectedTemplate && !editingTemplate && (
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-100 mb-4">Create Lesson from Template</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Lesson Name
                        </label>
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder={selectedTemplate.name}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team (Optional)
                          </label>
                          <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            disabled={teamsLoading}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                          >
                            <option value="">Select team...</option>
                            {teams?.map((team) => (
                              <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Schedule Date (Optional)
                          </label>
                          <input
                            type="datetime-local"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">
                {editingTemplate ? (
                  <span>Editing template: {editingTemplate.name}</span>
                ) : selectedTemplate ? (
                  <span>Selected: {selectedTemplate.name}</span>
                ) : (
                  <span>Select a template to create a lesson</span>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                {selectedTemplate && !editingTemplate && (
                  <Button 
                    onClick={handleSelectTemplate} 
                    disabled={loading}
                    loading={loading}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Create from Template
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && editingTemplate && (
        <ExerciseSelectorModal
          isOpen={showExerciseSelector}
          onClose={handleCancelEdit}
          onSave={handleSaveExercises}
          existingExercises={templateExercises}
          availableExercises={convertExercisesForSelector(availableExercises as ExerciseDetailed[])}
          focusAreas={focusAreas || []}
          loading={exercisesLoading || focusAreasLoading || savingTemplate}
        />
      )}
    </>
  );
};