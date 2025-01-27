// client/src/components/Board/Board.tsx
// Description: This code defines a Board component for a game. It manages the game state, handles tile movements, and checks for game completion. The board is displayed as a grid of tiles, and user interactions are processed to update the game state.

import React, { useCallback, useEffect } from 'react';
import { TileComponent } from './Tile';
import { useGame } from '../../hooks/useGame';
import type { Position, Move, BoardState } from './types';

interface BoardProps {
  gameId: string;
  isActive: boolean;
  onGameComplete?: () => void;
}

export const Board: React.FC<BoardProps> = ({ gameId, isActive, onGameComplete }) => {
  const { 
    boardState, 
    makeMove, 
    isValidMove,
    emptyPosition,
    isSolved
  } = useGame(gameId);

  const getAdjacentPositions = useCallback((pos: Position): Position[] => {
    const { row, col } = pos;
    return [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 }
    ].filter(p => 
      p.row >= 0 && p.row < 5 && 
      p.col >= 0 && p.col < 5
    );
  }, []);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (!isActive) return;

    const clickedPos = { row, col };
    const adjacentPositions = getAdjacentPositions(clickedPos);

    if (adjacentPositions.some(pos => 
      pos.row === emptyPosition.row && 
      pos.col === emptyPosition.col
    )) {
      const move: Move = {
        from: clickedPos,
        to: emptyPosition
      };

      if (isValidMove(move)) {
        makeMove(move);
      }
    }
  }, [isActive, emptyPosition, isValidMove, makeMove, getAdjacentPositions]);

  useEffect(() => {
    if (isSolved && onGameComplete) {
      onGameComplete();
    }
  }, [isSolved, onGameComplete]);

  if (!boardState || !Array.isArray(boardState)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-lg">
      <div className="grid grid-cols-5 gap-1 bg-gray-200 p-4 rounded-lg aspect-square">
        {boardState.map((row, rowIndex) => (
          row.map((tile, colIndex) => (
            <TileComponent
              key={`${rowIndex}-${colIndex}`}
              color={tile.color}
              number={tile.number}
              isEmpty={tile.isEmpty}
              isMovable={isActive && getAdjacentPositions({ row: rowIndex, col: colIndex })
                .some(pos => pos.row === emptyPosition.row && pos.col === emptyPosition.col)}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>
    </div>
  );
};