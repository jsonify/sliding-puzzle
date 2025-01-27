import React, { useMemo } from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';

interface SolutionGridProps {
  size: number;
  colors: string[];
  seed?: number;
}

const SolutionGrid: React.FC<SolutionGridProps> = ({ size, colors, seed }) => {
  const board = useMemo(() => {
    const sequence = generateSolvablePuzzle(size, seed || Math.floor(Math.random() * 1000000));
    return Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => {
        const position = row * size + col;
        if (position === size * size - 1) {
          return { number: null, color: null, isEmpty: true };
        }
        const num = sequence[position];
        return {
          number: num,
          color: colors[Math.floor((num - 1) / 4)],
          isEmpty: false
        };
      })
    );
  }, [seed, size, colors]);

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
                style={{ backgroundColor: tile.color }}
              >
                {/* {tile.number} */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionGrid;
