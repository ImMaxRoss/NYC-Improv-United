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
      <div className="bg-gray-800 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-gray-700">
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

        {/* Content - Scrollable */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          {/* Search and Add */}
          <div className="flex-shrink-0 mb-6">
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
              <Button onClick={() => setShowCreateModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="flex-shrink-0 bg-gray-700 rounded-lg p-4 mb-6">
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

          {/* Performers List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
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

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-6 border-t border-gray-700 bg-gray-800">
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