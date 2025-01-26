// Game.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board/Board';
import { socket } from '../services/socket';

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!gameId) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    socket.on('gameComplete', () => {
      setIsActive(false);
      clearInterval(timer);
    });

    return () => {
      clearInterval(timer);
      socket.off('gameComplete');
    };
  }, [gameId, navigate]);

  const handleGameComplete = () => {
    socket.emit('gameComplete', { gameId });
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sliding Puzzle</h1>
          <div className="text-xl font-mono">
            Time: {formatTime(timeElapsed)}
          </div>
        </div>
        
        {gameId && (
          <Board
            gameId={gameId}
            isActive={isActive}
            onGameComplete={handleGameComplete}
          />
        )}
        
        {!isActive && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-green-600">
              Puzzle Completed!
            </h2>
            <p className="mt-2">
              Time: {formatTime(timeElapsed)}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;