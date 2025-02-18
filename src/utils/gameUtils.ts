// src/utils/gameUtils.ts
import { 
  Board, 
  GridSize, 
  Position, 
  Leaderboard,
  GameHistoryEntry, 
  Achievement, 
  GlobalStats, 
  LeaderboardData 
} from '../types/game';
import { GameConstants, BoardDirections, GridSizes } from '../constants/gameConstants';

/**
 * Creates a solved board of the specified size
 */
export function createBoard(size: GridSize): Board {
  const board: Board = [];
  let currentNumber = GameConstants.START_NUMBER;

  const totalCells = size * size;
  
  for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
    board[rowIndex] = [];
    for (let colIndex = 0; colIndex < size; colIndex += 1) {
      const isLastCell = currentNumber === totalCells;
      board[rowIndex][colIndex] = isLastCell ? GameConstants.EMPTY_CELL : currentNumber;
      currentNumber += 1;
    }
  }
  
  return board;
}

/**
 * Checks if the given position is adjacent to the empty cell
 */
export function isValidMove(pos: Position, emptyPos: Position): boolean {
  const rowDiff = Math.abs(pos.row - emptyPos.row);
  const colDiff = Math.abs(pos.col - emptyPos.col);
  
  // Valid move if exactly one dimension has diff of 1 and other has diff of 0
  return (rowDiff === GameConstants.GRID_INCREMENT && colDiff === GameConstants.EMPTY_CELL) || 
         (rowDiff === GameConstants.EMPTY_CELL && colDiff === GameConstants.GRID_INCREMENT);
}

/**
 * Makes a move by swapping the tile with empty cell
 */
export function makeMove(board: Board, pos: Position, emptyPos: Position): Board {
  const updatedBoard = board.map(row => [...row]);
  
  // Swap the clicked position with empty position
  const temp = updatedBoard[pos.row][pos.col];
  updatedBoard[pos.row][pos.col] = GameConstants.EMPTY_CELL;
  updatedBoard[emptyPos.row][emptyPos.col] = temp;
  
  return updatedBoard;
}

/**
 * Checks if the board is in a winning state
 */
export function isWinningState(board: Board): boolean {
  const size = board.length;
  let expectedNumber = GameConstants.START_NUMBER;
  const totalCells = size * size;
  
  for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
    for (let colIndex = 0; colIndex < size; colIndex += 1) {
      const currentCell = board[rowIndex][colIndex];
      const isLastCell = expectedNumber === totalCells;
      
      if (isLastCell) {
        return currentCell === GameConstants.EMPTY_CELL;
      }
      
      if (currentCell !== expectedNumber) {
        return false;
      }
      
      expectedNumber += 1;
    }
  }
  
  return true;
}

/**
 * Get the position of the empty cell
 */
export function findEmptyPosition(board: Board): Position {
  const size = board.length;
  
  for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
    for (let colIndex = 0; colIndex < size; colIndex += 1) {
      if (board[rowIndex][colIndex] === GameConstants.EMPTY_CELL) {
        return { row: rowIndex, col: colIndex };
      }
    }
  }
  
  throw new Error('No empty position found on board');
}

/**
 * Checks if a board configuration is solvable
 * Uses inversion count method to determine solvability
 */
export function isSolvable(board: Board): boolean {
  const size = board.length;
  const flatBoard = board.flat();
  let inversions = 0;
  
  // Count inversions
  for (let i = 0; i < flatBoard.length - 1; i += 1) {
    if (flatBoard[i] === GameConstants.EMPTY_CELL) continue;
    
    for (let j = i + 1; j < flatBoard.length; j += 1) {
      if (flatBoard[j] === GameConstants.EMPTY_CELL) continue;
      if (flatBoard[i] > flatBoard[j]) {
        inversions += 1;
      }
    }
  }
  
  // For odd-sized boards, solvable if inversions is even
  if (size % 2 === GameConstants.GRID_INCREMENT) {
    return inversions % 2 === GameConstants.EMPTY_CELL;
  }
  
  // For even-sized boards, solvable if:
  // - empty on even row from bottom + odd inversions
  // - empty on odd row from bottom + even inversions
  const emptyPos = findEmptyPosition(board);
  const emptyRowFromBottom = size - emptyPos.row;
  
  return (emptyRowFromBottom % 2 === GameConstants.EMPTY_CELL) === 
         (inversions % 2 === GameConstants.GRID_INCREMENT);
}

/**
 * Shuffles the board
 * Returns a solvable board configuration
 */
export function shuffleBoard(board: Board, moves?: number): Board {
  const size = board.length;
  // If moves not specified, calculate based on board size
  const moveCount = moves || calculateShuffleMoves(size);
  let updatedBoard = board.map(row => [...row]);
  let emptyPos = findEmptyPosition(updatedBoard);
  
  // Perform random valid moves
  for (let i = 0; i < moveCount; i += 1) {
    const validMoves: Position[] = [];
    
    // Check each direction for valid moves
    BoardDirections.DIRECTIONS.forEach(({ dx, dy }) => {
      const nextRow = emptyPos.row + dx;
      const nextCol = emptyPos.col + dy;
      
      if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
        validMoves.push({ row: nextRow, col: nextCol });
      }
    });
    
    // Select random valid move
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    updatedBoard = makeMove(updatedBoard, move, emptyPos);
    emptyPos = move;
  }
  
  return updatedBoard;
}

/**
 * Calculate number of random moves for shuffling based on board size
 */
function calculateShuffleMoves(size: number): number {
  const SHUFFLE_MULTIPLIER = 20; // Higher multiplier for more randomness
  return size * size * SHUFFLE_MULTIPLIER;
}

/**
 * Get movable positions on the current board
 */
export function getMovablePositions(board: Board): Position[] {
  const emptyPos = findEmptyPosition(board);
  const size = board.length;
  const movable: Position[] = [];
  
  // Check all adjacent positions
  BoardDirections.DIRECTIONS.forEach(({ dx, dy }) => {
    const nextRow = emptyPos.row + dx;
    const nextCol = emptyPos.col + dy;
    
    if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
      movable.push({ row: nextRow, col: nextCol });
    }
  });
  
  return movable;
}

// Move achievements and leaderboard related code to a separate file
// This will help reduce complexity and improve maintainability
// TODO: Create separate leaderboard.ts file for these functions