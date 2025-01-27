// client/src/components/Board/types.ts
export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface Tile {
  color: string;
  number: number;
  isEmpty: boolean;
}

export type BoardState = Tile[][];
