// client/src/components/Board/Tile.tsx
// Description: This code defines a Tile component for a game board. Each tile can be empty or contain a number and color. The tile is clickable if it is movable, and the appearance changes based on its state.

import React from 'react';

interface TileProps {
  color: string;
  number: number;
  isEmpty: boolean;
  isMovable: boolean;
  onClick: () => void;
}

export const TileComponent: React.FC<TileProps> = ({ 
  color, 
  number, 
  isEmpty, 
  isMovable, 
  onClick 
}) => {
  if (isEmpty) {
    return <div className="aspect-square bg-gray-300 rounded" />;
  }

  return (
    <button
      onClick={onClick}
      disabled={!isMovable}
      className={`
        aspect-square rounded flex items-center justify-center
        ${isMovable ? 'cursor-pointer hover:brightness-90' : 'cursor-not-allowed'}
        transition-all duration-200
      `}
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-lg font-bold">
        {number}
      </span>
    </button>
  );
};