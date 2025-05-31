import React from 'react';
import { Search, Filter, X, Clock, Users, FileText } from 'lucide-react';
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
      (filters.source && filters.source !== 'all') ||
      filters.hasEvaluation !== undefined
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

        {/* Evaluation Template Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Evaluation Template
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === undefined}
                onChange={() => updateFilter('hasEvaluation', undefined)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100">All Exercises</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === true}
                onChange={() => updateFilter('hasEvaluation', true)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-green-500" />
                With Evaluation Template
              </span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                checked={filters.hasEvaluation === false}
                onChange={() => updateFilter('hasEvaluation', false)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
              />
              <span className="text-gray-100">Without Evaluation Template</span>
            </label>
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