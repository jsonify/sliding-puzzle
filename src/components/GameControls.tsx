import type { Difficulty, GameControlsProps, GridSize } from '../types/game';
import { GameConstants, GridSizes } from '../constants/gameConstants';
import { formatTime } from '../utils/leaderboardUtils';

/** Grid size options */
const gridSizeOptions: readonly GridSize[] = GridSizes.SIZES;

/** Difficulty options */
const difficultyOptions: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const;

/** Format difficulty text for display */
const formatDifficulty = (diff: Difficulty): string => 
  diff.charAt(0).toUpperCase() + diff.slice(1);

/**
 * Game controls component for managing game state and settings
 */
export default function GameControls({ 
  moves,
  time,
  onNewGame,
  onSizeChange,
  onDifficultyChange,
  currentSize,
  currentDifficulty,
}: GameControlsProps): JSX.Element {
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

        <select
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={currentSize}
          onChange={(e) => onSizeChange(Number(e.target.value) as GridSize)}
          aria-label="Grid Size"
        >
          {gridSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>

        <select
          className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={currentDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          aria-label="Difficulty"
        >
          {difficultyOptions.map((diff) => (
            <option key={diff} value={diff}>
              {formatDifficulty(diff)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}