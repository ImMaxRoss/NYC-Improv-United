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