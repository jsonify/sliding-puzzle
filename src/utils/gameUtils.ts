import { Board, Difficulty, GridSize, Position, LeaderboardEntry, Leaderboard } from '../types/game';

/**
 * Creates a solved board of the specified size
 */
export function createBoard(size: GridSize): Board {
  const board: Board = [];
  let currentNumber = 1;
  
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      // Last cell should be empty (represented by 0)
      board[row][col] = row === size - 1 && col === size - 1 ? 0 : currentNumber++;
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
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Makes a move by swapping the tile with empty cell
 */
export function makeMove(board: Board, pos: Position, emptyPos: Position): Board {
  const newBoard = board.map(row => [...row]);
  
  // Swap the clicked position with empty position
  const temp = newBoard[pos.row][pos.col];
  newBoard[pos.row][pos.col] = 0;
  newBoard[emptyPos.row][emptyPos.col] = temp;
  
  return newBoard;
}

/**
 * Checks if the board is in a winning state
 */
export function isWinningState(board: Board): boolean {
  const size = board.length;
  let expectedNumber = 1;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Skip checking the last cell (should be empty)
      if (row === size - 1 && col === size - 1) {
        return board[row][col] === 0;
      }
      
      if (board[row][col] !== expectedNumber) {
        return false;
      }
      expectedNumber++;
    }
  }
  
  return true;
}

/**
 * Get the position of the empty cell
 */
export function findEmptyPosition(board: Board): Position {
  const size = board.length;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        return { row, col };
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
  for (let i = 0; i < flatBoard.length - 1; i++) {
    if (flatBoard[i] === 0) continue;
    
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[j] === 0) continue;
      if (flatBoard[i] > flatBoard[j]) {
        inversions++;
      }
    }
  }
  
  // For odd-sized boards, solvable if inversions is even
  if (size % 2 === 1) {
    return inversions % 2 === 0;
  }
  
  // For even-sized boards, solvable if:
  // - empty on even row from bottom + odd inversions
  // - empty on odd row from bottom + even inversions
  const emptyPos = findEmptyPosition(board);
  const emptyRowFromBottom = size - emptyPos.row;
  
  return (emptyRowFromBottom % 2 === 0) === (inversions % 2 === 1);
}

/**
 * Shuffles the board based on difficulty
 * Returns a solvable board configuration
 */
export function shuffleBoard(board: Board, difficulty: Difficulty): Board {
  const size = board.length;
  const moveCount = calculateShuffleMoves(size, difficulty);
  let currentBoard = board.map(row => [...row]);
  let emptyPos = findEmptyPosition(currentBoard);
  
  // Perform random valid moves
  for (let i = 0; i < moveCount; i++) {
    const validMoves: Position[] = [];
    
    // Find all valid moves
    if (emptyPos.row > 0) validMoves.push({ row: emptyPos.row - 1, col: emptyPos.col });
    if (emptyPos.row < size - 1) validMoves.push({ row: emptyPos.row + 1, col: emptyPos.col });
    if (emptyPos.col > 0) validMoves.push({ row: emptyPos.row, col: emptyPos.col - 1 });
    if (emptyPos.col < size - 1) validMoves.push({ row: emptyPos.row, col: emptyPos.col + 1 });
    
    // Select random valid move
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    currentBoard = makeMove(currentBoard, move, emptyPos);
    emptyPos = move;
  }
  
  // If resulting board is not solvable, make one more move to make it solvable
  if (!isSolvable(currentBoard) && emptyPos.row !== size - 1) {
    const validMove = { row: emptyPos.row > 0 ? emptyPos.row - 1 : emptyPos.row + 1, col: emptyPos.col };
    currentBoard = makeMove(currentBoard, validMove, emptyPos);
  }
  
  return currentBoard;
}

/**
 * Calculate number of random moves for shuffling based on difficulty
 */
function calculateShuffleMoves(size: number, difficulty: Difficulty): number {
  const baseMoves = size * size * 5;
  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  return baseMoves * multiplier;
}

/**
 * Get movable positions on the current board
 */
export function getMovablePositions(board: Board): Position[] {
  const emptyPos = findEmptyPosition(board);
  const size = board.length;
  const movable: Position[] = [];
  
  // Check all adjacent positions
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dx, dy] of directions) {
    const updatedRow = emptyPos.row + dx;
    const updatedCol = emptyPos.col + dy;
    
    if (updatedRow >= 0 && updatedRow < size && updatedCol >= 0 && updatedCol < size) {
      movable.push({ row: updatedRow, col: updatedCol });
    }
  }
  
  return movable;
}

/**
 * Generate a unique key for leaderboard entries
 */
function getLeaderboardKey(gridSize: GridSize, difficulty: Difficulty): string {
  return `${gridSize}x${gridSize}-${difficulty}`;
}

/**
 * Load leaderboard data from localStorage
 */
export function loadLeaderboard(): Leaderboard {
  const data = localStorage.getItem('sliding-puzzle-leaderboard');
  return data ? JSON.parse(data) : {};
}

/**
 * Save leaderboard data to localStorage
 */
function saveLeaderboard(leaderboard: Leaderboard): void {
  localStorage.setItem('sliding-puzzle-leaderboard', JSON.stringify(leaderboard));
}

/**
 * Format time in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Update leaderboard with a new game result
 */
export function updateLeaderboard(
  gridSize: GridSize,
  difficulty: Difficulty,
  moves: number,
  timeSeconds: number
): void {
  const leaderboard = loadLeaderboard();
  const key = getLeaderboardKey(gridSize, difficulty);
  const entry: LeaderboardEntry = {
    moves,
    timeSeconds,
    completedAt: new Date().toISOString(),
    difficulty,
    gridSize,
  };

  if (!leaderboard[key]) {
    leaderboard[key] = {
      bestMoves: entry,
      bestTime: entry,
    };
  } else {
    if (moves < leaderboard[key].bestMoves.moves) {
      leaderboard[key].bestMoves = entry;
    }
    if (timeSeconds < leaderboard[key].bestTime.timeSeconds) {
      leaderboard[key].bestTime = entry;
    }
  }

  saveLeaderboard(leaderboard);
}