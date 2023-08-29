export type Cell = {
  x: number;
  y: number;
  isRevealed: boolean;
  isMine: boolean;
  nearbyBombs: number;
  isFlagged: boolean;
  onClick?: any;
};

export enum GameStatus {
  inGioco,
  vinto,
  perso,
}
