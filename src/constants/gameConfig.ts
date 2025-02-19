import type { GridSize, GameMode } from '../types/game';
import { COLOR_MODE, PATTERN_TYPES } from './colorMode';

/** Type guard to check if a value is a number */
const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

/**
 * Custom error class for game configuration related errors
 * @extends Error
 */
export class GameConfigError extends Error {
  /** Name of the error for better error identification */
  override name: string;

  /**
   * Creates a new GameConfigError instance
   * @param message - The error message
   * @throws Never - Constructor will always succeed
   */
  public constructor(message: string) {
    super(message);
    this.name = 'GameConfigError';
    // Restore prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, GameConfigError.prototype);
  }
}

/** Constants used across the game configuration */
const EMPTY_TILES_VALUE = 1;
const EMPTY_POSITION_OFFSET_VALUE = 1;
const GRID_OFFSET_VALUE = 1;

/**
 * Enum representing valid grid dimensions
 * Uses descriptive names instead of magic numbers
 */
export const enum GridDimension {
  ThreeByThree = 3,
  FourByFour = 4,
  FiveByFive = 5,
  SixBySix = 6,
  SevenBySeven = 7,
  EightByEight = 8,
  NineByNine = 9,
}

/**
 * Grid configuration constants with strong typing
 */
export const GRID = {
  /** Grid size constants with semantic names */
  SIZE_3X3: GridDimension.ThreeByThree,
  SIZE_4X4: GridDimension.FourByFour,
  SIZE_5X5: GridDimension.FiveByFive,
  SIZE_6X6: GridDimension.SixBySix,
  SIZE_7X7: GridDimension.SevenBySeven,
  SIZE_8X8: GridDimension.EightByEight,
  SIZE_9X9: GridDimension.NineByNine,

  /** Grid size boundaries */
  MIN_SIZE: GridDimension.ThreeByThree,
  MAX_SIZE: GridDimension.NineByNine,

  /** Game board constants */
  EMPTY_TILES_VALUE,
  EMPTY_POSITION_OFFSET_VALUE,
} as const;

/**
 * Utility function to generate array of valid grid sizes
 */
const generateGridSizes = (): readonly GridSize[] => {
  if (!isNumber(GRID.MIN_SIZE) || !isNumber(GRID.MAX_SIZE)) {
    throw new GameConfigError('Invalid grid size bounds');
  }
  
  try {
    const sizes = Array.from(
      { length: GRID.MAX_SIZE - GRID.MIN_SIZE + GRID_OFFSET_VALUE },
      (_, index) => (GRID.MIN_SIZE + index) as GridSize
    );

    // Validate generated sizes and ensure they're within bounds
    if (sizes.length === 0 || sizes.some(size => size < GRID.MIN_SIZE || size > GRID.MAX_SIZE)) {
      throw new GameConfigError('Generated grid sizes are invalid');
    }

    return Object.freeze(sizes);
  } catch (error) {
    throw new GameConfigError(
      `Failed to generate grid sizes: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Available game modes
 */
export const GAME_MODES = {
  CLASSIC: 'classic',
  COLOR: 'color',
} as const;

/**
 * Game configuration settings with strong type checking
 */
export const GAME_CONFIG = {
  /** Programmatically generated array of valid grid sizes */
  GRID_SIZES: generateGridSizes(),

  /** Available game modes */
  MODES: [
    GAME_MODES.CLASSIC,
    GAME_MODES.COLOR,
  ] as const,

  /** Game board configuration */
  EMPTY_TILES_COUNT: EMPTY_TILES_VALUE,
  EMPTY_TILE_OFFSET: EMPTY_POSITION_OFFSET_VALUE,

  /** Default settings */
  DEFAULT_MODE: GAME_MODES.CLASSIC as GameMode,
  DEFAULT_SIZE: GRID.SIZE_3X3,
} as const;

/**
 * Default game configuration
 */
export const DEFAULT_CONFIG = {
  mode: GAME_CONFIG.DEFAULT_MODE,
  size: GAME_CONFIG.DEFAULT_SIZE,
} as const;

/**
 * Local storage keys for persisting game state
 */
export const STORAGE_KEYS = {
  /** Key for storing unlocked grid sizes */
  UNLOCKED_SIZES: 'slidingPuzzle_unlockedSizes'
} as const;

type ValidationError = {
  message: string;
  value?: number;
};

/**
 * Validates the game configuration settings
 * @throws {GameConfigError} When configuration is invalid
 */
const validateConfig = (): void => {
  const errors: ValidationError[] = [];

  // Validate grid sizes
  GAME_CONFIG.GRID_SIZES.forEach(size => {
    if (!isNumber(size) || size < GRID.MIN_SIZE || size > GRID.MAX_SIZE) {
      errors.push({
        message: `Grid size must be between ${GRID.MIN_SIZE} and ${GRID.MAX_SIZE}`,
        value: size
      });
    }
  });

  // If any validation errors occurred, throw with detailed message
  if (errors.length > 0) {
    const errorMessages = errors.map(error => 
      `${error.message}${error.value ? ` (got: ${error.value})` : ''}`).join('\n');
    throw new GameConfigError(`Configuration validation failed:\n${errorMessages}`);
  }
};

// Run validation immediately
validateConfig();