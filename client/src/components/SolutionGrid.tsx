import React from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';

interface SolutionGridProps {
  size: number;
  colors: string[];
  seed?: number;
}

const SolutionGrid: React.FC<SolutionGridProps> = ({ size, colors, seed }) => {
  const sequence = seed ? generateSolvablePuzzle(size, seed) : Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  const board = Array(size).fill(null).map((_, row) =>
    Array(size).fill(null).map((_, col) => {
      const position = row * size + col;
      if (position === size * size - 1) {
        return { number: null, color: null, isEmpty: true };
      }
      const num = sequence[position];
      const colorIndex = Math.floor((num - 1) / 4);
      return {
        number: row * size + col + 1,
        color: colors[colorIndex],
        isEmpty: false
      };
    })
  );

  return (
    <div className="w-[250px] h-[250px] bg-gray-100 p-3 rounded-xl">
      <div className="grid grid-rows-5 h-full">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-1">
            {row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-full h-full rounded-lg flex items-center justify-center
                  text-white text-sm font-bold
                  ${tile.isEmpty ? 'bg-gray-300' : ''}
                `}
                style={{ backgroundColor: tile.isEmpty ? undefined : tile.color }}
              >
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionGrid;
