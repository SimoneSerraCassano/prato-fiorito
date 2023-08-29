import { useEffect, useState } from "react";
import Tile from "../Tile/Tile";
import "./Battlefield.css";
import { getCellsLeft, getRandomNumber, nearTiles } from "../../utils";
import { Cell, GameStatus } from "../../types";

type Props = {
  size: number;
  numOfBombs: number;
  onUpdate: any;
  matchNumber: number;
};

function Battlefield({ size, numOfBombs, onUpdate, matchNumber }: Props) {
  const [battlefield, setBattlefield] = useState<any>([]);

  // Genero il battlefield + le bombe per ogni nuovo match
  useEffect(() => {
    let newBattlefield = generateEmptyBattlefield(size);
    newBattlefield = addBombs(newBattlefield, numOfBombs);
    setBattlefield(newBattlefield);
  }, [matchNumber]);

  // Genero il campo di battaglia vuoto, senza bombe né vicini
  const generateEmptyBattlefield = (size: number) => {
    const newBattlefield: Cell[][] = [];
    for (let i = 0; i < size; i++) {
      newBattlefield.push([]);
      for (let j = 0; j < size; j++) {
        newBattlefield[i][j] = {
          x: i,
          y: j,
          isMine: false,
          nearbyBombs: 0,
          isRevealed: false,
          isFlagged: false,
        };
      }
    }
    return newBattlefield;
  };

  // Aggiungo un numOfBombs di bombe al Battefield, e aumento di 1 il conteggio per ogni cella vicina
  const addBombs = (prevBattlefield: any, numOfBombs: number) => {
    const newBattlefield = prevBattlefield;
    let bombsAdded = 0;
    while (bombsAdded < numOfBombs) {
      const row = getRandomNumber(size);
      const col = getRandomNumber(size);

      if (!newBattlefield[row][col].isMine) {
        newBattlefield[row][col].isMine = true;

        bombsAdded++;

        const neighbours = getNeighbours(row, col, newBattlefield);
        for (let i = 0; i < neighbours.length; i++) {
          newBattlefield[neighbours[i].x][neighbours[i].y].nearbyBombs++;
        }
      }
    }
    return newBattlefield;
  };

  // Date delle coordinate x e y di una cell, faccio il return di un array contenente tutti i suoi vicini
  const getNeighbours = (x: number, y: number, prevBattlefield: any) => {
    const neighbours = [];

    for (let i = 0; i < nearTiles.length; i++) {
      const nearRow = x + nearTiles[i][0];
      const nearCol = y + nearTiles[i][1];

      if (prevBattlefield[nearRow] && prevBattlefield[nearRow][nearCol]) {
        neighbours.push(prevBattlefield[nearRow][nearCol]);
      }
    }

    return neighbours;
  };

  // Mostro tutti i vicini vuoti, e per ognuno ripeto la funzione
  const showNearbyEmptyTiles = (x: any, y: any, prevBattlefield: any) => {
    let newBattlefield = prevBattlefield.slice();
    let vicini = getNeighbours(x, y, prevBattlefield);
    vicini.map((vicino) => {
      if (
        !vicino.isFlagged &&
        !vicino.isRevealed &&
        (vicino.nearbyBombs === 0 || !vicino.isMine)
      ) {
        newBattlefield[vicino.x][vicino.y].isRevealed = true;
        if (vicino.nearbyBombs === 0) {
          showNearbyEmptyTiles(vicino.x, vicino.y, prevBattlefield);
        }
      }
    });
    return newBattlefield;
  };

  // La funzione del Click. Se la cella non è visibile, la rendo visibile. Se è una bomba, hai perso.
  // Se è una cella vuota (0 bombe attorno), mostro i vicini
  const handleClick = (x: number, y: number, e: any) => {
    onUpdate(true, GameStatus.inGioco);
    e.preventDefault();
    // Se è revealed non procedo
    if (battlefield[x][y].isRevealed === true) return;

    // Clic col tatso sinistro, verifico le varie condizioni
    if (e.type === "click" && battlefield[x][y].isFlagged === false) {
      revealTile(x, y);

      let newBattlefield = battlefield.slice();

      // Se non ci sono più celle rimanenti, ho vinto
      if (getCellsLeft(newBattlefield).length === numOfBombs) {
        revealBattlefield(newBattlefield);
        onUpdate(false, GameStatus.vinto);
        // Se ho preso una mina, ho perso
      } else if (newBattlefield[x][y].isMine) {
        revealBattlefield(newBattlefield);
        onUpdate(false, GameStatus.perso);
        // Propago lo showNearbyEmptyTiles se la tile cliccata è vuota
      } else if (newBattlefield[x][y].nearbyBombs === 0) {
        newBattlefield = showNearbyEmptyTiles(x, y, newBattlefield);
        setBattlefield(newBattlefield);
      }
      // Clic col tsto destro, metto la bandierina
    } else if (e.type === "contextmenu") {
      let newBattlefield = battlefield.slice();
      newBattlefield[x][y].isFlagged = !newBattlefield[x][y].isFlagged;
      setBattlefield(newBattlefield);
    }
  };

  // Mostro la singola tile
  const revealTile = (x: number, y: number) => {
    let newBattlefield = battlefield.slice();
    newBattlefield[x][y].isRevealed = true;
    setBattlefield(newBattlefield);
  };

  // Scopro tutto il battlefield
  const revealBattlefield = (prevBattlefield: any) => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        battlefield[i][j].isFlagged = false;
        revealTile(battlefield[i][j].x, battlefield[i][j].y);
      }
    }
  };

  return (
    <div className="Battlefield shadow-on-top">
      {battlefield.map((row: any, x: any) => (
        <div className="row" key={x}>
          {row.map((cell: any, y: any) => (
            <Tile
              key={(cell.x, cell.y)}
              x={cell.x}
              y={cell.y}
              isRevealed={row[y].isRevealed}
              isMine={cell.isMine}
              nearbyBombs={cell.nearbyBombs}
              isFlagged={cell.isFlagged}
              onClick={handleClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Battlefield;
