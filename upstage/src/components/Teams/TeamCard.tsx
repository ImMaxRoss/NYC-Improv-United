import React, { useState } from 'react';
import { Users, Calendar, MoreVertical, Edit, Trash2, UserPlus } from 'lucide-react';
import { Team } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TeamCardProps {
  team: Team;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: number) => void;
  onManagePerformers?: (team: Team) => void;
  onViewDetails?: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onEdit,
  onDelete,
  onManagePerformers,
  onViewDetails
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No upcoming lessons';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <Card hoverable className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{team.name}</h3>
          {team.description && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{team.description}</p>
          )}
        </div>
        
        {/* Actions dropdown */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          
          {showDropdown && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onEdit && onEdit(team);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Team</span>
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onManagePerformers && onManagePerformers(team);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Manage Performers</span>
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
                    onDelete && onDelete(team.id);
                  }
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Team</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="text-gray-300 text-sm">
            {team.performerCount} {team.performerCount === 1 ? 'performer' : 'performers'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-gray-300 text-sm">
            {team.upcomingLessonsCount} upcoming
          </span>
        </div>
      </div>

      {/* Next Lesson */}
      {team.nextLessonDate && (
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-3 mb-4">
          <p className="text-yellow-200 text-sm">
            <strong>Next lesson:</strong> {formatDate(team.nextLessonDate)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(team)}
          className="flex-1"
        >
          View Details
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onManagePerformers && onManagePerformers(team)}
          title="Manage Performers"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </Card>
  );
};