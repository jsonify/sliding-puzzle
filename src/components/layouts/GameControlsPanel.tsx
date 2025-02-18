import type { GameControlsPanelProps } from '../../types/layout';
import PatternPreview from '../PatternPreview';
import { formatTime } from '../../utils/leaderboardUtils';
import { GAME_CONFIG } from '../../constants/gameConfig';
import { Home, Trophy, Timer, RotateCw, Zap } from 'lucide-react';

export default function GameControlsPanel({
  mode,
  score,
  time,
  onNewGame,
  onBackToMain,
  gridSize,
  onSizeChange,
  targetPattern,
  onSolve,
  unlockedSizes = new Set([GAME_CONFIG.DEFAULT_SIZE]),
}: GameControlsPanelProps): JSX.Element {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-200">Sliding Puzzle</h2>
          <button
            type="button"
            onClick={onBackToMain}
            className="p-2 text-slate-200 hover:text-slate-300 transition-colors"
            aria-label="Back to home"
          >
            <Home className="h-5 w-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy className="h-5 w-5" />
            <span className="text-xl font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Timer className="h-5 w-5" />
            <span className="text-xl font-mono">{formatTime(time)}</span>
          </div>
        </div>

        {/* Grid Size Selection */}
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Grid Size
          </label>
          <select
            value={gridSize}
            onChange={(e) => {
              const newSize = Number(e.target.value) as typeof GAME_CONFIG.GRID_SIZES[number];
              if (unlockedSizes.has(newSize)) {
                onSizeChange(newSize);
              }
            }}
            className="w-full bg-slate-700 border-slate-600 rounded-lg p-2 text-slate-200"
          >
            {GAME_CONFIG.GRID_SIZES.map((size) => {
              const isUnlocked = unlockedSizes.has(size);
              return (
              <option key={size} value={size} 
                disabled={!isUnlocked}>
                {size}x{size}{!isUnlocked ? ' 🔒' : ''}
              </option>
            );})}
          </select>
          <p className="mt-2 text-sm text-slate-400">
            {GAME_CONFIG.GRID_SIZES.some(size => !unlockedSizes.has(size)) && (
              "Complete a puzzle to unlock the next size"
            )}
          </p>
        </div>

        {/* Game Control Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onNewGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            New Game
          </button>
          
          {onSolve && (
            <button
              type="button"
              onClick={onSolve}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Solve
            </button>
          )}
        </div>

        {/* Target Pattern */}
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Target Pattern</h3>
          <PatternPreview
            mode={mode}
            pattern={targetPattern}
            size="sm"
            className="bg-slate-700 p-2 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}