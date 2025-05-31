import React, { useState, useEffect } from 'react';
import { X, Plus, ArrowUp, ArrowDown, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EnhancedExerciseCard } from './EnhancedExerciseCard';
import { ExerciseFilters } from './ExerciseFilters';
import { ExerciseDetailed, ExerciseFilter, FocusArea } from '../../types';

interface TemplateExercise {
  id: number;
  name: string;
  description?: string;
  minimumDurationMinutes: number;
  plannedDurationMinutes?: number;
  focusAreas?: FocusArea[];
}

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercises: TemplateExercise[]) => void;
  existingExercises: TemplateExercise[];
  availableExercises: ExerciseDetailed[];
  focusAreas: FocusArea[];
  loading?: boolean;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingExercises = [],
  availableExercises = [],
  focusAreas = [],
  loading = false
}) => {
  const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>(existingExercises);
  const [filters, setFilters] = useState<ExerciseFilter>({});
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDetailed[]>(availableExercises);

  useEffect(() => {
    // Apply filters to available exercises
    let result = [...availableExercises];
    
    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm) || 
        ex.description.toLowerCase().includes(searchTerm) ||
        (ex.createdByCoachName && ex.createdByCoachName.toLowerCase().includes(searchTerm))
      );
    }
    
    // Source filter
    if (filters.source === 'custom') {
      result = result.filter(ex => !ex.public);
    } else if (filters.source === 'public') {
      result = result.filter(ex => ex.public);
    } else if (filters.source === 'favorites') {
      result = result.filter(ex => ex.favorite);
    }
    
    // Duration filter
    if (filters.minDuration) {
      result = result.filter(ex => ex.minimumDurationMinutes >= (filters.minDuration || 0));
    }
    if (filters.maxDuration) {
      result = result.filter(ex => ex.minimumDurationMinutes <= (filters.maxDuration || 180));
    }
    
    // Focus areas filter
    if (filters.focusAreaIds && filters.focusAreaIds.length > 0) {
      result = result.filter(ex => 
        ex.focusAreas.some(fa => filters.focusAreaIds?.includes(fa.id))
      );
    }
    
    setFilteredExercises(result);
  }, [filters, availableExercises]);

  const handleAddExercise = (exercise: ExerciseDetailed) => {
    // Check if exercise is already selected
    if (selectedExercises.some(ex => ex.id === exercise.id)) return;
    
    const newExercise: TemplateExercise = {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      minimumDurationMinutes: exercise.minimumDurationMinutes,
      plannedDurationMinutes: exercise.minimumDurationMinutes,
      focusAreas: exercise.focusAreas
    };
    
    setSelectedExercises(prev => [...prev, newExercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleDurationChange = (index: number, duration: number) => {
    setSelectedExercises(prev => 
      prev.map((ex, i) => 
        i === index ? { ...ex, plannedDurationMinutes: duration } : ex
      )
    );
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedExercises.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];
    
    setSelectedExercises(newExercises);
  };

  const handleSave = () => {
    onSave(selectedExercises);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-100">Select Exercises</h2>
              <p className="text-gray-400 text-sm">
                Add exercises to your template and set durations
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Exercise Library */}
          <div className="w-1/2 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <ExerciseFilters
                filters={filters}
                onFiltersChange={setFilters}
                focusAreas={focusAreas}
                onClearFilters={() => setFilters({})}
                resultCount={filteredExercises.length}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredExercises.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-100 mb-2">No Exercises Found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredExercises.map(exercise => (
                  <EnhancedExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    compact={true}
                    onAddToLesson={() => handleAddExercise(exercise)}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Right Panel - Selected Exercises */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium text-gray-100">
                Selected Exercises ({selectedExercises.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {selectedExercises.length === 0 ? (
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-100 mb-2">No Exercises Added</h3>
                  <p className="text-gray-400">
                    Select exercises from the library to add them to your template
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedExercises.map((exercise, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-100 truncate">
                            {index + 1}. {exercise.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove exercise"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveExercise(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded ${index === 0 ? 'text-gray-600' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleMoveExercise(index, 'down')}
                            disabled={index === selectedExercises.length - 1}
                            className={`p-1 rounded ${index === selectedExercises.length - 1 ? 'text-gray-600' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          
                          <span className="text-gray-400 text-sm">Position: {index + 1}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">Duration:</span>
                          <input
                            type="number"
                            min={exercise.minimumDurationMinutes}
                            max={120}
                            value={exercise.plannedDurationMinutes}
                            onChange={(e) => 
                              handleDurationChange(index, Math.max(
                                exercise.minimumDurationMinutes, 
                                parseInt(e.target.value) || exercise.minimumDurationMinutes
                              ))
                            }
                            className="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100"
                          />
                          <span className="text-gray-400 text-sm">min</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              {selectedExercises.length > 0 ? (
                <span>Total duration: {
                  selectedExercises.reduce((sum, ex) => sum + (ex.plannedDurationMinutes || 0), 0)
                } minutes</span>
              ) : (
                <span>Select exercises to continue</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={selectedExercises.length === 0 || loading}
                loading={loading}
              >
                Save Exercises
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};