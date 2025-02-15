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
}

export interface GameControlsProps {
  moves: number;
  time: number;
  onNewGame: () => void;
  onSizeChange: (size: GridSize) => void;
  onDifficultyChange: (level: Difficulty) => void;
  currentSize: GridSize;
  currentDifficulty: Difficulty;
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

export interface Leaderboard {
  [key: string]: {
    bestMoves: LeaderboardEntry;
    bestTime: LeaderboardEntry;
  };
}