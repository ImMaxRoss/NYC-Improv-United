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
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any notes about this performer's strengths, areas to work on, etc."
              className="w-full h-20 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <strong>Tip:</strong> Use the notes field to track performer progress, strengths, and areas for improvement over time.
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
              Add Performer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};