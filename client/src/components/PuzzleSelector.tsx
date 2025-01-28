import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { predefinedPuzzles, PredefinedPuzzle } from '../data/predefinedPuzzles';

interface PuzzleSelectorProps {
  onSelectPuzzle: (puzzle: PredefinedPuzzle) => void;
}

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({ onSelectPuzzle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {predefinedPuzzles.map((puzzle) => (
        <Card 
          key={puzzle.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectPuzzle(puzzle)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-bold">{puzzle.name}</h3>
              <div className="text-sm text-gray-500">
                {puzzle.category} • {puzzle.difficulty}
              </div>
              {puzzle.description && (
                <p className="text-sm text-gray-600">{puzzle.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PuzzleSelector;
