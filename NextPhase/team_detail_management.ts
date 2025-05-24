// src/components/Teams/ManagePerformersModal.tsx - Performer assignment modal

import React, { useState } from 'react';
import { X, Save, Search, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '../ui/Button';
import { PerformerCard } from '../Performers/PerformerCard';
import { CreatePerformerModal } from '../Performers/CreatePerformerModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { performersAPI, teamsAPI } from '../../api/modules/teams';
import { Team, Performer, PerformerCreateRequest } from '../../types';

interface ManagePerformersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onUpdate?: () => void;
}

export const ManagePerformersModal: React.FC<ManagePerformersModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerformers, setSelectedPerformers] = useState<number[]>(
    team.performers?.map(p => p.id) || []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data: allPerformers, loading } = useApi(() => performersAPI.getMyPerformers());

  const filteredPerformers = allPerformers?.filter(performer =>
    `${performer.firstName} ${performer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    performer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePerformerToggle = (performer: Performer) => {
    const isSelected = selectedPerformers.includes(performer.id);
    if (isSelected) {
      setSelectedPerformers(selectedPerformers.filter(id => id !== performer.id));
    } else {
      setSelectedPerformers([...selectedPerformers, performer.id]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await teamsAPI.updateTeamPerformers(team.id, selectedPerformers, 'REPLACE');
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update team performers:', error);
      alert('Failed to update team performers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePerformer = async (performerData: PerformerCreateRequest) => {
    setCreating(true);
    try {
      const newPerformer = await performersAPI.createPerformer(performerData);
      setSelectedPerformers([...selectedPerformers, newPerformer.id]);
      setShowCreateModal(false);
      // The performer list will refresh when the component re-renders
    } catch (error) {
      console.error('Failed to create performer:', error);
      alert('Failed to create performer. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  const originalCount = team.performers?.length || 0;
  const newCount = selectedPerformers.length;
  const changeCount = newCount - originalCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-100">Manage Team Performers</h2>
              <p className="text-gray-400 text-sm">{team.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Add */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search performers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Selection Summary */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-100">
                  {newCount} performer{newCount !== 1 ? 's' : ''} selected
                </span>
                {changeCount !== 0 && (
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    changeCount > 0 
                      ? 'bg-green-500 bg-opacity-20 text-green-300'
                      : 'bg-red-500 bg-opacity-20 text-red-300'
                  }`}>
                    {changeCount > 0 ? '+' : ''}{changeCount}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPerformers([])}
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPerformers(allPerformers?.map(p => p.id) || [])}
                >
                  Select All
                </Button>
              </div>
            </div>
          </div>

          {/* Performers List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <LoadingSpinner />
            ) : filteredPerformers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No performers found' : 'No performers created yet'}
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setShowCreateModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create First Performer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPerformers.map((performer) => (
                  <PerformerCard
                    key={performer.id}
                    performer={performer}
                    onSelect={handlePerformerToggle}
                    selected={selectedPerformers.includes(performer.id)}
                    selectable={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Create Performer Modal */}
      <CreatePerformerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreatePerformer}
        loading={creating}
      />
    </div>
  );
};

// ===========================================
// src/pages/TeamDetail.tsx - Individual team management page

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  UserPlus, 
  Calendar, 
  BarChart3,
  Settings,
  Plus,
  Play
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { PerformerCard } from '../components/Performers/PerformerCard';
import { ManagePerformersModal } from '../components/Teams/ManagePerformersModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { teamsAPI } from '../api/modules/teams';
import { lessonsAPI } from '../api/modules/lessons';

