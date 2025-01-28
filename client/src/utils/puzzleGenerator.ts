// client/src/utils/puzzleGenerator.ts
import { Tile, BoardState } from '../components/Board/types';
import { PredefinedPuzzle } from '../data/predefinedPuzzles';

const COLORS = [
  '#FF6B6B', // red
  '#4ECDC4', // teal
  '#45B7D1', // blue
  '#96CEB4', // green
  '#FFEEAD', // yellow
  '#D4A5A5'  // pink
];

export function generatePuzzleFromPattern(pattern: number[][]): BoardState {
  return pattern.map(row => 
    row.map(colorIndex => ({
      color: colorIndex === 0 ? '' : COLORS[colorIndex - 1],
      number: colorIndex,
      isEmpty: colorIndex === 0
    }))
  );
}

export function createShuffledPuzzle(pattern: number[][]): BoardState {
  const tiles: Tile[] = [];
  
  // Convert pattern to tiles
  pattern.flat().forEach((colorIndex) => {
    tiles.push({
      color: colorIndex === 0 ? '' : COLORS[colorIndex - 1],
      number: colorIndex,
      isEmpty: colorIndex === 0
    });
  });

  // Shuffle tiles until valid
  let shuffledTiles: Tile[];
  do {
    shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
  } while (!isSolvable(shuffledTiles));

  // Convert back to 5x5 grid
  const board: BoardState = [];
  for (let i = 0; i < 5; i++) {
    board.push(shuffledTiles.slice(i * 5, (i + 1) * 5));
  }

  return board;
}

export function loadPredefinedPuzzle(puzzle: PredefinedPuzzle): BoardState {
  return createShuffledPuzzle(puzzle.pattern);
}

function isSolvable(tiles: Tile[]): boolean {
  let inversions = 0;
  const numbers = tiles.map(tile => tile.number);
  
  // Count inversions
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] !== 0 && numbers[j] !== 0 && numbers[i] > numbers[j]) {
        inversions++;
      }
    }
  }

  // Find empty tile row from bottom (0-based index)
  const emptyIndex = numbers.indexOf(0);
  const emptyRowFromBottom = 4 - Math.floor(emptyIndex / 5);

  // For a 5x5 puzzle, it's solvable if:
  // - empty tile on odd row from bottom + even inversions
  // - empty tile on even row from bottom + odd inversions
  return emptyRowFromBottom % 2 === inversions % 2;
}

export function isWinningState(board: BoardState): boolean {
  const flattened = board.flat();
  
  // Check if numbers are in sequence (1-24) followed by empty tile
  for (let i = 0; i < 24; i++) {
    if (flattened[i].number !== i + 1) return false;
  }
  return flattened[24].isEmpty;
}