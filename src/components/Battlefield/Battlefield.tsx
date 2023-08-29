import React, { useEffect, useState } from "react";
import Tile from "../Tile/Tile";
import "./Battlefield.css";
import { getCellsLeft, getRandomNumber, nearTiles } from "../../utils";
import { Cell } from "../../types";

type Props = {
  size: number;
  numOfBombs: number;
  onUpdate: any;
  matchNumber: number;
};

function Battlefield({ size, numOfBombs, onUpdate, matchNumber }: Props) {
  const [battlefield, setBattlefield] = useState<any>([]);

  useEffect(() => {
    startBattlefield(size, 10);
  }, [size, matchNumber]);

  // La funzione per inizializzare tutto il Battlefield, mettendo insieme tutti i vari step
  const startBattlefield = (size: number, numOfBombs: number) => {
    let newBattlefield = generateEmptyBattlefield(size);
    newBattlefield = addBombs(newBattlefield, numOfBombs);
    setBattlefield(newBattlefield);
  };

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
          neighbours: 0,
          isRevealed: false,
          isEmpty: true,
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
        newBattlefield[row][col].isEmpty = false;

        bombsAdded++;

        const neighbours = getNeighbours(row, col, newBattlefield);
        for (let i = 0; i < neighbours.length; i++) {
          newBattlefield[neighbours[i].x][neighbours[i].y].neighbours++;
          newBattlefield[neighbours[i].x][neighbours[i].y].isEmpty = false;
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
        (vicino.isEmpty || !vicino.isMine)
      ) {
        newBattlefield[vicino.x][vicino.y].isRevealed = true;
        if (vicino.isEmpty) {
          showNearbyEmptyTiles(vicino.x, vicino.y, prevBattlefield);
        }
      }
    });
    return newBattlefield;
  };

  // La funzione del Click. Se la cella non è visibile, la rendo visibile. Se è una bomba, hai perso.
  // Se è una cella vuota (0 bombe attorno), mostro i vicini
  const handleClick = (x: number, y: number, e: any) => {
    onUpdate(true, "boh");

    e.preventDefault();

    if (battlefield[x][y].isRevealed === false) {
      if (e.type === "click" && battlefield[x][y].isFlagged === false) {
        revealTile(x, y);

        let newBattlefield = battlefield.slice();
        if (newBattlefield[x][y].isEmpty) {
          newBattlefield = showNearbyEmptyTiles(x, y, newBattlefield);
          setBattlefield(newBattlefield);
        }

        if (newBattlefield[x][y].isMine) {
          revealBattlefield(newBattlefield);
          onUpdate(false, "perso");
        }

        if (getCellsLeft(newBattlefield).length === numOfBombs) {
          revealBattlefield(newBattlefield);
          onUpdate(false, "vinto");
        }
      } else {
        if (e.type === "contextmenu") {
          let newBattlefield = battlefield.slice();
          newBattlefield[x][y].isFlagged = !newBattlefield[x][y].isFlagged;
          setBattlefield(newBattlefield);
        }
      }
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
              neighbours={cell.neighbours}
              isEmpty={cell.isEmpty}
              onClick={handleClick}
              isFlagged={cell.isFlagged}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Battlefield;
