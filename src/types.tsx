export type Cell = {
  x: number;
  y: number;
  isMine: boolean;
  neighbours: number;
  isRevealed: boolean;
  isFlagged: boolean;
  onClick?: any;
};

export type GameResult = "boh" | "vinto" | "perso";
