// src/components/Exercises/ExerciseFilters.tsx - Advanced filtering component

import React from 'react';
import { Search, Filter, X, Clock, Users } from 'lucide-react';
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

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  filters,
  onFiltersChange,
  focusAreas,
  onClearFilters,
  resultCount
}) => {
  const updateFilter = (key: keyof ExerciseFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleFocusArea = (focusAreaId: number) => {
    const currentIds = filters.focusAreaIds || [];
    const newIds = currentIds.includes(focusAreaId)
      ? currentIds.filter(id => id !== focusAreaId)
      : [...currentIds, focusAreaId];
    updateFilter('focusAreaIds', newIds);
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      (filters.focusAreaIds && filters.focusAreaIds.length > 0) ||
      filters.difficulty ||
      filters.groupSize ||
      filters.maxDuration ||
      filters.minDuration ||
      (filters.source && filters.source !== 'all')
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Exercises
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description, or creator..."
              value={filters.searchTerm || ''}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source
            </label>
            <select
              value={filters.source || 'all'}
              onChange={(e) => updateFilter('source', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="all">All Exercises</option>
              <option value="public">Community</option>
              <option value="custom">My Custom</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) => updateFilter('difficulty', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Any Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Group Size
            </label>
            <select
              value={filters.groupSize || ''}
              onChange={(e) => updateFilter('groupSize', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Any Size</option>
              <option value="Individual">Individual</option>
              <option value="Pairs">Pairs</option>
              <option value="Small Group">Small Group</option>
              <option value="Large Group">Large Group</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'name'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="name">Name</option>
              <option value="popularity">Popularity</option>
              <option value="duration">Duration</option>
              <option value="created">Date Created</option>
              <option value="updated">Last Updated</option>
            </select>
          </div>
        </div>

        {/* Duration Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Duration Range (minutes)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Min"
                  min="1"
                  max="180"
                  value={filters.minDuration || ''}
                  onChange={(e) => updateFilter('minDuration', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max"
                  min="1"
                  max="180"
                  value={filters.maxDuration || ''}
                  onChange={(e) => updateFilter('maxDuration', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Focus Areas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {focusAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => toggleFocusArea(area.id)}
                className={`flex items-center space-x-2 p-2 rounded border transition-all text-sm ${
                  filters.focusAreaIds?.includes(area.id)
                    ? 'border-yellow-500 bg-yellow-500 bg-opacity-20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: area.colorCode }}
                />
                <span className="text-gray-100 truncate">{area.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            {resultCount !== undefined && (
              <span>{resultCount} exercise{resultCount !== 1 ? 's' : ''} found</span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ===========================================
// src/components/Exercises/EnhancedExerciseCard.tsx - Improved exercise card

import React from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  StarOff, 
  Eye, 
  Play, 
  Heart, 
  Copy,
  MoreVertical,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { ExerciseDetailed } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EnhancedExerciseCardProps {
  exercise: ExerciseDetailed;
  onView?: (exercise: ExerciseDetailed) => void;
  onAddToLesson?: (exercise: ExerciseDetailed) => void;
  onToggleFavorite?: (exerciseId: number) => void;
  onDuplicate?: (exercise: ExerciseDetailed) => void;
  compact?: boolean;
}

export const EnhancedExerciseCard: React.FC<EnhancedExerciseCardProps> = ({
  exercise,
  onView,
  onAddToLesson,
  onToggleFavorite,
  onDuplicate,
  compact = false
}) => {
  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 bg-opacity-20 text-green-300 border-green-500';
      case 'Medium': return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500';
      case 'Hard': return 'bg-red-500 bg-opacity-20 text-red-300 border-red-500';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-500';
    }
  };

  const getGroupSizeIcon = (groupSize?: string) => {
    switch (groupSize) {
      case 'Individual': return '👤';
      case 'Pairs': return '👥';
      case 'Small Group': return '👥👥';
      case 'Large Group': return '👥👥👥';
      default: return '🎭';
    }
  };

  return (
    <Card hoverable className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-100 truncate">{exercise.name}</h3>
              {exercise.popular && (
                <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
              {exercise.favorite && (
                <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
              )}
            </div>
            
            <p className={`text-gray-400 text-sm ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
              {exercise.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite && onToggleFavorite(exercise.id)}
            >
              {exercise.favorite ? (
                <BookmarkCheck className="h-4 w-4 text-yellow-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(exercise)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Exercise Details */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded border text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty || 'Any Level'}
          </span>
          
          <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 text-xs rounded flex items-center border border-blue-500 border-opacity-30">
            <Clock className="h-3 w-3 mr-1" />
            {exercise.formattedMinimumDuration}
          </span>
          
          <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-300 text-xs rounded border border-purple-500 border-opacity-30">
            {getGroupSizeIcon(exercise.groupSize)} {exercise.groupSize || 'Any Size'}
          </span>
          
          {exercise.usageCount > 0 && (
            <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-300 text-xs rounded border border-gray-500 border-opacity-30">
              Used {exercise.usageCount}x
            </span>
          )}
        </div>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-2">
          {exercise.focusAreas.slice(0, 3).map((area, index) => (
            <span
              key={area.id}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: `${area.colorCode}20`, 
                color: area.colorCode,
                border: `1px solid ${area.colorCode}30`
              }}
            >
              {area.name}
            </span>
          ))}
          {exercise.focusAreas.length > 3 && (
            <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
              +{exercise.focusAreas.length - 3} more
            </span>
          )}
        </div>

        {/* Materials & Source */}
        {!compact && (
          <div className="space-y-2">
            {exercise.materials && exercise.materials.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">Materials:</span>
                <span className="text-gray-300 text-xs">
                  {exercise.materials.slice(0, 2).join(', ')}
                  {exercise.materials.length > 2 && ` +${exercise.materials.length - 2} more`}
                </span>
              </div>
            )}
            
            {exercise.createdByCoachName && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  by {exercise.createdByCoachName}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(exercise.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView && onView(exercise)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          {onAddToLesson && (
            <Button
              size="sm"
              onClick={() => onAddToLesson(exercise)}
            >
              <Play className="h-4 w-4 mr-2" />
              Add to Lesson
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ===========================================
// src/pages/Exercises.tsx - Main exercises library page

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
  FocusArea 
} from '../types';

export const Exercises: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetailed | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
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

  const { data: allExercises, loading, error } = useApi(() => exercisesAPI.getAll());

  // Filter and sort exercises
  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    
    let filtered = allExercises.filter((exercise: ExerciseDetailed) => {
      // Search term
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
      
      // Difficulty filter
      if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
      
      // Group size filter
      if (filters.groupSize && exercise.groupSize !== filters.groupSize) return false;
      
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
      
      return true;
    });
    
    // Sort exercises
    filtered.sort((a, b) => {
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
      // Refresh exercises list
      window.location.reload();
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

  const handleDuplicateExercise = async (exercise: ExerciseDetailed) => {
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
      custom: allExercises.filter((e: ExerciseDetailed) => !e.public).length,
      favorites: allExercises.filter((e: ExerciseDetailed) => e.favorite).length,
      popular: allExercises.filter((e: ExerciseDetailed) => e.popular).length
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
                <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
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
                {filteredExercises.map((exercise) => (
                  <EnhancedExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onView={setSelectedExercise}
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
          onDuplicate={handleDuplicateExercise}
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