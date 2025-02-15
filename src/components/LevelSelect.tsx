import React, { useCallback, useMemo } from 'react';
import { Difficulty, GridSize, LevelSelectProps } from '../types/game';

const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7, 8, 9];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

// Number of empty tiles in the puzzle grid
const EMPTY_TILES_COUNT = 1;

// Utility function to generate unique cell IDs
const generateCellId = (size: GridSize, index: number): string => 
  `cell-${size}-${index}`;

// Define button style variants with explicit return types
const getButtonStyles = (isSelected: boolean): string => {
  const baseStyles = 'transition-all duration-200';
  return isSelected
    ? `${baseStyles} ring-2 ring-blue-500 bg-blue-50 dark:bg-gray-700`
    : `${baseStyles} hover:bg-gray-50 dark:hover:bg-gray-700`;
};

const getDifficultyStyles = (isSelected: boolean): string => {
  const baseStyles = 'px-6 py-3 rounded-lg capitalize font-medium transition-all duration-200';
  return isSelected
    ? `${baseStyles} bg-blue-500 text-white`
    : `${baseStyles} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`;
};

export function LevelSelect({
  onLevelSelect,
  currentSize,
  currentDifficulty,
}: LevelSelectProps) {
  // Ensure valid current size and difficulty
  const validatedSize = GRID_SIZES.includes(currentSize) ? currentSize : GRID_SIZES[0];
  const validatedDifficulty = DIFFICULTIES.includes(currentDifficulty) ? currentDifficulty : DIFFICULTIES[0];

  // Memoize the onLevelSelect callback for each size
  const onHandleSizeSelect = useCallback(
    (size: GridSize) => () => onLevelSelect(size, validatedDifficulty),
    [validatedDifficulty, onLevelSelect]
  );

  // Memoize the onLevelSelect callback for each difficulty
  const onHandleDifficultySelect = useCallback(
    (difficulty: Difficulty) => () => onLevelSelect(validatedSize, difficulty),
    [validatedSize, onLevelSelect]
  );

  // Preview grid for size selection
  const renderPreviewGrid = useCallback((size: GridSize) => {
    // Calculate total grid cells excluding the empty tile
    // and memoize the array of filled tiles using undefined
    const cells = useMemo(
      () => Array.from<undefined, undefined>(
        { length: size * size - EMPTY_TILES_COUNT },
        () => undefined
      ),
      [size]
    );

    return (
      <div
        className="grid gap-0.5 w-full aspect-square"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        role="grid"
        aria-label={`${size}x${size} grid preview`}
      >
        {cells.map((_, index) => (
          <div
            key={generateCellId(size, index)}
            className="bg-gray-300 dark:bg-gray-600 rounded-sm"
            style={{ aspectRatio: '1 / 1' }}
            role="gridcell"
          />
        ))}
        <div 
          className="bg-gray-100 dark:bg-gray-800 rounded-sm" 
          role="gridcell"
          aria-label="Empty cell"
        />
      </div>
    );
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Sliding Puzzle
      </h1>

      {/* Grid Size Selection */}
      <div className="space-y-4" role="group" aria-labelledby="grid-size-label">
        <h2 id="grid-size-label" className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select Grid Size
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {GRID_SIZES.map(size => (
            <button
              type="button"
              key={`size-${size}`}
              onClick={onHandleSizeSelect(size)}
              className={`p-2 rounded-lg ${getButtonStyles(validatedSize === size)}`}
              aria-label={`Select ${size}x${size} grid`}
              aria-pressed={validatedSize === size}
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
      <div className="space-y-4" role="group" aria-labelledby="difficulty-label">
        <h2 id="difficulty-label" className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select Difficulty
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {DIFFICULTIES.map(difficulty => (
            <button
              type="button"
              key={`difficulty-${difficulty}`}
              onClick={onHandleDifficultySelect(difficulty)}
              className={getDifficultyStyles(validatedDifficulty === difficulty)}
              aria-label={`Select ${difficulty} difficulty`}
              aria-pressed={validatedDifficulty === difficulty}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => onLevelSelect(validatedSize, validatedDifficulty)}
          className="px-8 py-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          aria-label="Start game with selected settings"
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