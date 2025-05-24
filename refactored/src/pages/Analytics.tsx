import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  Download,
  Eye,
  Award,
  Activity
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { AnalyticsFilters } from '../components/Analytics/AnalyticsFilters';
import { PerformerProgressCard } from '../components/Analytics/PerformerProgressCard';
import { TeamAnalyticsCard } from '../components/Analytics/TeamAnalyticsCard';
import { ExerciseEffectivenessChart } from '../components/Analytics/ExerciseEffectivenessChart';
import { CoachingInsightsWidget } from '../components/Analytics/CoachingInsightsWidget';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { analyticsAPI } from '../api/modules/analytics';
import { teamsAPI } from '../api/modules/teams';
import { 
  AnalyticsFilter, 
  PerformerProgress,
  TeamAnalytics,
  ExerciseEffectiveness,
  CoachingInsights
} from '../types';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'performers' | 'exercises'>('overview');
  const [showFilters, setShowFilters] = useState(true);
  
  const [filters, setFilters] = useState<AnalyticsFilter>({
    timeRange: '30d'
  });

  // API calls
  const { data: teams, loading: teamsLoading } = useApi(() => teamsAPI.getMyTeams());
  const { data: coachingInsights, loading: insightsLoading } = useApi(
    () => analyticsAPI.getCoachingInsights(filters),
    [filters]
  );
  const { data: performerProgress, loading: performersLoading } = useApi(
    () => analyticsAPI.getPerformerProgress(filters),
    [filters]
  );
  const { data: teamAnalytics, loading: teamAnalyticsLoading } = useApi(
    () => analyticsAPI.getTeamAnalytics(filters),
    [filters]
  );
  const { data: exerciseEffectiveness, loading: exercisesLoading } = useApi(
    () => analyticsAPI.getExerciseEffectiveness(filters),
    [filters]
  );

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    if (!teamAnalytics || !performerProgress || !coachingInsights) {
      return { totalPerformers: 0, avgScore: 0, totalPractices: 0, improvementRate: 0 };
    }

    const totalPerformers = performerProgress.length;
    const avgScore = performerProgress.reduce((sum, p) => sum + p.overallProgress, 0) / totalPerformers;
    const totalPractices = coachingInsights.totalPractices;
    const improvingPerformers = performerProgress.filter(p => 
      Object.values(p.focusAreaScores).some(score => score.trend === 'improving')
    ).length;
    const improvementRate = (improvingPerformers / totalPerformers) * 100;

    return { totalPerformers, avgScore, totalPractices, improvementRate };
  }, [teamAnalytics, performerProgress, coachingInsights]);

  const handleExportReport = () => {
    // Would trigger report generation and download
    console.log('Exporting analytics report with filters:', filters);
  };

  const handleRefreshData = () => {
    // Would refresh all analytics data
    window.location.reload();
  };

  const anyLoading = insightsLoading || performersLoading || teamAnalyticsLoading || exercisesLoading;

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'performers', label: 'Performers', icon: Target },
    { id: 'exercises', label: 'Exercises', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-100">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">Track progress, measure effectiveness, and improve your coaching</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button variant="secondary" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <AnalyticsFilters
                filters={filters}
                onFiltersChange={setFilters}
                teams={teams || []}
                onExportReport={handleExportReport}
                onRefresh={handleRefreshData}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all flex-1 justify-center ${
                      activeTab === tab.id
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            {anyLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <StatCard
                        icon={Users}
                        label="Total Performers"
                        value={overviewStats.totalPerformers}
                        color="bg-blue-500 text-blue-500"
                      />
                      <StatCard
                        icon={Award}
                        label="Average Score"
                        value={overviewStats.avgScore.toFixed(1)}
                        color="bg-green-500 text-green-500"
                      />
                      <StatCard
                        icon={Calendar}
                        label="Total Practices"
                        value={overviewStats.totalPractices}
                        color="bg-purple-500 text-purple-500"
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Improvement Rate"
                        value={`${overviewStats.improvementRate.toFixed(0)}%`}
                        color="bg-yellow-500 text-yellow-500"
                      />
                    </div>

                    {/* Coaching Insights */}
                    {coachingInsights && (
                      <CoachingInsightsWidget insights={coachingInsights} />
                    )}

                    {/* Quick Team Overview */}
                    {teamAnalytics && teamAnalytics.length > 0 && (
                      <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Team Performance Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teamAnalytics.slice(0, 3).map((team) => (
                            <div key={team.teamId} className="p-4 bg-gray-700 rounded-lg">
                              <h4 className="font-medium text-gray-100 mb-2">{team.teamName}</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Avg Score:</span>
                                  <span className="text-gray-100">{team.averageScore.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Attendance:</span>
                                  <span className="text-gray-100">{Math.round(team.attendanceRate * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full"
                                    style={{ width: `${(team.averageScore / 4) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </>
                )}

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                  <div>
                    {teamAnalytics && teamAnalytics.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teamAnalytics.map((team) => (
                          <TeamAnalyticsCard
                            key={team.teamId}
                            analytics={team}
                            onViewDetails={(teamId) => console.log('View team details:', teamId)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">No Team Data</h3>
                        <p className="text-gray-400">
                          Team analytics will appear here once you have practice sessions and evaluations.
                        </p>
                      </Card>
                    )}
                  </div>
                )}

                {/* Performers Tab */}
                {activeTab === 'performers' && (
                  <div>
                    {performerProgress && performerProgress.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {performerProgress.map((progress) => (
                          <PerformerProgressCard
                            key={progress.performerId}
                            progress={progress}
                            onViewDetails={(performerId) => console.log('View performer details:', performerId)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">No Performer Data</h3>
                        <p className="text-gray-400">
                          Individual performer progress will appear here after conducting evaluations.
                        </p>
                      </Card>
                    )}
                  </div>
                )}

                {/* Exercises Tab */}
                {activeTab === 'exercises' && (
                  <div>
                    {exerciseEffectiveness && exerciseEffectiveness.length > 0 ? (
                      <ExerciseEffectivenessChart
                        exercises={exerciseEffectiveness}
                        onExerciseClick={(exerciseId) => console.log('View exercise details:', exerciseId)}
                      />
                    ) : (
                      <Card className="p-8 text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">No Exercise Data</h3>
                        <p className="text-gray-400">
                          Exercise effectiveness metrics will appear here after using exercises in practice sessions.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};