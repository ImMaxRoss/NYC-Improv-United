import React from 'react';
import { User, Mail, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Performer } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PerformerCardProps {
  performer: Performer;
  onEdit?: (performer: Performer) => void;
  onDelete?: (performerId: number) => void;
  onSelect?: (performer: Performer) => void;
  selected?: boolean;
  selectable?: boolean;
}

export const PerformerCard: React.FC<PerformerCardProps> = ({
  performer,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  selectable = false
}) => {
  const cardClass = `${selectable ? 'cursor-pointer' : ''} ${
    selected ? 'ring-2 ring-yellow-500 bg-yellow-500 bg-opacity-10' : ''
  }`;

  return (
    <Card 
      hoverable={selectable} 
      className={`p-4 ${cardClass}`}
      onClick={() => selectable && onSelect && onSelect(performer)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-300" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-100 truncate">
              {performer.firstName} {performer.lastName}
            </h3>
            
            {performer.email && (
              <div className="flex items-center space-x-1 mt-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-gray-400 text-xs truncate">{performer.email}</span>
              </div>
            )}
            
            <div className="mt-2">
              <span className="text-gray-400 text-xs">
                Added {new Date(performer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {!selectable && (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(performer)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(performer.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {performer.notes && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-sm line-clamp-2">{performer.notes}</p>
        </div>
      )}
    </Card>
  );
};