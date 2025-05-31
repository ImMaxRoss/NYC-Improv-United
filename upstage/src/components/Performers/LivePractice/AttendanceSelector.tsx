import React from 'react';
import { Users, Check } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Performer } from '../../../types';

interface AttendanceSelectorProps {
  performers: Performer[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
}

export const AttendanceSelector: React.FC<AttendanceSelectorProps> = ({
  performers,
  selectedIds,
  onSelectionChange
}) => {
  const togglePerformer = (performerId: number) => {
    const isSelected = selectedIds.includes(performerId);
    if (isSelected) {
      onSelectionChange(selectedIds.filter(id => id !== performerId));
    } else {
      onSelectionChange([...selectedIds, performerId]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-100">Take Attendance</h3>
        <span className="text-gray-400 text-sm">({selectedIds.length} present)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {performers.map((performer) => {
          const isSelected = selectedIds.includes(performer.id);
          return (
            <button
              key={performer.id}
              onClick={() => togglePerformer(performer.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-100'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {performer.firstName} {performer.lastName}
                </span>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};