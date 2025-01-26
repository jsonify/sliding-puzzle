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
