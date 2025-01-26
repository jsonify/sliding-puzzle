# Create client directory structure
mkdir -p client/src/{components/{Board,Leaderboard,Auth},pages,hooks,services,utils,types}

# Create server directory structure
mkdir -p server/src/{config,controllers,models,routes,services,utils,types,socket}

# Create client files
## Components
cat > client/src/components/Board/Board.tsx << 'EOL'
import React from 'react';
import { Tile } from './Tile';
import { useGame } from '../../hooks/useGame';
import type { BoardState, Move } from './types';

interface BoardProps {
  gameId: string;
  isActive: boolean;
}

const Board: React.FC<BoardProps> = ({ gameId, isActive }) => {
  const { boardState, makeMove, isValidMove } = useGame(gameId);

  const handleTileClick = (tileId: number) => {
    // TODO: Implement move validation and state updates
  };

  return (
    <div className="grid grid-cols-5 gap-1 bg-gray-200 p-4 rounded-lg">
      {/* TODO: Implement grid rendering */}
    </div>
  );
};

export default Board;
EOL

cat > client/src/components/Board/Tile.tsx << 'EOL'
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
EOL

cat > client/src/components/Board/types.ts << 'EOL'
export interface BoardState {
  tiles: number[][];
  emptyPosition: [number, number];
}

export interface Move {
  tileId: number;
  from: [number, number];
  to: [number, number];
}
EOL

## Hooks
cat > client/src/hooks/useGame.ts << 'EOL'
import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import type { BoardState, Move } from '../components/Board/types';

export const useGame = (gameId: string) => {
  const [boardState, setBoardState] = useState<BoardState | null>(null);

  useEffect(() => {
    // TODO: Implement socket connection and game state sync
  }, [gameId]);

  const makeMove = (move: Move) => {
    // TODO: Implement move logic
  };

  const isValidMove = (move: Move): boolean => {
    // TODO: Implement move validation
    return false;
  };

  return { boardState, makeMove, isValidMove };
};
EOL

## Services
cat > client/src/services/socket.ts << 'EOL'
import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_WS_URL || "ws://localhost:3001");
EOL

cat > client/src/services/api.ts << 'EOL'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  // TODO: Implement API methods
};
EOL

# Create server files
## Config
cat > server/src/config/database.ts << 'EOL'
import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});
EOL

cat > server/src/config/redis.ts << 'EOL'
import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
EOL

## Controllers
cat > server/src/controllers/gameController.ts << 'EOL'
import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

export class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  async createGame(req: Request, res: Response) {
    // TODO: Implement game creation
  }

  async processMove(req: Request, res: Response) {
    // TODO: Implement move processing
  }
}
EOL

## Models
cat > server/src/models/Match.ts << 'EOL'
export interface Match {
  id: string;
  puzzle_id: string;
  winner_id: string;
  completion_time: number;
  created_at: Date;
}
EOL

## Types
cat > server/src/types/index.ts << 'EOL'
export interface GameState {
  id: string;
  board: number[][];
  players: Player[];
  currentTurn: string;
  status: 'waiting' | 'active' | 'completed';
}

export interface Player {
  id: string;
  username: string;
}

export interface Move {
  gameId: string;
  playerId: string;
  from: [number, number];
  to: [number, number];
}
EOL

# Create configuration files
cat > .gitignore << 'EOL'
node_modules/
dist/
build/
.env
.env.local
.DS_Store
*.log
EOL

cat > client/tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "."
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

cat > client/tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

cat > server/tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

cat > .env.example << 'EOL'
# Server
PORT=3001
NODE_ENV=development

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sliding_puzzle

# Redis
REDIS_URL=redis://localhost:6379

# Client
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
EOL
