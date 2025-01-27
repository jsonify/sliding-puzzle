import React from 'react';

interface SolutionGridProps {
  size: number;
  colors: string[];
}

const SolutionGrid: React.FC<SolutionGridProps> = ({ size, colors }) => {
  const board = Array(size).fill(null).map((_, row) =>
    Array(size).fill(null).map((_, col) => {
      const number = row * size + col + 1;
      if (row === size - 1 && col === size - 1) {
        return { number: null, color: null, isEmpty: true };
      }
      return {
        number,
        color: colors[Math.floor((number - 1) / 4)],
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
                {tile.number}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionGrid;
