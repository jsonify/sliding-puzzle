export type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Position = {
  row: number;
  col: number;
};

export type Board = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
  gridSize: GridSize;
  difficulty: Difficulty;
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
  gridSize: GridSize;
  tiles: Board;
  onTileClick: (position: Position) => void;
  tileSize: number;
  isWon: boolean;
  onBackToMain: () => void;
}

export interface BoardProperties {
  gridSize: GridSize;
  tiles: Board;
  onTileClick: (position: Position) => void;
  tileSize: number;
  isWon: boolean;
  onBackToMain: () => void;
}

export interface GameControlsProperties {
  moves: number;
  time: number;
  onNewGame: () => void;
  onSizeChange: (size: GridSize) => void;
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
  gamesPerDifficulty: Record<Difficulty, number>;
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
