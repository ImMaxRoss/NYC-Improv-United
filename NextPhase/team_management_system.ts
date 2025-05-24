// src/types/index.ts - Add these team management types

export interface Performer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  coachId: number;
  performerCount: number;
  performers?: Performer[];
  upcomingLessonsCount: number;
  nextLessonDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
}

export interface PerformerCreateRequest {
  firstName: string;
  lastName: string;
  email?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  notes?: string;
}

// ===========================================
// src/api/modules/teams.ts - Enhanced teams API

import { api } from '../service';
import { Team, TeamCreateRequest, Performer, PerformerCreateRequest } from '../../types';

export const teamsAPI = {
  // Team CRUD operations
  getMyTeams: (): Promise<Team[]> => api.get<Team[]>('/teams'),
  
  getTeamById: (id: number): Promise<Team> => api.get<Team>(`/teams/${id}`),
  
  getTeamWithPerformers: (id: number): Promise<Team> => api.get<Team>(`/teams/${id}/performers`),
  
  createTeam: (data: TeamCreateRequest): Promise<Team> => api.post<Team>('/teams', data),
  
  updateTeam: (id: number, data: Partial<TeamCreateRequest>): Promise<Team> => 
    api.put<Team>(`/teams/${id}`, data),
  
  deleteTeam: (id: number): Promise<void> => api.delete<void>(`/teams/${id}`),
  
  // Performer management
  addPerformerToTeam: (teamId: number, performerId: number): Promise<void> =>
    api.post<void>(`/teams/${teamId}/performers/${performerId}`),
  
  removePerformerFromTeam: (teamId: number, performerId: number): Promise<void> =>
    api.delete<void>(`/teams/${teamId}/performers/${performerId}`),
  
  updateTeamPerformers: (teamId: number, performerIds: number[], operation: 'ADD' | 'REMOVE' | 'REPLACE'): Promise<Team> =>
    api.put<Team>(`/teams/${teamId}/performers`, { performerIds, operation })
};

export const performersAPI = {
  // Performer CRUD operations
  getMyPerformers: (): Promise<Performer[]> => api.get<Performer[]>('/performers'),
  
  getPerformerById: (id: number): Promise<Performer> => api.get<Performer>(`/performers/${id}`),
  
  createPerformer: (data: PerformerCreateRequest): Promise<Performer> => 
    api.post<Performer>('/performers', data),
  
  updatePerformer: (id: number, data: Partial<PerformerCreateRequest>): Promise<Performer> =>
    api.put<Performer>(`/performers/${id}`, data),
  
  deletePerformer: (id: number): Promise<void> => api.delete<void>(`/performers/${id}`),
  
  searchPerformers: (query: string): Promise<Performer[]> =>
    api.get<Performer[]>(`/performers/search?q=${encodeURIComponent(query)}`)
};

// ===========================================
// src/components/Teams/TeamCard.tsx - Team display component

import React from 'react';
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
        
        {/* Actions dropdown would go here */}
        <div className="relative">
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
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
        >
          <UserPlus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit && onEdit(team)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete && onDelete(team.id)}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

// ===========================================
// src/components/Teams/CreateTeamModal.tsx - Team creation modal

