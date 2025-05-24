import React from 'react';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { AnalyticsFilter, Team } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AnalyticsFiltersProps {
  filters: AnalyticsFilter;
  onFiltersChange: (filters: AnalyticsFilter) => void;
  teams: Team[];
  onExportReport?: () => void;
  onRefresh?: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  teams,
  onExportReport,
  onRefresh
}) => {
  const updateFilter = (key: keyof AnalyticsFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium text-gray-100">Analytics Filters</h3>
        </div>
        
        <div className="flex space-x-2">
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onExportReport && (
            <Button variant="secondary" size="sm" onClick={onExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => updateFilter('timeRange', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Date Range */}
        {filters.timeRange === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        )}

        {/* Team Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Teams
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!filters.teamIds || filters.teamIds.length === 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter('teamIds', []);
                  }
                }}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
              />
              <span className="text-gray-300 text-sm">All Teams</span>
            </label>
            
            {teams.map(team => (
              <label key={team.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.teamIds?.includes(team.id) || false}
                  onChange={(e) => {
                    const currentIds = filters.teamIds || [];
                    if (e.target.checked) {
                      updateFilter('teamIds', [...currentIds, team.id]);
                    } else {
                      updateFilter('teamIds', currentIds.filter(id => id !== team.id));
                    }
                  }}
                  className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-300 text-sm">{team.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-xs">
            Analyzing {filters.teamIds?.length || teams.length} team{(filters.teamIds?.length || teams.length) !== 1 ? 's' : ''} 
            {' '}over {timeRangeOptions.find(opt => opt.value === filters.timeRange)?.label.toLowerCase()}
          </div>
        </div>
      </div>
    </Card>
  );
};