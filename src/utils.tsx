// Calcola quante celle NON revealed sono rimaste nel campo
export const getCellsLeft = (prevBattlefield: any) => {
  let cellsLeft: any[] = [];

  prevBattlefield.map((row: any[]) => {
    row.map((cell) => {
      if (!cell.isRevealed) {
        cellsLeft.push(cell);
      }
    });
  });

  return cellsLeft;
};

// In base al size (e quindi alla dimensione del campo), mi genera un numero per pickare una row o una col casuale
export const getRandomNumber = (size: number) => {
  return Math.floor(Math.random() * size);
};

// Const di utility per i vicini
export const nearTiles: any[][] = [
  [-1, 0], //Up
  [0, -1], //Left
  [1, 0], // Down
  [0, 1], // Right
  [-1, -1], // Up Left
  [-1, 1], // Up Right
  [1, -1], // Down Left
  [1, 1], // Down Right
];
