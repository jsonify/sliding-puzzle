// client/src/hooks/useGame.ts
import { useState, useCallback, useEffect } from 'react';
import { BoardState, Move, Position } from '../components/Board/types';
import { generatePuzzle, isWinningState } from '../utils/puzzleGenerator';

export const useGame = (gameId: string) => {
  const [boardState, setBoardState] = useState<BoardState>(() => generatePuzzle());
  const [emptyPosition, setEmptyPosition] = useState<Position>(() => {
    const board = boardState;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (board[row][col].isEmpty) {
          return { row, col };
        }
      }
    }
    return { row: 4, col: 4 }; // fallback
  });
  const [isSolved, setIsSolved] = useState(false);

  const isValidMove = useCallback((move: Move): boolean => {
    const rowDiff = Math.abs(move.from.row - move.to.row);
    const colDiff = Math.abs(move.from.col - move.to.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }, []);

  const makeMove = useCallback((move: Move) => {
    if (!isValidMove(move)) return;

    setBoardState(prev => {
      const newBoard = prev.map(row => [...row]);
      const temp = newBoard[move.from.row][move.from.col];
      newBoard[move.from.row][move.from.col] = newBoard[move.to.row][move.to.col];
      newBoard[move.to.row][move.to.col] = temp;
      return newBoard;
    });

    setEmptyPosition(move.from);
  }, [isValidMove]);

  useEffect(() => {
    setIsSolved(isWinningState(boardState));
  }, [boardState]);

  return {
    boardState,
    makeMove,
    isValidMove,
    emptyPosition,
    isSolved
  };
};