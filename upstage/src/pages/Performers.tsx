import React, { useState } from 'react';
import { Plus, Search, Download, Users, Calendar } from 'lucide-react';
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
  const [creating, setCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: performers, loading, error } = useApi(() => performersAPI.getMyPerformers(), [refreshTrigger]);

  const filteredPerformers = performers?.filter(performer => {
    const matchesSearch = 
      `${performer.firstName} ${performer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      performer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreatePerformer = async (performerData: PerformerCreateRequest) => {
    setCreating(true);
    try {
      await performersAPI.createPerformer(performerData);
      setShowCreateModal(false);
      refreshData();
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
        refreshData();
      } catch (error) {
        console.error('Failed to delete performer:', error);
        alert('Failed to delete performer. Please try again.');
      }
    }
  };

  // Calculate simple stats
  const totalPerformers = performers?.length || 0;
  const recentlyAdded = performers?.filter(p => {
    const addedDate = new Date(p.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return addedDate > thirtyDaysAgo;
  }).length || 0;

  const withNotes = performers?.filter(p => p.notes && p.notes.trim().length > 0).length || 0;
  const withEmail = performers?.filter(p => p.email && p.email.trim().length > 0).length || 0;

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

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search performers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{totalPerformers}</div>
            <div className="text-gray-400 text-sm">Total Performers</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{recentlyAdded}</div>
            <div className="text-gray-400 text-sm">Added This Month</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{withNotes}</div>
            <div className="text-gray-400 text-sm">With Notes</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{withEmail}</div>
            <div className="text-gray-400 text-sm">With Email</div>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-400">Failed to load performers: {error}</p>
            <Button variant="secondary" className="mt-4" onClick={refreshData}>
              Try Again
            </Button>
          </Card>
        ) : filteredPerformers.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              {searchTerm ? 'No performers found' : 'No performers yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Add your first performer to start building your contact list!'
              }
            </p>
            {!searchTerm && (
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