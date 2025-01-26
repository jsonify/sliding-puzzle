import React from 'react';

interface TileProps {
  id: number;
  color: string;
  onClick: (id: number) => void;
}

const Tile: React.FC<TileProps> = ({ id, color, onClick }) => {
  return (
    <div
      className="w-16 h-16 rounded cursor-pointer transition-all duration-200"
      style={{ backgroundColor: color }}
      onClick={() => onClick(id)}
    />
  );
};

export default Tile;
