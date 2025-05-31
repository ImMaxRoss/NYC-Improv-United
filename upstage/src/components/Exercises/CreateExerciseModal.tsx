import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, FileText, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExerciseCreateRequest, FocusArea, EvaluationCriterion, EvaluationCriterionRequest } from '../../types';
import { evaluationsAPI } from '../../api/modules/evaluations';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseCreateRequest) => void;
  focusAreas: FocusArea[];
  loading?: boolean;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  focusAreas,
  loading = false
}) => {
  const [formData, setFormData] = useState<ExerciseCreateRequest>({
    name: '',
    description: '',
    minimumDurationMinutes: 10,
    focusAreaIds: [],
    public: false,
    difficulty: 'Easy',
    groupSize: 'Any',
    materials: [],
    instructions: '',
    variations: [],
    tips: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMaterial, setNewMaterial] = useState('');
  const [newVariation, setNewVariation] = useState('');
  const [newTip, setNewTip] = useState('');
  
  // New states for evaluation template
  const [includeEvaluation, setIncludeEvaluation] = useState(false);
  const [evaluationTemplateName, setEvaluationTemplateName] = useState('');
  const [useDefaultCriteria, setUseDefaultCriteria] = useState(true);
  const [customCriteria, setCustomCriteria] = useState<EvaluationCriterionRequest[]>([]);
  const [defaultCriteria, setDefaultCriteria] = useState<EvaluationCriterion[]>([]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.minimumDurationMinutes < 1) {
      newErrors.minimumDurationMinutes = 'Duration must be at least 1 minute';
    }
    
    if (formData.focusAreaIds.length === 0) {
      newErrors.focusAreaIds = 'Please select at least one focus area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load default criteria when component mounts
  useEffect(() => {
    if (isOpen && includeEvaluation) {
      loadDefaultCriteria();
    }
  }, [isOpen, includeEvaluation]);

  const loadDefaultCriteria = async () => {
    try {
      const criteria = await evaluationsAPI.getDefaultCriteria();
      setDefaultCriteria(criteria);
    } catch (error) {
      console.error('Failed to load default criteria:', error);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const exerciseData: ExerciseCreateRequest = {
        ...formData,
        ...(includeEvaluation && {
          evaluationTemplateName: evaluationTemplateName || `${formData.name} Evaluation`,
          evaluationCriteria: useDefaultCriteria 
            ? defaultCriteria.map(c => ({
                name: c.name,
                description: c.description,
                maxScore: c.maxScore
              }))
            : customCriteria
        })
      };
      
      onSave(exerciseData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minimumDurationMinutes: 10,
      focusAreaIds: [],
      public: false,
      difficulty: 'Easy',
      groupSize: 'Any',
      materials: [],
      instructions: '',
      variations: [],
      tips: []
    });
    setErrors({});
    setNewMaterial('');
    setNewVariation('');
    setNewTip('');
    setIncludeEvaluation(false);
    setEvaluationTemplateName('');
    setUseDefaultCriteria(true);
    setCustomCriteria([]);
  };

  const handleChange = (field: keyof ExerciseCreateRequest, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const addListItem = (field: 'materials' | 'variations' | 'tips', value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      handleChange(field, [...(formData[field] as string[]), value.trim()]);
      setValue('');
    }
  };

  const removeListItem = (field: 'materials' | 'variations' | 'tips', index: number) => {
    const currentList = formData[field] as string[];
    handleChange(field, currentList.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">Create New Exercise</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Emotional Orchestra, Word Association"
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe what this exercise is and how it works..."
                  className={`w-full h-24 px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formData.minimumDurationMinutes}
                    onChange={(e) => handleChange('minimumDurationMinutes', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500 ${
                      errors.minimumDurationMinutes ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.minimumDurationMinutes && <p className="text-red-400 text-sm mt-1">{errors.minimumDurationMinutes}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Group Size
                  </label>
                  <select
                    value={formData.groupSize}
                    onChange={(e) => handleChange('groupSize', e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Any">Any Size</option>
                    <option value="Individual">Individual</option>
                    <option value="Pairs">Pairs</option>
                    <option value="Small Group">Small Group (3-6)</option>
                    <option value="Large Group">Large Group (7+)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Focus Areas */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Focus Areas *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {focusAreas.map((area) => (
                <label
                  key={area.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.focusAreaIds.includes(area.id)
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.focusAreaIds.includes(area.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange('focusAreaIds', [...formData.focusAreaIds, area.id]);
                      } else {
                        handleChange('focusAreaIds', formData.focusAreaIds.filter(id => id !== area.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: area.colorCode }}
                  />
                  <span className="text-gray-100 text-sm">{area.name}</span>
                </label>
              ))}
            </div>
            {errors.focusAreaIds && <p className="text-red-400 text-sm mt-2">{errors.focusAreaIds}</p>}
          </Card>

          {/* Materials */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Materials Needed (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="e.g., Chairs, Props, Music"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('materials', newMaterial, setNewMaterial)}
                  disabled={!newMaterial.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.materials && formData.materials.length > 0 && (
                <div className="space-y-2">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-gray-100">{material}</span>
                      <button
                        onClick={() => removeListItem('materials', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Detailed Instructions (Optional)</h3>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="Step-by-step instructions for running this exercise..."
              className="w-full h-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </Card>

          {/* Variations */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Variations (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newVariation}
                  onChange={(e) => setNewVariation(e.target.value)}
                  placeholder="Describe a variation of this exercise..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('variations', newVariation, setNewVariation)}
                  disabled={!newVariation.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.variations && formData.variations.length > 0 && (
                <div className="space-y-2">
                  {formData.variations.map((variation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-700 rounded">
                      <span className="flex-1 text-gray-100">{variation}</span>
                      <button
                        onClick={() => removeListItem('variations', index)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Coaching Tips (Optional)</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="What should coaches watch for or emphasize?"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Button
                  size="sm"
                  onClick={() => addListItem('tips', newTip, setNewTip)}
                  disabled={!newTip.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tips && formData.tips.length > 0 && (
                <div className="space-y-2">
                  {formData.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded">
                      <span className="flex-1 text-yellow-200">{tip}</span>
                      <button
                        onClick={() => removeListItem('tips', index)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-100 mb-4">Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.public}
                  onChange={(e) => handleChange('public', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <div>
                  <div className="text-gray-100 font-medium">Make this exercise public</div>
                  <div className="text-gray-400 text-sm">
                    Other coaches will be able to discover and use this exercise
                  </div>
                </div>
              </label>
            </div>
          </Card>

          {/* Evaluation Template Section */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-100">Evaluation Template</h3>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={includeEvaluation}
                onChange={(e) => setIncludeEvaluation(e.target.checked)}
                className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
              />
              <div>
                <div className="text-gray-100 font-medium">Include default evaluation template</div>
                <div className="text-gray-400 text-sm">
                  Attach a standardized evaluation form to this exercise
                </div>
              </div>
            </label>

            {includeEvaluation && (
              <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Template Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={evaluationTemplateName}
                    onChange={(e) => setEvaluationTemplateName(e.target.value)}
                    placeholder={`${formData.name || 'Exercise'} Evaluation`}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Evaluation Criteria
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={useDefaultCriteria}
                        onChange={() => setUseDefaultCriteria(true)}
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
                      />
                      <span className="text-gray-100">Use standard improv criteria (recommended)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!useDefaultCriteria}
                        onChange={() => setUseDefaultCriteria(false)}
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600"
                      />
                      <span className="text-gray-100">Create custom criteria</span>
                    </label>
                  </div>
                </div>

                {useDefaultCriteria && defaultCriteria.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Standard Criteria:</h4>
                    <div className="space-y-2">
                      {defaultCriteria.map((criterion, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-100">{criterion.name}</span>
                          <span className="text-gray-400">{criterion.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!useDefaultCriteria && (
                  <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
                    <p className="text-blue-200 text-sm">
                      <strong>Note:</strong> Custom criteria creation will be available in a future update. 
                      For now, the standard criteria will be used.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              Create Exercise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};