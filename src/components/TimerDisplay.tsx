import React, { useEffect, useState } from 'react';
import { GridSize } from '../types/game';
import { TIMED_MODE_CONFIG } from '../constants/gameConfig';
import { formatTime, getBestTimeForSize, isTimeRunningLow } from '../utils/timerUtils';

interface TimerDisplayProps {
  timeRemaining: number;
  gridSize: GridSize;
  isPaused?: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  gridSize,
  isPaused = false,
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const bestTime = getBestTimeForSize(gridSize);

  useEffect(() => {
    setIsWarning(isTimeRunningLow(timeRemaining, TIMED_MODE_CONFIG.warningTime));
  }, [timeRemaining]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`text-4xl font-bold font-mono ${
          isWarning
            ? 'text-red-600 animate-pulse'
            : isPaused
            ? 'text-gray-500'
            : 'text-blue-600'
        }`}
      >
        {formatTime(timeRemaining)}
      </div>
      {bestTime && (
        <div className="text-sm text-gray-600">
          Best: {formatTime(bestTime)}
        </div>
      )}
    </div>
  );
};

export default React.memo(TimerDisplay);