// src/components/SolutionGrid.tsx
import React, { useMemo } from 'react';
import { generateSolvablePuzzle } from '../utils/puzzleUtils';
import { PredefinedPuzzle } from '../data/predefinedPuzzles';

interface SolutionGridProps {
  size: number;
  colors: string[];
  seed?: number;
  predefinedPuzzle?: PredefinedPuzzle;
}

const SolutionGrid: React.FC<SolutionGridProps> = ({ 
  size, 
  colors, 
  seed, 
  predefinedPuzzle 
}) => {
  const board = useMemo(() => {
    if (predefinedPuzzle) {
      // Use predefined puzzle pattern
      return predefinedPuzzle.pattern.map((row, rowIndex) =>
        row.map((colorIndex, colIndex) => ({
          number: colorIndex,
          color: colorIndex === 0 ? null : colors[colorIndex - 1],
          isEmpty: colorIndex === 0
        }))
      );
    } else {
      // Use randomly generated sequence
      const sequence = seed 
        ? generateSolvablePuzzle(size, seed)
        : Array.from({ length: size * size - 1 }, (_, i) => i + 1);
      
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
    }
  }, [size, colors, seed, predefinedPuzzle]);

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
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionGrid;