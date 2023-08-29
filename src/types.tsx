export type Cell = {
  x: number;
  y: number;
  isMine: boolean;
  neighbours: number;
  isRevealed: boolean;
  isEmpty: boolean;
  isFlagged: boolean;
  onClick?: any;
};
