import React, { useEffect, useState } from 'react';
import { GridSize } from '../types/game';
import { TIMED_MODE_CONFIG } from '../constants/gameConfig';
import { formatTime, getBestTimeForSize, isTimeRunningLow } from '../utils/timerUtils';

interface TimerDisplayProps {
  timeRemaining: number;
  gridSize: GridSize;
  isPaused?: boolean;
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  gridSize,
  isPaused = false,
  className = '',
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const bestTime = getBestTimeForSize(gridSize);

  useEffect(() => {
    setIsWarning(isTimeRunningLow(timeRemaining, TIMED_MODE_CONFIG.warningTime));
  }, [timeRemaining]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {isWarning && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          {formatTime(timeRemaining)}
        </div>
      </div>
      {bestTime && (
        <div className="text-xs text-gray-300 dark:text-gray-400">
          Best: {formatTime(bestTime)}
        </div>
      )}
    </div>
  );
};

export default React.memo(TimerDisplay);