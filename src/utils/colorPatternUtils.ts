import type { ColorBoard, Position } from '../types/game';
import { COLOR_MODE, COLORS, PATTERN_TYPES, type TileColor } from '../constants/colorMode';

const { GRID_SIZE, TILES_PER_COLOR, TOTAL_COLORS } = COLOR_MODE;

/**
 * Generate the column stack pattern (5 vertical columns of same-colored tiles)
 * with empty tile in bottom right
 */
export function generateColumnStackPattern(): ColorBoard {
  const colors = Object.keys(COLORS) as TileColor[];
  const board: ColorBoard = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  
  // Fill each column with the same color (4 tiles per column)
  for (let col = 0; col < GRID_SIZE - 1; col++) {
    for (let row = 0; row < TILES_PER_COLOR; row++) {
      board[row][col] = colors[col];
    }
  }
  
  // Last column gets the remaining color
  for (let row = 0; row < TILES_PER_COLOR; row++) {
    board[row][GRID_SIZE - 1] = colors[TOTAL_COLORS - 1];
  }

  return board;
}

/**
 * Generate a random but solvable color pattern
 */
export function generateRandomPattern(): ColorBoard {
  const colors = Object.keys(COLORS) as TileColor[];
  const board: ColorBoard = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  const colorCounts = new Map<TileColor, number>();
  
  // Initialize color counts
  colors.forEach(color => colorCounts.set(color, 0));
  
  // Fill board randomly while maintaining color counts
  let remainingPositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
    row: Math.floor(i / GRID_SIZE),
    col: i % GRID_SIZE
  }));
  
  // Shuffle positions
  remainingPositions = remainingPositions
    .sort(() => Math.random() - 0.5);
  
  // Leave one position empty
  remainingPositions.pop();
  
  // Fill positions with colors
  for (const pos of remainingPositions) {
    const availableColors = colors.filter(
      color => (colorCounts.get(color) || 0) < TILES_PER_COLOR
    );
    
    if (availableColors.length === 0) break;
    
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    board[pos.row][pos.col] = randomColor;
    colorCounts.set(randomColor, (colorCounts.get(randomColor) || 0) + 1);
  }
  
  return board;
}

/**
 * Generate a pattern based on the specified type
 */
export function generatePattern(type: typeof PATTERN_TYPES[keyof typeof PATTERN_TYPES]): ColorBoard {
  switch (type) {
    case PATTERN_TYPES.COLUMN_STACK:
      return generateColumnStackPattern();
    case PATTERN_TYPES.RANDOM:
      return generateRandomPattern();
    default:
      throw new Error(`Unknown pattern type: ${type}`);
  }
}

/**
 * Check if the current board matches the target pattern
 */
export function isPatternMatched(current: ColorBoard, target: ColorBoard): boolean {
  return current.every((row, rowIndex) =>
    row.every((value, colIndex) => value === target[rowIndex][colIndex])
  );
}

/**
 * Get all positions where a tile can move to
 * (Similar to classic mode but adapted for ColorBoard type)
 */
export function getMovablePositions(board: ColorBoard): Position[] {
  const emptyPos = findEmptyPosition(board);
  if (!emptyPos) return [];

  const { row, col } = emptyPos;
  const positions: Position[] = [];

  // Check all adjacent positions
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    if (
      newRow >= 0 && 
      newRow < board.length && 
      newCol >= 0 && 
      newCol < board[0].length
    ) {
      positions.push({ row: newRow, col: newCol });
    }
  }

  return positions;
}

/**
 * Find the position of the empty tile
 */
function findEmptyPosition(board: ColorBoard): Position | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
}