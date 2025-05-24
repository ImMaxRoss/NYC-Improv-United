## src/components/UpcomingLesson.tsx - Enhanced version with practice starter
```tsx
import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { Lesson } from '../types';
import { Button } from './ui/Button';

interface UpcomingLessonProps {
  lesson: Lesson;
  onStartPractice?: (lessonId: number) => void;
}

export const UpcomingLesson: React.FC<UpcomingLessonProps> = ({ 
  lesson, 
  onStartPractice 
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
    }
  };

  const isToday = () => {
    const lessonDate = new Date(lesson.scheduledDate);
    const today = new Date();
    return lessonDate.toDateString() === today.toDateString();
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          isToday() 
            ? 'bg-green-500 bg-opacity-20' 
            : 'bg-yellow-500 bg-opacity-20'
        }`}>
          <Calendar className={`h-6 w-6 ${
            isToday() ? 'text-green-500' : 'text-yellow-500'
          }`} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-gray-100 font-medium">
          {lesson.name || `${lesson.teamName} Practice`}
          {isToday() && (
            <span className="ml-2 px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full">
              Today
            </span>
          )}
        </h4>
        <p className="text-gray-400 text-sm">
          {lesson.teamName} • {formatDate(lesson.scheduledDate)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">{lesson.formattedDuration}</p>
        <p className="text-gray-500 text-xs">{lesson.exerciseCount} exercises</p>
        {isToday() && onStartPractice && (
          <Button
            size="sm"
            onClick={() => onStartPractice(lesson.id)}
            className="mt-2"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>
        )}
      </div>
    </div>
  );
};
```