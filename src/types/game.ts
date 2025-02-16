import { TileColor, PatternType, PATTERN_TYPES } from '../constants/colorMode';

export type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Position = {
  row: number;
  col: number;
};

export type GameMode = 'classic' | 'color';

export type ClassicBoard = number[][];
export type ColorBoard = (TileColor | 0)[][];
export type Board = ClassicBoard | ColorBoard;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  mode: GameMode;
  gridSize: GridSize;
  difficulty: Difficulty;
  patternType?: PatternType; // Only used in color mode
}

export interface ColorModeState {
  targetPattern: ColorBoard;
  currentPattern: ColorBoard;
  emptyPosition: Position;
  moves: number;
  startTime: number;
  isWon: boolean;
}

export interface ClassicModeState {
  board: ClassicBoard;
  emptyPosition: Position;
  moves: number;
  startTime: number;
  isWon: boolean;
}

export interface GameState {
  board: Board;
  emptyPosition: Position;
  moves: number;
  startTime: number;
  isWon: boolean;
}

export interface TileProperties {
  number: number;
  position: Position;
  size: number;
  isMovable: boolean;
  onClick: () => void;
}

export interface BoardProps {
  mode: GameMode;
  gridSize: GridSize;
  tiles: Board;
  onTileClick: (position: Position) => void;
  tileSize: number;
  isWon: boolean;
  onBackToMain: () => void;
}

export interface GameControlsProperties {
  moves: number;
  mode: GameMode;
  time: number;
  onNewGame: () => void;
  onSizeChange: (size: GridSize) => void;
  onPatternTypeChange?: (type: typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]) => void;
  onDifficultyChange: (level: Difficulty) => void;
  currentSize: GridSize;
  currentDifficulty: Difficulty;
  onBackToMain: () => void;
}

export interface LevelSelectProps {
  onLevelSelect: (size: GridSize, difficulty: Difficulty) => void;
  currentSize: GridSize;
  currentDifficulty: Difficulty;
}

export interface LeaderboardEntry {
  moves: number;
  timeSeconds: number;
  completedAt: string;
  difficulty: Difficulty;
  gridSize: GridSize;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  criteria: {
    type: 'moves' | 'time' | 'games' | 'special';
    value: number;
  };
}

export interface GameHistoryEntry extends LeaderboardEntry {
  id: string;
  achievementsUnlocked: string[]; // Achievement IDs
}

export interface GlobalStats {
  totalGamesPlayed: number;
  totalTimePlayed: number;
  totalMoves: number;
  gamesPerMode: Record<GameMode, number>;
  gamesPerSize: Record<GridSize, number>;
}

export interface LeaderboardCategories {
  [key: string]: {
    bestMoves: LeaderboardEntry;
    bestTime: LeaderboardEntry;
    recentGames: GameHistoryEntry[];
    stats: {
      gamesPlayed: number;
      totalTime: number;
      totalMoves: number;
      averageTime: number;
      averageMoves: number;
    };
  };
}

export interface LeaderboardData {
  categories: LeaderboardCategories;
  global: GlobalStats;
  achievements: Achievement[];
}

export type Leaderboard = LeaderboardData;
