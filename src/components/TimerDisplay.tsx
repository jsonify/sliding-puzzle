// src/components/TimerDisplay.tsx

import React, { useState, useEffect } from 'react';
import { GridSize } from '../types/game';
import { isTimeRunningLow, formatTime } from '../utils/timerUtils';
import { TIMED_MODE_CONFIG } from '../constants/gameConfig';

interface TimerDisplayProps {
  timeRemaining: number;
  gridSize: GridSize;
  isPaused?: boolean;
  className?: string;
  onTimeUp?: () => void;
}

export default function TimerDisplay({
  timeRemaining,
  gridSize,
  isPaused = false,
  className = '',
  onTimeUp
}: TimerDisplayProps): JSX.Element {
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    // Handle time expiration
    if (timeRemaining <= 0 && onTimeUp) {
      onTimeUp();
    }
    setIsWarning(isTimeRunningLow(timeRemaining, TIMED_MODE_CONFIG.warningTime));
  }, [timeRemaining, onTimeUp]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {isWarning && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-red-500 animate-pulse" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )}
        <div 
          className={`text-4xl font-bold font-mono tracking-wider ${
            isWarning 
              ? 'text-red-500 dark:text-red-400 animate-pulse' 
              : isPaused 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-white dark:text-white'
          }`}
        >
          {formatTime(Math.max(0, timeRemaining))}
        </div>
      </div>
    </div>
  );
}