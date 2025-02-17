import type { GameMode } from './game';
import type { PatternType } from '../constants/colorMode';

export interface GameLayoutProps {
  mode: GameMode;
  children: React.ReactNode;
  score: number;
  time: number;
  onNewGame: () => void;
  onModeChange: (mode: GameMode) => void;
  onBackToMain: () => void;
}

export interface ScoreBarProps {
  score: number;
  time: number;
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
}

export interface PatternPreviewProps {
  mode: GameMode;
  pattern: number[][] | string[][];
}