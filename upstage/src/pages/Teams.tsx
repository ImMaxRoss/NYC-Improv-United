import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, UserPlus, Edit } from 'lucide-react';
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
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: teams, loading, error } = useApi(() => teamsAPI.getMyTeams(), [refreshTrigger]);

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateTeam = async (teamData: TeamCreateRequest) => {
    setCreating(true);
    try {
      await teamsAPI.createTeam(teamData);
      setShowCreateModal(false);
      refreshData();
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditTeam = async (teamData: TeamCreateRequest) => {
    if (!editingTeam) return;
    
    setUpdating(true);
    try {
      await teamsAPI.updateTeam(editingTeam.id, teamData);
      setShowEditModal(false);
      setEditingTeam(null);
      refreshData();
    } catch (error) {
      console.error('Failed to update team:', error);
      alert('Failed to update team. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await teamsAPI.deleteTeam(teamId);
      refreshData();
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  const handleManagePerformers = (team: Team) => {
    // Navigate to team detail page where performers can be managed
    navigate(`/teams/${team.id}`);
  };

  const handleEditTeamClick = (team: Team) => {
    setEditingTeam(team);
    setShowEditModal(true);
  };

  const handleViewDetails = (team: Team) => {
    navigate(`/teams/${team.id}`);
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
            <Button variant="secondary" className="mt-4" onClick={refreshData}>
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
                onEdit={handleEditTeamClick}
                onDelete={handleDeleteTeam}
                onManagePerformers={handleManagePerformers}
                onViewDetails={handleViewDetails}
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

      {/* Edit Team Modal */}
      {editingTeam && (
        <CreateTeamModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTeam(null);
          }}
          onSave={handleEditTeam}
          loading={updating}
          initialData={{
            name: editingTeam.name,
            description: editingTeam.description || ''
          }}
          title="Edit Team"
        />
      )}
    </div>
  );
};