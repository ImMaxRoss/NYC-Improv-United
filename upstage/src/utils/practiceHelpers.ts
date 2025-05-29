export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getScoreColor = (score: number): string => {
  switch (score) {
    case 4: return 'bg-green-500 text-white';
    case 3: return 'bg-yellow-500 text-gray-900';
    case 2: return 'bg-orange-500 text-white';
    case 1: return 'bg-red-500 text-white';
    default: return 'bg-gray-600 text-gray-300';
  }
};

export const getScoreLabel = (score: number): string => {
  switch (score) {
    case 4: return 'Excellent';
    case 3: return 'Good';
    case 2: return 'Needs Improvement';
    case 1: return 'Unsatisfactory';
    default: return 'Not Scored';
  }
};

export const calculateSessionProgress = (
  currentExercise: number,
  totalExercises: number
): number => {
  if (totalExercises === 0) return 0;
  return Math.round((currentExercise / totalExercises) * 100);
};

export const generatePracticeId = (): string => {
  return `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};