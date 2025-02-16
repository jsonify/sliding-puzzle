/**
 * Color constants using Rubik's Cube colors
 */
export const COLORS = {
  WHITE: '#FFFFFF',
  RED: '#B71234',
  BLUE: '#0046AD',
  ORANGE: '#FF5800',
  GREEN: '#009B48',
  YELLOW: '#FFD500',
} as const;

export type TileColor = keyof typeof COLORS;

/**
 * Grid configuration for color mode
 */
export const COLOR_MODE = {
  GRID_SIZE: 5,
  TILES_PER_COLOR: 4,
  TOTAL_COLORS: 6,
  EMPTY_TILE_VALUE: 0,
} as const;

/**
 * Pattern types available in color mode
 */
export const PATTERN_TYPES = {
  RANDOM: 'random',
  COLUMN_STACK: 'column_stack',
} as const;

export type PatternType = typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES];

/**
 * Type guard to check if a value is a valid color
 */
export function isValidColor(color: unknown): color is TileColor {
  return typeof color === 'string' && color in COLORS;
}

/**
 * Column Stack pattern definition
 * Creates 5 vertical columns, each with 4 tiles of the same color
 * Last column on the right, empty tile in bottom right
 */
export const COLUMN_STACK_PATTERN = {
  colors: [
    COLORS.WHITE,
    COLORS.RED,
    COLORS.BLUE,
    COLORS.ORANGE,
    COLORS.GREEN,
    COLORS.YELLOW,
  ],
  emptyPosition: { row: 4, col: 4 }, // bottom right
} as const;