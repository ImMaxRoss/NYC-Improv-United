import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { TeamCreateRequest } from '../../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: TeamCreateRequest) => void;
  loading?: boolean;
  initialData?: TeamCreateRequest;
  title?: string;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  initialData,
  title = 'Create New Team'
}) => {
  const [formData, setFormData] = useState<TeamCreateRequest>({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set initial data when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
  }, [initialData, isOpen]);

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
      if (!initialData) {
        // Only reset form for new teams, not edits
        setFormData({ name: '', description: '' });
        setErrors({});
      }
    }
  };

  const handleChange = (field: keyof TeamCreateRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-100">{title}</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
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
              <strong>Tip:</strong> {isEditing 
                ? 'Changes will be saved immediately after clicking "Save Changes"'
                : 'After creating your team, you can add performers from your contact list or create new ones.'
              }
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Create Team'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};