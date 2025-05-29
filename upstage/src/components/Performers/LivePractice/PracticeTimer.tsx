import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface PracticeTimerProps {
  plannedDuration: number; // in minutes
  onTimeUp?: () => void;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const PracticeTimer: React.FC<PracticeTimerProps> = ({
  plannedDuration,
  onTimeUp,
  isRunning,
  onToggle,
  onReset
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const plannedSeconds = plannedDuration * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (newTime >= plannedSeconds && onTimeUp) {
            onTimeUp();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, plannedSeconds, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min((timeElapsed / plannedSeconds) * 100, 100);
  const isOvertime = timeElapsed > plannedSeconds;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          <span className="text-gray-300 font-medium">Exercise Timer</span>
        </div>
        <div className="text-gray-400 text-sm">
          Target: {formatTime(plannedSeconds)}
        </div>
      </div>

      {/* Large Time Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold ${isOvertime ? 'text-red-400' : 'text-gray-100'}`}>
          {formatTime(timeElapsed)}
        </div>
        {isOvertime && (
          <div className="text-red-400 text-sm mt-1 animate-pulse">
            +{formatTime(timeElapsed - plannedSeconds)} overtime
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              isOvertime ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0:00</span>
          <span>{formatTime(plannedSeconds)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        <Button
          onClick={onToggle}
          variant={isRunning ? 'secondary' : 'primary'}
          size="lg"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button onClick={onReset} variant="ghost" size="lg">
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
};