export const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [showManagePerformers, setShowManagePerformers] = useState(false);

  const { data: team, loading: teamLoading, error: teamError } = useApi(
    () => teamsAPI.getTeamWithPerformers(parseInt(teamId!)),
    [teamId]
  );

  const { data: upcomingLessons, loading: lessonsLoading } = useApi(
    () => lessonsAPI.getUpcoming(),
    []
  );

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (teamError || !team) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-100 mb-4">Team Not Found</h1>
            <p className="text-gray-400 mb-6">The team you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/teams')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const teamLessons = upcomingLessons?.filter(lesson => lesson.teamId === team.id) || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/teams')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-100">{team.name}</h1>
              {team.description && (
                <p className="text-gray-400 mt-2">{team.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowManagePerformers(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Performers
            </Button>
            <Button variant="ghost">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={UserPlus}
            label="Performers"
            value={team.performerCount}
            color="bg-blue-500 text-blue-500"
          />
          <StatCard
            icon={Calendar}
            label="Upcoming Lessons"
            value={teamLessons.length}
            color="bg-green-500 text-green-500"
          />
          <StatCard
            icon={BarChart3}
            label="Total Lessons"
            value={0} // Would come from API
            color="bg-purple-500 text-purple-500"
          />
          <StatCard
            icon={BarChart3}
            label="Avg. Attendance"
            value="85%" // Would come from API
            color="bg-yellow-500 text-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performers */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-100">Team Performers</h2>
                <Button
                  size="sm"
                  onClick={() => setShowManagePerformers(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>

              {team.performers && team.performers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.performers.map((performer) => (
                    <PerformerCard
                      key={performer.id}
                      performer={performer}
                      onEdit={(performer) => console.log('Edit performer:', performer)}
                      onDelete={(performerId) => console.log('Delete performer:', performerId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">No performers yet</h3>
                  <p className="text-gray-400 mb-6">
                    Add performers to this team to start organizing your practices!
                  </p>
                  <Button onClick={() => setShowManagePerformers(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Performers
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Lessons */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-100">Upcoming Lessons</h3>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {lessonsLoading ? (
                <LoadingSpinner />
              ) : teamLessons.length > 0 ? (
                <div className="space-y-3">
                  {teamLessons.slice(0, 3).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-100">
                            {lesson.name || 'Practice Session'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {new Date(lesson.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No upcoming lessons</p>
                  <Button size="sm" variant="secondary" className="mt-3">
                    <Plus className="h-3 w-3 mr-2" />
                    Plan Lesson
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => navigate('/lesson-planner')}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Plan New Lesson
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <Play className="h-4 w-4 mr-3" />
                  Start Practice
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Team Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-100 mb-4">Team Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-gray-100">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-gray-100">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience Mix</span>
                  <div className="text-right">
                    {team.performers && team.performers.length > 0 ? (
                      <div className="space-y-1">
                        {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(level => {
                          const count = team.performers!.filter(p => p.experienceLevel === level).length;
                          if (count === 0) return null;
                          return (
                            <div key={level} className="text-gray-100 text-sm">
                              {count} {level}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No data</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Manage Performers Modal */}
      <ManagePerformersModal
        isOpen={showManagePerformers}
        onClose={() => setShowManagePerformers(false)}
        team={team}
        onUpdate={() => window.location.reload()}
      />
    </div>
  );
};

// ===========================================
// src/pages/Performers.tsx - All performers management page

import React, { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { PerformerCard } from '../components/Performers/PerformerCard';
import { CreatePerformerModal } from '../components/Performers/CreatePerformerModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { performersAPI } from '../api/modules/teams';
import { Performer, PerformerCreateRequest } from '../types';

export const Performers: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const { data: performers, loading, error } = useApi(() => performersAPI.getMyPerformers());

  const filteredPerformers = performers?.filter(performer => {
    const matchesSearch = 
      `${performer.firstName} ${performer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      performer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExperience = !experienceFilter || performer.experienceLevel === experienceFilter;
    
    return matchesSearch && matchesExperience;
  }) || [];

  const handleCreatePerformer = async (performerData: PerformerCreateRequest) => {
    setCreating(true);
    try {
      await performersAPI.createPerformer(performerData);
      setShowCreateModal(false);
      // Refresh performers list
      window.location.reload();
    } catch (error) {
      console.error('Failed to create performer:', error);
      alert('Failed to create performer. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePerformer = async (performerId: number) => {
    if (window.confirm('Are you sure you want to delete this performer? This action cannot be undone.')) {
      try {
        await performersAPI.deletePerformer(performerId);
        // Refresh performers list
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete performer:', error);
        alert('Failed to delete performer. Please try again.');
      }
    }
  };

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const experienceStats = experienceLevels.map(level => ({
    level,
    count: performers?.filter(p => p.experienceLevel === level).length || 0
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-100">Performers</h1>
            <p className="text-gray-400 mt-2">Manage your improv performer contacts</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Performer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search performers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
            >
              <option value="">All Experience Levels</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Experience Level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {experienceStats.map(({ level, count }) => (
            <Card key={level} className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{count}</div>
              <div className="text-gray-400 text-sm">{level}</div>
            </Card>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-400">Failed to load performers: {error}</p>
            <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        ) : filteredPerformers.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              {searchTerm || experienceFilter ? 'No performers found' : 'No performers yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || experienceFilter
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first performer to start building your contact list!'
              }
            </p>
            {!searchTerm && !experienceFilter && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Performer
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerformers.map((performer) => (
              <PerformerCard
                key={performer.id}
                performer={performer}
                onEdit={(performer) => console.log('Edit performer:', performer)}
                onDelete={handleDeletePerformer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Performer Modal */}
      <CreatePerformerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreatePerformer}
        loading={creating}
      />
    </div>
  );
};

// ===========================================
// src/App.tsx - Updated with new routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { LivePractice } from './pages/LivePractice';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Performers } from './pages/Performers';
import { LessonPlanner } from './pages/LessonPlanner';
import { Login } from './pages/Login';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-practice/:lessonId" element={<LivePractice />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/performers" element={<Performers />} />
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;