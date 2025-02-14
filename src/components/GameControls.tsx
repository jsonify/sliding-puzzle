import React from 'react';
import { Difficulty, GameControlsProps, GridSize } from '../types/game';

const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7, 8, 9];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function GameControls({
  moves,
  time,
  onNewGame,
  onSizeChange,
  onDifficultyChange,
  currentSize,
  currentDifficulty,
}: GameControlsProps) {
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-4">
      {/* Stats Display */}
      <div className="flex justify-between items-center">
        <div className="text-gray-700 dark:text-gray-300">
          Moves: <span className="font-bold">{moves}</span>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          Time: <span className="font-bold">{formatTime(time)}</span>
        </div>
      </div>

      {/* Grid Size Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {GRID_SIZES.map(size => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`
              px-3 py-2 rounded
              transition-colors duration-200
              ${
                currentSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {size}x{size}
          </button>
        ))}
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2">
        {DIFFICULTIES.map(difficulty => (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            className={`
              px-4 py-2 rounded capitalize
              transition-colors duration-200
              ${
                currentDifficulty === difficulty
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {/* New Game Button */}
      <div className="flex justify-center">
        <button
          onClick={onNewGame}
          className="
            px-6 py-3 rounded
            bg-green-500 hover:bg-green-600
            text-white font-bold
            transition-colors duration-200
            shadow-md hover:shadow-lg
          "
        >
          New Game
        </button>
      </div>
    </div>
  );
}