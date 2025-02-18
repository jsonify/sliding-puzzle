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
  /** Timer interval in milliseconds */
  TIMER_INTERVAL: 1000,
  /** Minimum grid index */
  MIN_GRID_INDEX: 0,
  /** Initial grid size */
  INITIAL_GRID_SIZE: 3,
  /** Seconds in a minute */
  SECONDS_IN_MINUTE: 60,
  /** Time display padding length */
  TIME_DISPLAY_PAD_LENGTH: 2,
  /** Time increment */
  TIME_INCREMENT: 1,
  /** Modal backdrop opacity */
  MODAL_BACKDROP_OPACITY: 50,
  /** Default spacing */
  DEFAULT_SPACING: 8,
  /** Move increment */
  MOVE_INCREMENT: 1,
  /** Single position offset */
  SINGLE_POSITION_OFFSET: 1,
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