import React, { useState } from 'react';
import { X, Save, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { TeamCreateRequest } from '../../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: TeamCreateRequest) => void;
  loading?: boolean;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<TeamCreateRequest>({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Team name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      setFormData({ name: '', description: '' });
      setErrors({});
    }
  };

  const handleChange = (field: keyof TeamCreateRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-100">Create New Team</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., The Improvisers, Monday Night Team"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the team's focus or level..."
              className="w-full h-20 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <strong>Tip:</strong> After creating your team, you can add performers from your contact list or create new ones.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// src/components/Performers/PerformerCard.tsx - Performer display component

import React from 'react';
import { User, Mail, Award, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Performer } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PerformerCardProps {
  performer: Performer;
  onEdit?: (performer: Performer) => void;
  onDelete?: (performerId: number) => void;
  onSelect?: (performer: Performer) => void;
  selected?: boolean;
  selectable?: boolean;
}

export const PerformerCard: React.FC<PerformerCardProps> = ({
  performer,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  selectable = false
}) => {
  const getExperienceBadgeColor = (level: string): string => {
    switch (level) {
      case 'Beginner': return 'bg-green-500 bg-opacity-20 text-green-300';
      case 'Intermediate': return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'Advanced': return 'bg-orange-500 bg-opacity-20 text-orange-300';
      case 'Professional': return 'bg-purple-500 bg-opacity-20 text-purple-300';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300';
    }
  };

  const cardClass = `${selectable ? 'cursor-pointer' : ''} ${
    selected ? 'ring-2 ring-yellow-500 bg-yellow-500 bg-opacity-10' : ''
  }`;

  return (
    <Card 
      hoverable={selectable} 
      className={`p-4 ${cardClass}`}
      onClick={() => selectable && onSelect && onSelect(performer)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-300" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-100 truncate">
              {performer.firstName} {performer.lastName}
            </h3>
            
            {performer.email && (
              <div className="flex items-center space-x-1 mt-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400 text-xs truncate">{performer.email}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getExperienceBadgeColor(performer.experienceLevel)
              }`}>
                {performer.experienceLevel}
              </span>
            </div>
          </div>
        </div>

        {!selectable && (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(performer)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(performer.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {performer.notes && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-sm line-clamp-2">{performer.notes}</p>
        </div>
      )}
    </Card>
  );
};

// ===========================================
// src/components/Performers/CreatePerformerModal.tsx - Performer creation modal

import React, { useState } from 'react';
import { X, Save, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { PerformerCreateRequest } from '../../types';

interface CreatePerformerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (performer: PerformerCreateRequest) => void;
  loading?: boolean;
}

export const CreatePerformerModal: React.FC<CreatePerformerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<PerformerCreateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    experienceLevel: 'Beginner',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Remove empty email if not provided
      const cleanedData = {
        ...formData,
        email: formData.email?.trim() || undefined,
        notes: formData.notes?.trim() || undefined
      };
      onSave(cleanedData);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        experienceLevel: 'Beginner',
        notes: ''
      });
      setErrors({});
    }
  };

  const handleChange = (field: keyof PerformerCreateRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-100">Add New Performer</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="First name"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Last name"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="performer@email.com"
              className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => handleChange('experienceLevel', e.target.value as any)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any notes about this performer's strengths, areas to work on, etc."
              className="w-full h-20 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Add Performer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// src/pages/Teams.tsx - Main teams management page

import React, { useState } from 'react';
import { Plus, Search, Users, UserPlus } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { TeamCard } from '../components/Teams/TeamCard';
import { CreateTeamModal } from '../components/Teams/CreateTeamModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { teamsAPI } from '../api/modules/teams';
import { Team, TeamCreateRequest } from '../types';

export const Teams: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: teams, loading, error } = useApi(() => teamsAPI.getMyTeams());

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateTeam = async (teamData: TeamCreateRequest) => {
    setCreating(true);
    try {
      await teamsAPI.createTeam(teamData);
      setShowCreateModal(false);
      // Refresh teams list
      window.location.reload();
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await teamsAPI.deleteTeam(teamId);
        // Refresh teams list
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete team:', error);
        alert('Failed to delete team. Please try again.');
      }
    }
  };

  const handleManagePerformers = (team: Team) => {
    // Navigate to team management page
    window.location.href = `/teams/${team.id}/manage`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-100">Teams</h1>
            <p className="text-gray-400 mt-2">Manage your improv teams and performers</p>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-400">Failed to load teams: {error}</p>
            <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        ) : filteredTeams.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              {searchTerm ? 'No teams found' : 'No teams yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first team to start organizing your improv performers!'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={(team) => console.log('Edit team:', team)}
                onDelete={handleDeleteTeam}
                onManagePerformers={handleManagePerformers}
                onViewDetails={(team) => window.location.href = `/teams/${team.id}`}
              />
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {filteredTeams.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Team Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{filteredTeams.length}</div>
                <div className="text-gray-400 text-sm">Total Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {filteredTeams.reduce((sum, team) => sum + team.performerCount, 0)}
                </div>
                <div className="text-gray-400 text-sm">Total Performers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {filteredTeams.reduce((sum, team) => sum + team.upcomingLessonsCount, 0)}
                </div>
                <div className="text-gray-400 text-sm">Upcoming Lessons</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateTeam}
        loading={creating}
      />
    </div>
  );
};