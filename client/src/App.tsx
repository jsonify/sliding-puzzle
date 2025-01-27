import React from 'react';
import { Board } from './components/Board/Board';

export default function GameTest() {
  const handleGameComplete = () => {
    console.log('Game completed!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Sliding Puzzle</h1>
        <Board 
          gameId="test-game" 
          isActive={true}
          onGameComplete={handleGameComplete}
        />
      </div>
    </div>
  );
}