export interface BoardState {
  tiles: number[][];
  emptyPosition: [number, number];
}

export interface Move {
  tileId: number;
  from: [number, number];
  to: [number, number];
}
