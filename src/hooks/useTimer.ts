import { useState, useEffect, useCallback, useRef } from 'react';
import { GridSize } from '../types/game';
import { getTimeLimitForSize, saveBestTime } from '../utils/timerUtils';

interface UseTimerProps {
  gridSize: GridSize;
  isActive: boolean;
  isPaused: boolean;
  onTimeUp: () => void;
}

interface UseTimerResult {
  timeRemaining: number;
  totalTime: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = ({
  gridSize,
  isActive,
  isPaused,
  onTimeUp,
}: UseTimerProps): UseTimerResult => {
  const timeLimit = getTimeLimitForSize(gridSize);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const timerRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearTimer();
        onTimeUp();
      }
    }, 100); // Update every 100ms for smooth countdown
  }, [timeLimit, clearTimer, onTimeUp]);

  const stopTimer = useCallback(() => {
    clearTimer();
    if (timeRemaining > 0) {
      // Save time taken if stopping before time runs out (victory)
      const timeTaken = timeLimit - timeRemaining;
      saveBestTime(gridSize, timeTaken);
    }
  }, [clearTimer, timeRemaining, timeLimit, gridSize]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTimeRemaining(timeLimit);
    startTimeRef.current = undefined;
  }, [clearTimer, timeLimit]);

  useEffect(() => {
    if (isActive && !isPaused) {
      startTimer();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isActive, isPaused, startTimer, clearTimer]);

  // Reset timer when grid size changes
  useEffect(() => {
    resetTimer();
  }, [gridSize, resetTimer]);

  return {
    timeRemaining,
    totalTime: timeLimit,
    startTimer,
    stopTimer,
    resetTimer,
  };
};