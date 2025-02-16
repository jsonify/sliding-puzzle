import React from 'react';
import { Timer, Star, Menu, X } from 'lucide-react';
import Board from '../Board';
import SolutionPreview from '../SolutionPreview/SolutionPreview';
import GameControls from '../GameControls';
import type { BoardProps, ColorBoard, GameControlsProperties } from '../../types/game';

interface GameLayoutProps extends Omit<BoardProps, 'tileSize'>, GameControlsProperties {
  score: number;
  targetPattern: ColorBoard;
  onMenuClick: () => void;
  showMenu: boolean;
}

const calculateTileSize = (gridSize: number): number => {
  const maxBoardWidth = 500; // Max board width
  const totalGapWidth = 2 * (gridSize - 1); // 2px gap between tiles
  const availableSpace = maxBoardWidth - totalGapWidth - (2 * 16 * 2); // Convert 2rem padding to px
  return Math.floor(availableSpace / gridSize);
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Main game layout component that organizes the game UI elements
 */
export default function GameLayout({ 
  score,
  targetPattern,
  onMenuClick,
  showMenu,
  mode,
  gridSize,
  tiles,
  onTileClick,
  isWon,
  moves,
  time,
  onNewGame,
  onSizeChange,
  onDifficultyChange,
  onPatternTypeChange,
  currentSize,
  currentDifficulty,
  onBackToMain,
}: GameLayoutProps): JSX.Element {
  const tileSize = calculateTileSize(gridSize);

  return (
    <div className="w-full min-h-screen bg-teal-100 dark:bg-gray-900 flex flex-col">
      {/* Top status bar */}
      <div className="w-full bg-teal-800 dark:bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">{moves}</span>
            <Star size={20} className="text-yellow-400" />
          </div>
          <div className="flex items-center space-x-2">
            <Timer size={20} />
            <span className="text-lg font-semibold">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 gap-8">
        {/* Solution preview area */}
        <div className="flex justify-center">
          <SolutionPreview targetPattern={targetPattern} />
        </div>

        {/* Main game board */}
        <div className="flex justify-center">
          <Board
            mode={mode}
            gridSize={gridSize}
            tiles={tiles}
            onTileClick={onTileClick}
            isWon={isWon}
            onBackToMain={onBackToMain}
            tileSize={tileSize}
          />
        </div>
      </div>

      {/* Menu button */}
      <button 
        className="fixed bottom-6 left-6 w-12 h-12 bg-teal-700 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-teal-600 dark:hover:bg-gray-600 transition-colors shadow-lg z-20"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        {showMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu panel */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="fixed bottom-24 left-6 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex flex-col gap-3">
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={onNewGame}
            >
              New Game
            </button>

            {mode === 'color' && (
              <select
                className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                defaultValue="random"
                onChange={(e) => onPatternTypeChange?.(e.target.value as any)}
                aria-label="Pattern Type"
              >
                <option value="random">Random Pattern</option>
                <option value="column_stack">Column Stack</option>
              </select>
            )}

            {mode === 'classic' && (
              <>
                <select
                  className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                  value={currentSize}
                  onChange={(e) => onSizeChange(Number(e.target.value) as any)}
                  aria-label="Grid Size"
                >
                  {[3, 4, 5, 6, 7, 8, 9].map((size) => (
                    <option key={size} value={size}>
                      {size}x{size}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                  value={currentDifficulty}
                  onChange={(e) => onDifficultyChange(e.target.value as any)}
                  aria-label="Difficulty"
                >
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              type="button"
              className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={onBackToMain}
            >
              Back to Main
            </button>
          </div>
        </div>
      )}
    </div>
  );
}