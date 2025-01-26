import React from 'react';
import { Tile } from './Tile';
import { useGame } from '../../hooks/useGame';
import type { BoardState, Move } from './types';

interface BoardProps {
  gameId: string;
  isActive: boolean;
}

const Board: React.FC<BoardProps> = ({ gameId, isActive }) => {
  const { boardState, makeMove, isValidMove } = useGame(gameId);

  const handleTileClick = (tileId: number) => {
    // TODO: Implement move validation and state updates
  };

  return (
    <div className="grid grid-cols-5 gap-1 bg-gray-200 p-4 rounded-lg">
      {/* TODO: Implement grid rendering */}
    </div>
  );
};

export default Board;
