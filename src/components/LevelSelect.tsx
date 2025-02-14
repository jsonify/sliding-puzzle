import React from 'react';
import { Difficulty, GridSize, LevelSelectProps } from '../types/game';

const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7, 8, 9];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function LevelSelect({
  onLevelSelect,
  currentSize,
  currentDifficulty,
}: LevelSelectProps) {
  // Preview grid for size selection
  const renderPreviewGrid = (size: GridSize) => {
    return (
      <div
        className="grid gap-0.5 w-full aspect-square"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array.from({ length: size * size - 1 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-300 dark:bg-gray-600 rounded-sm"
            style={{ aspectRatio: '1 / 1' }}
          />
        ))}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-sm" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Sliding Puzzle
      </h1>

      {/* Grid Size Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select Grid Size
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {GRID_SIZES.map(size => (
            <button
              key={size}
              onClick={() => onLevelSelect(size, currentDifficulty)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  currentSize === size
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="text-center mb-2 font-medium">
                {size}x{size}
              </div>
              {renderPreviewGrid(size)}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select Difficulty
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {DIFFICULTIES.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => onLevelSelect(currentSize, difficulty)}
              className={`
                px-6 py-3 rounded-lg capitalize font-medium
                transition-all duration-200
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
      </div>

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          onClick={() => onLevelSelect(currentSize, currentDifficulty)}
          className="
            px-8 py-4 rounded-lg
            bg-green-500 hover:bg-green-600
            text-white font-bold text-lg
            transition-colors duration-200
            shadow-lg hover:shadow-xl
          "
        >
          Start Game
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8">
        <p>Click or use arrow keys to move tiles</p>
        <p>Arrange the numbers in order with the empty space in the bottom right</p>
      </div>
    </div>
  );
}