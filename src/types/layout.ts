import type { GameMode } from './game';

export interface GameLayoutProps {
  mode: GameMode;
  children: React.ReactNode;
  score: number;
  time: number;
  onNewGame: () => void;
  onModeChange: (mode: GameMode) => void; // Updated to use GameMode type
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
  onNewGame: () => void;
  onModeChange: (mode: GameMode) => void; // Updated to use GameMode type
  onBackToMain: () => void;
}

export interface PatternPreviewProps {
  mode: GameMode;
  pattern: number[][] | string[][];
}