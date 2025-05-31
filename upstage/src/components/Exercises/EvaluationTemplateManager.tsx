// src/components/Exercises/EvaluationTemplateManager.tsx
import React, { useState } from 'react';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EvaluationCriterion } from '../../types';

interface EvaluationTemplateManagerProps {
  exerciseId?: number;
  templateName?: string;
  criteria: EvaluationCriterion[];
  onUpdate?: (templateName: string, criteria: EvaluationCriterion[]) => void;
  readOnly?: boolean;
}

export const EvaluationTemplateManager: React.FC<EvaluationTemplateManagerProps> = ({
  exerciseId,
  templateName = 'Default Evaluation Template',
  criteria,
  onUpdate,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(templateName);
  const [editedCriteria, setEditedCriteria] = useState(criteria);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedName, editedCriteria);
    }
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-100">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100"
              />
            ) : (
              templateName
            )}
          </h3>
        </div>
        
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save' : <Edit className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {criteria.map((criterion, index) => (
          <div key={criterion.id} className="p-3 bg-gray-700 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{criterion.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Max: {criterion.maxScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {criteria.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No evaluation criteria defined</p>
        </div>
      )}
    </Card>
  );
};