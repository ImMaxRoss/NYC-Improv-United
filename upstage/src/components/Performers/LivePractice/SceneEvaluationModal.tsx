import React, { useState } from 'react';
import { X, Save, Users, FileText, Target } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { 
  SceneEvaluation, 
  Performer, 
  EvaluationCriterion,
  BASE_REALITY_CRITERIA,
  GAME_OF_SCENE_CRITERIA
} from '../../../types';

interface SceneEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evaluation: Omit<SceneEvaluation, 'id'>) => void;
  performers: Performer[];
  lessonExerciseId: number;
  practiceSessionId?: number;
}

export const SceneEvaluationModal: React.FC<SceneEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  performers,
  lessonExerciseId,
  practiceSessionId
}) => {
  const [rubricType, setRubricType] = useState<'base-reality' | 'game-of-scene'>('base-reality');
  const [selectedPerformers, setSelectedPerformers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const criteria = rubricType === 'base-reality' ? BASE_REALITY_CRITERIA : GAME_OF_SCENE_CRITERIA;

  const handleSave = () => {
    const evaluation: Omit<SceneEvaluation, 'id'> = {
      lessonExerciseId,
      practiceSessionId,
      performerIds: selectedPerformers,
      scores,
      notes,
      rubricType
    };
    onSave(evaluation);
    onClose();
    // Reset form
    setSelectedPerformers([]);
    setScores({});
    setNotes('');
  };

  const getScoreColor = (score: number): string => {
    switch (score) {
      case 4: return 'bg-green-500 text-white';
      case 3: return 'bg-yellow-500 text-gray-900';
      case 2: return 'bg-orange-500 text-white';
      case 1: return 'bg-red-500 text-white';
      default: return 'bg-gray-600 text-gray-300 hover:bg-gray-500';
    }
  };

  const getScoreLabel = (score: number): string => {
    switch (score) {
      case 4: return 'Excellent';
      case 3: return 'Good';
      case 2: return 'Needs Improvement';
      case 1: return 'Unsatisfactory';
      default: return 'Not Scored';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-100">Scene Evaluation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rubric Type Selection */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Evaluation Type</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setRubricType('base-reality')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  rubricType === 'base-reality'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Base Reality (8 criteria)
              </button>
              <button
                onClick={() => setRubricType('game-of-scene')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  rubricType === 'game-of-scene'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Game of Scene (9 criteria)
              </button>
            </div>
          </Card>

          {/* Performer Selection */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Who was in this scene?</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {performers.map((performer) => {
                const isSelected = selectedPerformers.includes(performer.id);
                return (
                  <button
                    key={performer.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPerformers(selectedPerformers.filter(id => id !== performer.id));
                      } else {
                        setSelectedPerformers([...selectedPerformers, performer.id]);
                      }
                    }}
                    className={`p-2 rounded-lg border transition-all text-sm ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-20 text-yellow-100'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {performer.firstName} {performer.lastName}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Scoring Grid */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Score Each Criterion (1-4)</h3>
            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div>
                    <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                    <p className="text-sm text-gray-400">{criterion.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        onClick={() => setScores({ ...scores, [criterion.id]: score })}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          scores[criterion.id] === score
                            ? getScoreColor(score)
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                    <span className="flex items-center px-3 py-2 text-sm text-gray-400">
                      {scores[criterion.id] ? getScoreLabel(scores[criterion.id]) : 'Not scored'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-100">Coaching Notes</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific feedback, strengths, areas for improvement..."
              className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </Card>
        </div>

        <div className="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedPerformers.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save Evaluation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
