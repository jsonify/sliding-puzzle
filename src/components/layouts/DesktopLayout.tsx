import type { DesktopLayoutProps } from '../../types/layout';
import { useState } from 'react';
import GameControlsPanel from '../layouts/GameControlsPanel';
import LeaderboardPanel from '../layouts/LeaderboardPanel';

export default function DesktopLayout({
  mode,
  score,
  time,
  onNewGame,
  onBackToMain,
  targetPattern,
  children,
  gridSize,
  onSizeChange,
}: DesktopLayoutProps): JSX.Element {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start gap-8 max-w-[1920px] mx-auto">
        {/* Left Panel - Game Controls */}
        <div className="w-full lg:w-80 mb-8 lg:mb-0">
          <GameControlsPanel
            mode={mode}
            score={score}
            time={time}
            onNewGame={onNewGame}
            onBackToMain={onBackToMain}
            gridSize={gridSize}
            onSizeChange={onSizeChange}
            targetPattern={targetPattern}
          />
        </div>

        {/* Center - Game Board */}
        <div className="flex-grow">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            {children}
          </div>
        </div>

        {/* Right Panel - Leaderboard */}
        <div className="w-full lg:w-80 mt-8 lg:mt-0">
          <LeaderboardPanel
            isOpen={isLeaderboardOpen}
            onToggle={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
          />
        </div>
      </div>
    </div>
  );
}