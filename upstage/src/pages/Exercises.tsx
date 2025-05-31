import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Grid, 
  List, 
  Download, 
  Upload,
  Filter,
  TrendingUp,
  Bookmark,
  Shuffle
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { ExerciseFilters } from '../components/Exercises/ExerciseFilters';
import { EnhancedExerciseCard } from '../components/Exercises/EnhancedExerciseCard';
import { ExerciseDetailModal } from '../components/Exercises/ExerciseDetailModal';
import { CreateExerciseModal } from '../components/Exercises/CreateExerciseModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { useApi } from '../hooks/useApi';
import { exercisesAPI } from '../api/modules/exercises';
import { 
  ExerciseDetailed, 
  ExerciseFilter, 
  ExerciseCreateRequest,
  ExerciseResponse,
  FocusArea 
} from '../types';

export const Exercises: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetailed | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  
  const [filters, setFilters] = useState<ExerciseFilter>({
    source: 'all',
    sortBy: 'popularity',
    sortDirection: 'DESC'
  });

  // Mock focus areas - would come from API
  const focusAreas: FocusArea[] = [
    { id: 1, name: 'Yes And', description: 'Accept and build', colorCode: '#4CAF50' },
    { id: 2, name: 'Agreement', description: 'Shared reality', colorCode: '#2196F3' },
    { id: 3, name: 'Who/What/Where', description: 'Context establishment', colorCode: '#FF9800' },
    { id: 4, name: 'Physicality', description: 'Body and space', colorCode: '#9C27B0' },
    { id: 5, name: 'Listening', description: 'Active attention', colorCode: '#F44336' },
    { id: 6, name: 'Commitment', description: 'Full engagement', colorCode: '#3F51B5' },
    { id: 7, name: 'Avoidance of Denial', description: 'Accept reality', colorCode: '#009688' },
    { id: 8, name: 'Efficiency', description: 'Economic scene work', colorCode: '#795548' }
  ];

  const { data: allExercises, loading, error } = useApi(() => exercisesAPI.getAll(), [refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger data refetch
  };



  // Filter and sort exercises
const filteredExercises = useMemo(() => {
  if (!allExercises) return [];
  
  let filtered = allExercises.filter((exercise: ExerciseResponse) => {      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matches = 
          exercise.name.toLowerCase().includes(searchLower) ||
          exercise.description.toLowerCase().includes(searchLower) ||
          exercise.createdByCoachName?.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }
      
      // Source filter
      if (filters.source === 'public' && !exercise.public) return false;
      if (filters.source === 'custom' && exercise.public) return false;
      if (filters.source === 'favorites' && !exercise.favorite) return false;
      
      // Duration filters
      if (filters.minDuration && exercise.minimumDurationMinutes < filters.minDuration) return false;
      if (filters.maxDuration && exercise.minimumDurationMinutes > filters.maxDuration) return false;
      
      // Focus area filter
      if (filters.focusAreaIds && filters.focusAreaIds.length > 0) {
        const hasMatchingFocus = exercise.focusAreas.some(area => 
          filters.focusAreaIds!.includes(area.id)
        );
        if (!hasMatchingFocus) return false;
      }
      
      // Evaluation template filter
      if (filters.hasEvaluation !== undefined) {
        if (filters.hasEvaluation && !exercise.hasDefaultEvaluationTemplate) return false;
        if (!filters.hasEvaluation && exercise.hasDefaultEvaluationTemplate) return false;
      }
      
      return true;
    });
    
    // Sort exercises
    filtered.sort((a: ExerciseResponse, b: ExerciseResponse) => {
      const direction = filters.sortDirection === 'DESC' ? -1 : 1;
      
      switch (filters.sortBy) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'popularity':
          return direction * (a.usageCount - b.usageCount);
        case 'duration':
          return direction * (a.minimumDurationMinutes - b.minimumDurationMinutes);
        case 'created':
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'updated':
          return direction * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [allExercises, filters]);

  const handleCreateExercise = async (exerciseData: ExerciseCreateRequest) => {
    setCreating(true);
    try {
      await exercisesAPI.create(exerciseData);
      setShowCreateModal(false);
      refreshData(); // Refresh data instead of page reload
    } catch (error) {
      console.error('Failed to create exercise:', error);
      alert('Failed to create exercise. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleFavorite = async (exerciseId: number) => {
    // Would call API to toggle favorite
    console.log('Toggle favorite:', exerciseId);
  };

  const handleDuplicateExercise = async (exercise: ExerciseResponse) => {
    // Would call API to duplicate exercise
    console.log('Duplicate exercise:', exercise);
  };

  const clearFilters = () => {
    setFilters({
      source: 'all',
      sortBy: 'popularity',
      sortDirection: 'DESC'
    });
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!allExercises) return { total: 0, custom: 0, favorites: 0, popular: 0 };
    
    return {
      total: allExercises.length,
      custom: allExercises.filter((e: ExerciseResponse) => !e.public).length,
      favorites: allExercises.filter((e: ExerciseResponse) => e.favorite).length,
      popular: allExercises.filter((e: ExerciseResponse) => e.popular).length
    };
  }, [allExercises]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-100">Exercise Library</h1>
            <p className="text-gray-400 mt-2">Discover, create, and organize improv exercises</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Exercise
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Grid}
            label="Total Exercises"
            value={stats.total}
            color="bg-blue-500 text-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Popular"
            value={stats.popular}
            color="bg-yellow-500 text-yellow-500"
          />
          <StatCard
            icon={Bookmark}
            label="Favorites"
            value={stats.favorites}
            color="bg-red-500 text-red-500"
          />
          <StatCard
            icon={Plus}
            label="Custom"
            value={stats.custom}
            color="bg-green-500 text-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <ExerciseFilters
                filters={filters}
                onFiltersChange={setFilters}
                focusAreas={focusAreas}
                onClearFilters={clearFilters}
                resultCount={filteredExercises.length}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                
                <span className="text-gray-400 text-sm">
                  {filteredExercises.length} of {stats.total} exercises
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Shuffle exercises
                    const shuffled = [...filteredExercises].sort(() => Math.random() - 0.5);
                    console.log('Shuffled exercises:', shuffled);
                  }}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Surprise Me
                </Button>
                
                <div className="flex border border-gray-600 rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-600 text-gray-100' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-600 text-gray-100' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-red-400">Failed to load exercises: {error}</p>
                <Button variant="secondary" className="mt-4" onClick={refreshData}>
                  Try Again
                </Button>
              </Card>
            ) : filteredExercises.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  No exercises found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or create a new exercise!
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Exercise
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredExercises.map((exercise: ExerciseResponse) => (
                  <EnhancedExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onView={(ex: ExerciseResponse) => setSelectedExercise(ex as ExerciseDetailed)}
                    onToggleFavorite={handleToggleFavorite}
                    onDuplicate={handleDuplicateExercise}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onToggleFavorite={handleToggleFavorite}
          onDuplicate={(ex: ExerciseDetailed) => handleDuplicateExercise(ex as ExerciseResponse)}
        />
      )}

      {/* Create Exercise Modal */}
      <CreateExerciseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateExercise}
        focusAreas={focusAreas}
        loading={creating}
      />
    </div>
  );
};