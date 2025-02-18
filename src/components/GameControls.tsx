import type { Difficulty, GameControlsProperties, GridSize, GameMode } from '../types/game';
import { type ChangeEvent, useCallback } from 'react';
import { GridSizes } from '../constants/gameConstants';
import { formatTime } from '../utils/leaderboardUtils';
import { COLOR_MODE, PATTERN_TYPES } from '../constants/colorMode';
import { GAME_MODES } from '../constants/gameConfig';

/** Grid size options */
const gridSizeOptions: readonly GridSize[] = GridSizes.SIZES;

/** Difficulty options */
const difficultyOptions: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const;
const OFFSET = 1
/** Format difficulty text for display */
const formatDifficulty = (diff: Difficulty): string =>
  diff.charAt(0).toUpperCase() + diff.slice(OFFSET);

/** Type guard for Difficulty */
const isDifficulty = (value: string): value is Difficulty => 
  difficultyOptions.includes(value as Difficulty);

/** Handle difficulty change with type validation */
const handleDifficultyChange = (
  event: ChangeEvent<HTMLSelectElement>,
  onDifficultyChange: (difficulty: Difficulty) => void
): void => {
  const value = event.target.value;
  if (isDifficulty(value)) {
    onDifficultyChange(value);
  } else {
    console.error(`Invalid difficulty value: ${value}`);
  }
};

/**
 * Game controls component for managing game state and settings
 */
export default function GameControls({ 
  moves,
  mode,
  time,
  onNewGame,
  onSolve,
  onSizeChange,
  onDifficultyChange,
  onPatternTypeChange,
  currentSize,
  currentDifficulty,
  onBackToMain,
}: GameControlsProperties): JSX.Element {
  const onHandleSizeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(event.target.value);
    // Color mode only supports 5x5 grid
    if (mode === GAME_MODES.COLOR && size !== COLOR_MODE.GRID_SIZE) {
      console.warn('Color mode only supports 5x5 grid');
      return;
    } else if (gridSizeOptions.includes(size as GridSize)) {
      onSizeChange(size as GridSize);
    }
  }, [onSizeChange]);

  const onHandlePatternTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    if (onPatternTypeChange && type in PATTERN_TYPES) {
      onPatternTypeChange(type as typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]);
    }
  }, [onPatternTypeChange]);

  const onHandleDifficultySelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    if (onDifficultyChange) {
      handleDifficultyChange(event, onDifficultyChange);
    }
  }, [onDifficultyChange]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="flex space-x-4">
        <div className="text-xl">
          <span className="font-medium">Moves: </span>
          <span>{moves}</span>
        </div>
        <div className="text-xl">
          <span className="font-medium">Time: </span>
          <span>{formatTime(time)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onNewGame}
        >
          New Game
        </button>
        {onSolve && (
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={onSolve}
          >
            Solve
          </button>
        )}

        {/* Pattern Type selector for Color Mode */}
        {mode === GAME_MODES.COLOR && (
          <select
            className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
            defaultValue="random"
            onChange={onHandlePatternTypeChange}
            aria-label="Pattern Type"
          >
            <option value="random">Random Pattern</option>
            <option value="column_stack">Column Stack</option>
          </select>
        )}

        <button
          type="button"
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
          onClick={onBackToMain}
        >
          Back to Main
        </button>

        {/* Grid size selector - Only show for classic mode */}
        {mode === GAME_MODES.CLASSIC && <select
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={currentSize}
          onChange={onHandleSizeChange}
          aria-label="Grid Size"
        >
          {gridSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>}

        {/* Difficulty selector - Only show for classic mode */}
        {mode === GAME_MODES.CLASSIC && onDifficultyChange && currentDifficulty && <select
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={currentDifficulty}
          onChange={onHandleDifficultySelect}
          aria-label="Difficulty"
        >
          {difficultyOptions.map((diff) => (
            <option key={diff} value={diff}>
              {formatDifficulty(diff)}
            </option>
          ))}
        </select>}
      </div>
    </div>
  );
}