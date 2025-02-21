// src/components/GameLayout.tsx

import { useState } from 'react';
import type { GameLayoutProps } from '../types/layout';
import { useOrientation } from '../hooks/useOrientation';
import DesktopLayout from './layouts/DesktopLayout';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { ClassicMenuIcon, ColorMenuIcon } from './MenuIcons';
import ScoreBar from './ScoreBar';
import PatternPreview from './PatternPreview';
import MenuSheet from './MenuSheet';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PauseOverlay from './PauseOverlay';
import TimerDisplay from './TimerDisplay';

/**
 * Main layout component with responsive design for both desktop and mobile
 */
export default function GameLayout({
  mode,
  children,
  score,
  time,
  onNewGame,
  onModeChange,
  onBackToMain,
  targetPattern,
  gridSize,
  onSizeChange,
  onSolve,
  unlockedSizes,
  isPaused,
  onPauseToggle,
  timeRemaining,
  onTimeUp, // Add this prop for handling game end
}: GameLayoutProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { orientation } = useOrientation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTimedMode = mode === 'timed';

  if (isDesktop) {
    return (
      <DesktopLayout
        mode={mode}
        score={score}
        time={time}
        onNewGame={onNewGame}
        onBackToMain={onBackToMain}
        targetPattern={targetPattern}
        gridSize={gridSize}
        unlockedSizes={unlockedSizes}
        onSizeChange={onSizeChange}
        onSolve={onSolve}
        isPaused={isPaused}
        onPauseToggle={onPauseToggle}
      >
        {children}
      </DesktopLayout>
    );
  }

  // Mobile layout classes based on orientation
  const layoutClasses = orientation === 'landscape'
    ? 'flex-row items-center justify-center gap-8 px-4'
    : 'flex-col items-stretch pt-32 pb-safe px-4';

  // Preview size classes based on orientation
  const previewClasses = orientation === 'landscape'
    ? 'w-[200px] flex-shrink-0' // Larger size in landscape
    : 'w-[200px] mx-auto mb-4'; // Consistent size in portrait

    const renderTimerDisplay = () => {
      if (!isTimedMode || timeRemaining === undefined) return null;
      
      return (
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-full mt-6">
          <div className="flex justify-center p-4">
            <TimerDisplay
              timeRemaining={timeRemaining}
              gridSize={gridSize}
              isPaused={isPaused}
              onTimeUp={onTimeUp}
              className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-700"
            />
          </div>
        </div>
      );
    };

    return (
      <div className="mobile-container">
        <PauseOverlay isPaused={isPaused} onResume={onPauseToggle} />
        <div className={MOBILE_LAYOUT_STYLES.CONTAINER}>
          {/* Score Bar - Always at top */}
          <div className="fixed top-0 left-0 right-0 z-40">
            <ScoreBar score={score} time={time} mode={mode} />
          </div>
  
          {/* Game content with revised layout */}
          <div className={`w-full max-w-5xl mx-auto flex ${layoutClasses}`}>
            <div className={`w-full ${
              isTimedMode
                ? 'relative pb-24' // Add padding to account for timer below
                : orientation === 'landscape' ? 'max-w-xl' : 'max-w-md'
            } mx-auto`}>
              <div className={MOBILE_LAYOUT_STYLES.BOARD.CONTAINER}>
                {children}
                {renderTimerDisplay()}
              </div>
            </div>
          
          {/* Pattern Preview for landscape - only in color mode */}
          {mode === 'color' && orientation === 'landscape' && (
            <div className={previewClasses}>
              <PatternPreview 
                mode={mode} 
                pattern={targetPattern}
                size="md"
              />
            </div>
          )}
        </div>

        {/* Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className={`
            ${MOBILE_LAYOUT_STYLES.MENU_BUTTON.BUTTON}
            ${MOBILE_LAYOUT_STYLES.ANIMATION.HOVER}
            ${MOBILE_LAYOUT_STYLES.ANIMATION.PRESS}
            fixed bottom-8 left-4 z-50
          `}
          aria-label="Open game menu"
        >
          <ClassicMenuIcon />
        </button>

        <MenuSheet
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          mode={mode}
          onNewGame={onNewGame}
          onModeChange={onModeChange}
          onBackToMain={onBackToMain}
          isPaused={isPaused}
          onPauseToggle={onPauseToggle}
        />
      </div>
    </div>
  );
}