import React, { useState } from 'react';
import { X, Save, BookmarkPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Lesson } from '../../types';

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonId: number) => void;
  lesson: Lesson | null;
  loading?: boolean;
}

export const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lesson,
  loading = false
}) => {
  const [templateName, setTemplateName] = useState('');

  // Set default template name when lesson changes
  React.useEffect(() => {
    if (lesson && isOpen) {
      // Generate a template name based on lesson
      const baseName = lesson.name || `${lesson.teamName || 'Practice'} Template`;
      setTemplateName(baseName);
    }
  }, [lesson, isOpen]);

  const handleSave = () => {
    if (!lesson) return;
    onSave(lesson.id);
    setTemplateName('');
  };

  const handleClose = () => {
    setTemplateName('');
    onClose();
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookmarkPlus className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-100">Save as Template</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lesson Preview */}
          <Card className="p-4 bg-gray-700">
            <h4 className="font-medium text-gray-100 mb-2">Current Lesson</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-gray-100">{lesson.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-gray-100">{lesson.formattedDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exercises:</span>
                <span className="text-gray-100">{lesson.exerciseCount}</span>
              </div>
              {lesson.teamName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Team:</span>
                  <span className="text-gray-100">{lesson.teamName}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Template Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
            <p className="text-gray-400 text-xs mt-1">
              This template will save your lesson structure for reuse
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              <strong>What gets saved:</strong> Exercise sequence, durations, and notes. 
              Team assignment and schedule will not be included.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!templateName.trim() || loading}
              loading={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};