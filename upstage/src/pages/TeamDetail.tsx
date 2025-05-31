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
  Play,
  Users
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
import { PerformerSummary, Lesson } from '../types';

export const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [showManagePerformers, setShowManagePerformers] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: team, loading: teamLoading, error: teamError } = useApi(
    () => teamsAPI.getTeamWithPerformers(parseInt(teamId!)),
    [teamId, refreshTrigger]
  );

  const { data: upcomingLessons, loading: lessonsLoading } = useApi(
    () => lessonsAPI.getUpcoming(),
    []
  );

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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

  const teamLessons = upcomingLessons?.filter((lesson: Lesson) => lesson.teamId === team.id) || [];

  // Helper function to safely format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.warn('Invalid date:', dateString);
      return 'Invalid Date';
    }
  };

  // Convert PerformerSummary to Performer for PerformerCard compatibility
  const convertToPerformer = (performer: PerformerSummary) => ({
    ...performer,
    email: undefined,
    notes: undefined,
    createdAt: performer.createdAt || new Date().toISOString(),
    updatedAt: performer.updatedAt || new Date().toISOString()
  });

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
            icon={Users}
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
                  {team.performers.map((performer: PerformerSummary) => (
                    <PerformerCard
                      key={performer.id}
                      performer={convertToPerformer(performer)}
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
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => navigate('/lesson-planner')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {lessonsLoading ? (
                <LoadingSpinner />
              ) : teamLessons.length > 0 ? (
                <div className="space-y-3">
                  {teamLessons.slice(0, 3).map((lesson: Lesson) => (
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
                            {formatDate(lesson.scheduledDate)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/live-practice/${lesson.id}`)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No upcoming lessons</p>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="mt-3"
                    onClick={() => navigate('/lesson-planner')}
                  >
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
                  onClick={() => {
                    // Could navigate to a practice starter or show modal
                    console.log('Start practice for team:', team.id);
                  }}
                >
                  <Play className="h-4 w-4 mr-3" />
                  Start Practice
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => navigate('/analytics')}
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
                    {formatDate(team.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-gray-100">
                    {formatDate(team.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Performers</span>
                  <span className="text-gray-100">
                    {team.performerCount}
                  </span>
                </div>
                {team.nextLessonDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Lesson</span>
                    <span className="text-gray-100">
                      {formatDate(team.nextLessonDate)}
                    </span>
                  </div>
                )}
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
        onUpdate={refreshData}
      />
    </div>
  );
};