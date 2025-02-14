import { vi } from 'vitest';
import {
  createBoard,
  isValidMove,
  makeMove,
  isWinningState,
  findEmptyPosition,
  isSolvable,
  shuffleBoard,
  getMovablePositions,
} from '../gameUtils';
import type { Board, Position } from '../../types/game';

describe('Game Utils', () => {
  describe('createBoard', () => {
    it('creates a 3x3 board correctly', () => {
      const board = createBoard(3);
      expect(board).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ]);
    });

    it('creates a 4x4 board correctly', () => {
      const board = createBoard(4);
      expect(board).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
      ]);
    });
  });

  describe('isValidMove', () => {
    it('returns true for adjacent positions', () => {
      const emptyPos: Position = { row: 1, col: 1 };
      
      // Test all valid adjacent positions
      expect(isValidMove({ row: 0, col: 1 }, emptyPos)).toBe(true); // above
      expect(isValidMove({ row: 2, col: 1 }, emptyPos)).toBe(true); // below
      expect(isValidMove({ row: 1, col: 0 }, emptyPos)).toBe(true); // left
      expect(isValidMove({ row: 1, col: 2 }, emptyPos)).toBe(true); // right
    });

    it('returns false for non-adjacent positions', () => {
      const emptyPos: Position = { row: 1, col: 1 };
      
      expect(isValidMove({ row: 0, col: 0 }, emptyPos)).toBe(false); // diagonal
      expect(isValidMove({ row: 2, col: 2 }, emptyPos)).toBe(false); // diagonal
      expect(isValidMove({ row: 0, col: 2 }, emptyPos)).toBe(false); // not adjacent
      expect(isValidMove({ row: 3, col: 1 }, emptyPos)).toBe(false); // too far
    });
  });

  describe('makeMove', () => {
    it('swaps tile with empty position correctly', () => {
      const initialBoard: Board = [
        [1, 2, 3],
        [4, 0, 6],
        [7, 8, 5],
      ];
      const emptyPos: Position = { row: 1, col: 1 };
      const movePos: Position = { row: 1, col: 2 };
      
      const newBoard = makeMove(initialBoard, movePos, emptyPos);
      
      expect(newBoard).toEqual([
        [1, 2, 3],
        [4, 6, 0],
        [7, 8, 5],
      ]);
    });

    it('does not modify the original board', () => {
      const initialBoard: Board = [
        [1, 2, 3],
        [4, 0, 6],
        [7, 8, 5],
      ];
      const original = JSON.parse(JSON.stringify(initialBoard));
      
      makeMove(initialBoard, { row: 1, col: 2 }, { row: 1, col: 1 });
      
      expect(initialBoard).toEqual(original);
    });
  });

  describe('isWinningState', () => {
    it('returns true for a solved 3x3 board', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ];
      expect(isWinningState(board)).toBe(true);
    });

    it('returns false for an unsolved board', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 0, 8],
      ];
      expect(isWinningState(board)).toBe(false);
    });
  });

  describe('findEmptyPosition', () => {
    it('finds empty position correctly', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 0, 6],
        [7, 8, 5],
      ];
      expect(findEmptyPosition(board)).toEqual({ row: 1, col: 1 });
    });

    it('throws error when no empty position exists', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(() => findEmptyPosition(board)).toThrow('No empty position found');
    });
  });

  describe('isSolvable', () => {
    it('correctly identifies solvable 3x3 configurations', () => {
      const solvableBoard: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ];
      expect(isSolvable(solvableBoard)).toBe(true);
    });

    it('correctly identifies unsolvable 3x3 configurations', () => {
      const unsolvableBoard: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [8, 7, 0],
      ];
      expect(isSolvable(unsolvableBoard)).toBe(false);
    });
  });

  describe('shuffleBoard', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('creates a solvable shuffled board', () => {
      const initialBoard = createBoard(3);
      const shuffled = shuffleBoard(initialBoard, 'medium');
      
      expect(isSolvable(shuffled)).toBe(true);
      expect(shuffled).not.toEqual(initialBoard);
    });

    it('maintains board size after shuffling', () => {
      const initialBoard = createBoard(4);
      const shuffled = shuffleBoard(initialBoard, 'hard');
      
      expect(shuffled.length).toBe(4);
      shuffled.forEach(row => expect(row.length).toBe(4));
    });
  });

  describe('getMovablePositions', () => {
    it('returns correct movable positions for center empty space', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 0, 6],
        [7, 8, 5],
      ];
      const movable = getMovablePositions(board);
      
      expect(movable).toEqual(
        expect.arrayContaining([
          { row: 0, col: 1 }, // above
          { row: 2, col: 1 }, // below
          { row: 1, col: 0 }, // left
          { row: 1, col: 2 }, // right
        ])
      );
      expect(movable.length).toBe(4);
    });

    it('returns correct movable positions for corner empty space', () => {
      const board: Board = [
        [0, 2, 3],
        [4, 5, 6],
        [7, 8, 1],
      ];
      const movable = getMovablePositions(board);
      
      expect(movable).toEqual(
        expect.arrayContaining([
          { row: 0, col: 1 }, // right
          { row: 1, col: 0 }, // below
        ])
      );
      expect(movable.length).toBe(2);
    });
  });
});