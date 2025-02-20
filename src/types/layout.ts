import type { GameMode, Board, GridSize } from './game';
import type { PatternType } from '../constants/colorMode';
import type { ReactNode } from 'react';

export interface GameControlsPanelProps {
  mode: GameMode;
  score: number;
  time: number;
  onNewGame: () => void;
  onBackToMain: () => void;
  gridSize: GridSize;
  unlockedSizes: Set<GridSize>;
  onSizeChange: (size: GridSize) => void;
  targetPattern: Board;
  onSolve?: () => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}

export interface LeaderboardPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface GameBoardContainerProps {
  children: ReactNode;
  isLandscape?: boolean;
}

export interface DesktopLayoutProps {
  mode: GameMode;
  score: number;
  time: number;
  onNewGame: () => void;
  onBackToMain: () => void;
  targetPattern: Board;
  children: ReactNode;
  gridSize: GridSize;
  unlockedSizes: Set<GridSize>;
  onSizeChange: (size: GridSize) => void;
  onSolve?: () => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}

export interface GameLayoutProps extends DesktopLayoutProps {
  onModeChange: (mode: GameMode) => void;
}

export interface ScoreBarProps {
  score: number;
  time: number;
  mode?: GameMode;
}

export interface MenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: GameMode;
  patternType?: PatternType;
  onPatternTypeChange?: (type: PatternType) => void;
  onNewGame: () => void;
  onModeChange: (mode: GameMode) => void;
  onBackToMain: () => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}

export interface PatternPreviewProps {
  mode: GameMode;
  pattern: Board;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface TabProps {
  value: string;
  label: string;
  children: ReactNode;
}

export interface TabsContainerProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
}

export interface PauseOverlayProps {
  isPaused: boolean;
  onResume: () => void;
}