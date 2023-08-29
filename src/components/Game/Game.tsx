import React, { useEffect, useState } from "react";
import Battlefield from "../Battlefield/Battlefield";
import "../Game/Game.css";
import { GameResult } from "../../types";

type Props = {};

function Game({}: Props) {
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [matchNumber, setMatchNumber] = useState(1);

  const numOfBombs = 10;

  // Il timer runna se il match è partito
  useEffect(() => {
    if (isGameRunning) {
      const id = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [isGameRunning]);

  // Resto aggiornato sull'esito del match
  const checkMatchStatus = (isRunning: boolean, result: GameResult) => {
    setIsGameRunning(isRunning);
    if (result === "perso") alert("Hai perso");
    if (result === "vinto") alert("Hai vinto!");
  };

  // Reset del match (il matchNumber è o'cess però al momento non saprei in che altro modo passare a un nuovo match)
  const resetMatch = () => {
    setMatchNumber((prev) => prev + 1);
    setTimer(0);
    setIsGameRunning(false);
  };

  return (
    <div className="Board light-on-top">
      <div className="Settings shadow-on-top">
        <div className="Display">
          <div className="Seconds text-settings">{timer}</div>
        </div>
        <button className="button light-on-top" onClick={resetMatch}>
          😊
        </button>
        <div className="Display">
          <div className="Bombs text-settings">{numOfBombs}</div>
        </div>
      </div>
      <Battlefield
        size={9}
        numOfBombs={numOfBombs}
        onUpdate={checkMatchStatus}
        matchNumber={matchNumber}
      />
    </div>
  );
}

export default Game;
