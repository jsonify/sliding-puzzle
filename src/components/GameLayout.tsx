import { useState, useEffect } from 'react';
import type { GameLayoutProps } from '../types/layout';
import { MOBILE_LAYOUT_STYLES } from '../constants/mobileLayout';
import { useOrientation } from '../hooks/useOrientation';
import ScoreBar from './ScoreBar';
import PatternPreview from './PatternPreview';
import MenuSheet from './MenuSheet';
import LoadingIndicator from './LoadingIndicator';

type Pattern = number[][] | string[][];

/**
 * Main layout component for the game screen with orientation support
 */
export default function GameLayout({
  mode,
  children,
  score,
  time,
  onNewGame,
  onModeChange,
  onBackToMain,
}: GameLayoutProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [targetPattern, setTargetPattern] = useState<Pattern>([[]]);
  const [isLoading, setIsLoading] = useState(true);
  const { orientation } = useOrientation();

  // Create target pattern based on mode
  useEffect(() => {
    setIsLoading(true);
    if (mode === 'classic') {
      // Create classic pattern (numbers 1-24 in order, 0 for empty)
      const pattern: number[][] = [];
      let counter = 1;
      for (let i = 0; i < 5; i++) {
        const row: number[] = [];
        for (let j = 0; j < 5; j++) {
          row.push(counter === 25 ? 0 : counter);
          counter++;
        }
        pattern.push(row);
      }
      setTargetPattern(pattern);
    } else {
      // Create color pattern (6 colors repeated 4 times each)
      const colors: string[] = ['WHITE', 'RED', 'BLUE', 'ORANGE', 'GREEN', 'YELLOW'];
      const pattern: string[][] = [];
      let colorIndex = 0;
      for (let i = 0; i < 5; i++) {
        const row: string[] = [];
        for (let j = 0; j < 5; j++) {
          row.push(i === 2 && j === 2 ? '0' : colors[Math.floor(colorIndex++ / 4)]);
        }
        pattern.push(row);
      }
      setTargetPattern(pattern);
    }
    setIsLoading(false);
  }, [mode]);

  // Layout classes based on orientation
  const layoutClasses = orientation === 'landscape'
    ? 'flex-row items-center justify-center gap-8 px-4'
    : 'flex-col items-stretch pt-20 pb-safe px-4';

  // Preview size classes based on orientation
  const previewClasses = orientation === 'landscape'
    ? 'w-[200px] flex-shrink-0' // Larger size in landscape
    : 'w-[200px] mx-auto mb-4'; // Consistent size in portrait

  return (
    <div className="mobile-container">
      {/* Main game container with orientation-aware layout */}
      <div className={MOBILE_LAYOUT_STYLES.CONTAINER}>
        {/* Fixed position score bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <ScoreBar score={score} time={time} />
        </div>

        {/* Game content with orientation-specific layout */}
        <div className={`w-full max-w-5xl mx-auto flex ${layoutClasses}`}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Pattern Preview - conditionally rendered based on orientation */}
              {orientation === 'portrait' && (
                <div className={previewClasses}>
                  <PatternPreview mode={mode} pattern={targetPattern} />
                </div>
              )}

              {/* Game Board */}
              <div className={`w-full ${orientation === 'landscape' ? 'max-w-xl' : 'max-w-md'} mx-auto`}>
                <div className={MOBILE_LAYOUT_STYLES.BOARD.CONTAINER}>
                  {children}
                </div>
              </div>

              {/* Pattern Preview for landscape - positioned on the right */}
              {orientation === 'landscape' && (
                <div className={previewClasses}>
                  <PatternPreview mode={mode} pattern={targetPattern} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Menu Button - fixed position at bottom left with safe area padding */}
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
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Menu Sheet */}
        <MenuSheet
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          mode={mode}
          onNewGame={onNewGame}
          onModeChange={onModeChange}
          onBackToMain={onBackToMain}
        />
      </div>
    </div>
  );
}