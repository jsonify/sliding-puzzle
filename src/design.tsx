import React from 'react';
import { Timer, Star } from 'lucide-react';

// src/components/game/GameLayout.tsx
const GameLayout = () => {
  // Mock data for demonstration
  const score = 60;
  const target = 100000;

  return (
    <div className="w-full h-screen bg-teal-100">
      {/* Top status bar */}
      <div className="w-full bg-teal-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span>{score}</span>
          <Star size={20} className="text-yellow-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Timer size={20} />
          <span>{target}</span>
        </div>
      </div>

      {/* Solution display area */}
      <div className="w-full p-4 flex justify-center">
        <div className="w-16 h-16 bg-purple-500 rounded-lg"></div>
      </div>

      {/* Grid container */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {Array(25).fill(null).map((_, index) => (
            <div 
              key={index}
              className="aspect-square bg-teal-500 rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Bottom character area */}
      <div className="fixed bottom-0 w-full p-4 flex justify-between items-end">
        <div className="w-24 h-24 bg-blue-400 rounded-full" />
        <div className="flex space-x-2">
          {/* Power-ups or game controls */}
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="w-12 h-12 bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;