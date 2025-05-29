// src/components/EvaluationForm.tsx
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { LessonExercise, Performer, EvaluationResponse, EvaluationCriterion } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface EvaluationFormProps {
  exercise: LessonExercise;
  teamId: number;
  performers: Performer[];
  onSubmit: (evaluationData: Omit<EvaluationResponse, 'id'>) => void;
  onCancel: () => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  exercise, 
  teamId,
  performers, 
  onSubmit, 
  onCancel 
}) => {
  const [selectedPerformers, setSelectedPerformers] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [activeRubric, setActiveRubric] = useState<'base-reality' | 'game'>('base-reality');
  
  // Base Reality criteria
  const baseRealityCriteria: EvaluationCriterion[] = [
    { id: 'yesAnd', name: 'Yes And', description: 'Accept & add relevant, present-tense info', maxScore: 4 },
    { id: 'agreement', name: 'Agreement', description: 'Clear, responsive agreement (verbal & physical)', maxScore: 4 },
    { id: 'whoWhatWhere', name: 'Who/What/Where', description: 'Quickly/specifically establishes W/W/W', maxScore: 4 },
    { id: 'physicality', name: 'Object Work/Show Don\'t Tell', description: 'Believable & consistent environment', maxScore: 4 },
    { id: 'listening', name: 'Listening', description: 'Incorporates all partner offers', maxScore: 4 },
    { id: 'commitment', name: 'Commitment', description: 'Full, grounded, honest playing', maxScore: 4 },
    { id: 'avoidanceOfDenial', name: 'Avoidance of Denial', description: 'Never undermines or rejects offers', maxScore: 4 },
    { id: 'efficiency', name: 'Efficiency/Clarity', description: 'Defines reality quickly, no filler', maxScore: 4 },
  ];

  // Game of Scene criteria
  const gameCriteria: EvaluationCriterion[] = [
    { id: 'identification', name: 'Game Identification', description: 'Spot & frame first unusual thing clearly', maxScore: 4 },
    { id: 'building', name: 'Building Pattern', description: 'Solid, focused pattern established', maxScore: 4 },
    { id: 'heightening', name: 'Heightening', description: 'Logical escalation within pattern', maxScore: 4 },
    { id: 'exploration', name: 'Exploration', description: 'Believable "why?", smart logic', maxScore: 4 },
    { id: 'topOfIntelligence', name: 'Top of Intelligence', description: 'Realistic, emotionally honest reactions', maxScore: 4 },
    { id: 'teamwork', name: 'Agreement/Teamwork', description: 'Players support, don\'t sandbag/steamroll', maxScore: 4 },
    { id: 'gameListening', name: 'Listening During Game', description: 'Moves connect, no pattern jumping', maxScore: 4 },
    { id: 'clarity', name: 'Clarity of Game', description: 'One clear game, no crazy town', maxScore: 4 },
    { id: 'believability', name: 'Commitment/Believability', description: 'No winking/commentary, full buy-in', maxScore: 4 },
  ];

  const currentCriteria = activeRubric === 'base-reality' ? baseRealityCriteria : gameCriteria;

  const handleScoreChange = (criterion: string, value: string) => {
    setScores({ ...scores, [criterion]: parseInt(value) });
  };

  const handleSubmit = () => {
    const evaluationData: Omit<EvaluationResponse, 'id'> = {
      teamId: teamId,
      performanceDate: new Date().toISOString(),
      performerNames: selectedPerformers.join(', '),
      notes,
      ...scores
    };
    onSubmit(evaluationData);
  };

  const getScoreColor = (score?: number): string => {
    if (!score) return 'bg-gray-700';
    if (score === 4) return 'bg-green-600';
    if (score === 3) return 'bg-yellow-600';
    if (score === 2) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">Evaluate Scene</h2>
          <p className="text-gray-400 mt-1">{exercise.exerciseName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Rubric Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveRubric('base-reality')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeRubric === 'base-reality' 
              ? 'bg-yellow-500 text-gray-900' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Base Reality
        </button>
        <button
          onClick={() => setActiveRubric('game')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeRubric === 'game' 
              ? 'bg-yellow-500 text-gray-900' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Game of Scene
        </button>
      </div>

      {/* Performer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Performers in Scene
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {performers.map((performer) => (
            <label
              key={performer.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
                checked={selectedPerformers.includes(performer.firstName + ' ' + performer.lastName)}
                onChange={(e) => {
                  const name = performer.firstName + ' ' + performer.lastName;
                  if (e.target.checked) {
                    setSelectedPerformers([...selectedPerformers, name]);
                  } else {
                    setSelectedPerformers(selectedPerformers.filter(n => n !== name));
                  }
                }}
              />
              <span className="text-gray-300 text-sm">
                {performer.firstName} {performer.lastName}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Scoring Grid */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-bold text-gray-100">
          {activeRubric === 'base-reality' ? 'Base Reality Evaluation' : 'Game of Scene Evaluation'}
        </h3>
        {currentCriteria.map((criterion) => (
          <div key={criterion.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">{criterion.name}</h4>
                <p className="text-sm text-gray-400">{criterion.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-white font-bold ${getScoreColor(scores[criterion.id])}`}>
                {scores[criterion.id] || '—'}
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              {[1, 2, 3, 4].map((score) => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(criterion.id, score.toString())}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    scores[criterion.id] === score
                      ? 'bg-yellow-500 text-gray-900 font-bold scale-105'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes & Feedback
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          placeholder="Specific feedback, moments to highlight, areas for improvement..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={selectedPerformers.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Evaluation
        </Button>
      </div>
    </Card>
  );
};