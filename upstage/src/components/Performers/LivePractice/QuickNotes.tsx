import React, { useState } from 'react';
import { FileText, Save, Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface QuickNotesProps {
  onSaveNote?: (note: string, type: 'exercise' | 'overall') => void;
}

export const QuickNotes: React.FC<QuickNotesProps> = ({ onSaveNote }) => {
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState<'exercise' | 'overall'>('exercise');
  const [savedNotes, setSavedNotes] = useState<Array<{
    id: number;
    text: string;
    type: 'exercise' | 'overall';
    timestamp: Date;
  }>>([]);

  const handleSaveNote = () => {
    if (note.trim()) {
      const newNote = {
        id: Date.now(),
        text: note.trim(),
        type: noteType,
        timestamp: new Date()
      };
      
      setSavedNotes([newNote, ...savedNotes]);
      onSaveNote && onSaveNote(note.trim(), noteType);
      setNote('');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="h-5 w-5 text-blue-500" />
        <span className="font-medium text-gray-100">Quick Notes</span>
      </div>

      {/* Note Type Toggle */}
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setNoteType('exercise')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            noteType === 'exercise'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Exercise Note
        </button>
        <button
          onClick={() => setNoteType('overall')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            noteType === 'overall'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          Overall Note
        </button>
      </div>

      {/* Note Input */}
      <div className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`Add ${noteType} note...`}
          className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
        />
        
        <Button
          onClick={handleSaveNote}
          disabled={!note.trim()}
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      </div>

      {/* Saved Notes */}
      {savedNotes.length > 0 && (
        <div className="mt-4 max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Notes</h4>
          <div className="space-y-2">
            {savedNotes.map((savedNote) => (
              <div
                key={savedNote.id}
                className="p-2 bg-gray-700 rounded text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    savedNote.type === 'exercise'
                      ? 'bg-blue-500 bg-opacity-20 text-blue-300'
                      : 'bg-purple-500 bg-opacity-20 text-purple-300'
                  }`}>
                    {savedNote.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {savedNote.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-gray-200">{savedNote.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};