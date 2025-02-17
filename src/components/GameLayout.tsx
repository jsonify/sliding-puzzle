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
}: GameLayoutProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { orientation } = useOrientation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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
        onSizeChange={onSizeChange}
      >
        {children}
      </DesktopLayout>
    );
  }

  // Mobile layout classes based on orientation
  const layoutClasses = orientation === 'landscape'
    ? 'flex-row items-center justify-center gap-8 px-4'
    : 'flex-col items-stretch pt-20 pb-safe px-4';

  // Preview size classes based on orientation
  const previewClasses = orientation === 'landscape'
    ? 'w-[200px] flex-shrink-0' // Larger size in landscape
    : 'w-[200px] mx-auto mb-4'; // Consistent size in portrait

  return (
    <div className="mobile-container">
      <div className={MOBILE_LAYOUT_STYLES.CONTAINER}>
        {/* Fixed position score bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <ScoreBar score={score} time={time} />
        </div>

        {/* Game content with orientation-specific layout */}
        <div className={`w-full max-w-5xl mx-auto flex ${layoutClasses}`}>
          {/* Pattern Preview - conditionally rendered based on orientation */}
          {orientation === 'portrait' && (
            <div className={previewClasses}>
              <PatternPreview 
                mode={mode} 
                pattern={targetPattern}
                size="md"
              />
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
              <PatternPreview 
                mode={mode} 
                pattern={targetPattern}
                size="md"
              />
            </div>
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
          {mode === 'classic' ? (
            <ClassicMenuIcon />
          ) : (
            <ColorMenuIcon />
          )}
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