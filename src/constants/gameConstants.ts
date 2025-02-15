export const GameConstants = {
  /** Empty cell value */
  EMPTY_CELL: 0,
  /** Grid increment value */
  GRID_INCREMENT: 1,
  /** Default starting number */
  START_NUMBER: 1,
  /** Base multiplier for shuffle moves */
  BASE_SHUFFLE_MULTIPLIER: 5,
  /** Shuffle multipliers by difficulty */
  SHUFFLE_MULTIPLIERS: {
    easy: 1,
    medium: 2,
    hard: 3,
  },
  /** Time threshold for speed achievement (seconds) */
  SPEED_ACHIEVEMENT_THRESHOLD: 30,
  /** Maximum recent games to store */
  MAX_RECENT_GAMES: 10,
} as const;

/** Grid sizes configuration */
export const GridSizes = {
  MIN: 3,
  MAX: 9,
  SIZES: [3, 4, 5, 6, 7, 8, 9],
} as const;

/** Board movement directions */
export const BoardDirections = {
  DIRECTIONS: [
    { dx: -1, dy: 0 }, // Up 
    { dx: 1, dy: 0 },  // Down
    { dx: 0, dy: -1 }, // Left
    { dx: 0, dy: 1 },  // Right
  ],
} as const;