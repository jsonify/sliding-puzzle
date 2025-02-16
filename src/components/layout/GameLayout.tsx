import React from 'react';
import { Timer, Star, Menu } from 'lucide-react';
import Board from '../Board';
import SolutionPreview from '../SolutionPreview/SolutionPreview';
import GameControls from '../GameControls';
import type { BoardProps, ColorBoard, GameControlsProperties } from '../../types/game';
import { BoardUI } from '../../constants/boardUI';

interface GameLayoutProps extends Omit<BoardProps, 'tileSize'>, GameControlsProperties {
  score: number;
  targetPattern: ColorBoard;
  onMenuClick: () => void;
}

const calculateTileSize = (gridSize: number): number => {
  const maxBoardWidth = BoardUI.BOARD_MAX_WIDTH_PX;
  const totalGapWidth = BoardUI.TILE_GAP_PX * (gridSize - 1);
  const availableSpace = maxBoardWidth - totalGapWidth - (BoardUI.BOARD_PADDING_REM * 16 * 2); // Convert rem to px (assuming 1rem = 16px)
  return Math.floor(availableSpace / gridSize);
};

/**
 * Main game layout component that organizes the game UI elements
 */
export default function GameLayout({ 
  score,
  targetPattern,
  onMenuClick,
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
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{score}</span>
          <Star size={20} className="text-yellow-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Timer size={20} />
          <span className="text-lg font-semibold">{moves}</span>
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

        {/* Game controls */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <GameControls
            moves={moves}
            mode={mode}
            time={time}
            onNewGame={onNewGame}
            onSizeChange={onSizeChange}
            onDifficultyChange={onDifficultyChange}
            onPatternTypeChange={onPatternTypeChange}
            currentSize={currentSize}
            currentDifficulty={currentDifficulty}
            onBackToMain={onBackToMain}
          />
        </div>
      </div>

      {/* Menu button */}
      <button 
        className="fixed bottom-6 left-6 w-12 h-12 bg-teal-700 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-teal-600 dark:hover:bg-gray-600 transition-colors shadow-lg"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}