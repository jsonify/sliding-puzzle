// useGame.ts
import { useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';
import type { BoardState, Move } from '../components/Board/types';

type Position = {
  row: number;
  col: number;
};

export const useGame = (gameId: string) => {
  const [boardState, setBoardState] = useState<BoardState>([]);
  const [emptyPosition, setEmptyPosition] = useState<Position>({ row: 4, col: 4 });
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    socket.emit('joinGame', gameId);

    socket.on('gameState', (state) => {
      setBoardState(state.board);
      setEmptyPosition(state.emptyPosition);
      setIsSolved(state.status === 'completed');
    });

    return () => {
      socket.off('gameState');
      socket.emit('leaveGame', gameId);
    };
  }, [gameId]);

  const makeMove = useCallback((move: Move) => {
    socket.emit('move', { gameId, move });
  }, [gameId]);

  const isValidMove = useCallback((move: Move): boolean => {
    const rowDiff = Math.abs(move.from.row - move.to.row);
    const colDiff = Math.abs(move.from.col - move.to.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }, []);

  return {
    boardState,
    makeMove,
    isValidMove,
    emptyPosition,
    isSolved
  };
};