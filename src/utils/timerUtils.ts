import { GridSize } from '../types/game';
import { calculateTimeLimit } from '../constants/gameConfig';

/**
 * Format seconds into MM:SS display format
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "02:45")
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculate remaining time based on start time and time limit
 * @param startTime - Timestamp when the game started
 * @param timeLimit - Total allowed time in seconds
 * @returns Remaining time in seconds
 */
export const calculateRemainingTime = (startTime: number, timeLimit: number): number => {
  const elapsed = (Date.now() - startTime) / 1000;
  return Math.max(0, timeLimit - elapsed);
};

/**
 * Get time limit for current grid size
 * @param size - Current grid size
 * @returns Time limit in seconds
 */
export const getTimeLimitForSize = (size: GridSize): number => {
  return calculateTimeLimit(size);
};

/**
 * Check if time is running low (within warning period)
 * @param remainingTime - Current remaining time in seconds
 * @param warningTime - Time threshold for warning in seconds
 * @returns Boolean indicating if time is running low
 */
export const isTimeRunningLow = (remainingTime: number, warningTime: number): boolean => {
  return remainingTime > 0 && remainingTime <= warningTime;
};

interface BestTimes {
  [key: number]: number;
}

const STORAGE_KEY = 'slidingPuzzle_bestTimes';

/**
 * Save best completion time for a grid size
 * @param size - Grid size
 * @param time - Completion time in seconds
 */
export const saveBestTime = (size: GridSize, time: number): void => {
  try {
    const existingTimes = getBestTimes();
    const currentBest = existingTimes[size];
    
    if (!currentBest || time < currentBest) {
      existingTimes[size] = time;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTimes));
    }
  } catch (error) {
    console.error('Failed to save best time:', error);
  }
};

/**
 * Get best completion times for all grid sizes
 * @returns Object mapping grid sizes to best times
 */
export const getBestTimes = (): BestTimes => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to retrieve best times:', error);
    return {};
  }
};

/**
 * Get best completion time for a specific grid size
 * @param size - Grid size to get best time for
 * @returns Best completion time in seconds or null if none exists
 */
export const getBestTimeForSize = (size: GridSize): number | null => {
  const bestTimes = getBestTimes();
  return bestTimes[size] || null;
};

/**
 * Check if current time beats the best time for the grid size
 * @param size - Grid size
 * @param time - Current completion time
 * @returns Boolean indicating if this is a new best time
 */
export const isNewBestTime = (size: GridSize, time: number): boolean => {
  const currentBest = getBestTimeForSize(size);
  return currentBest === null || time < currentBest;
};