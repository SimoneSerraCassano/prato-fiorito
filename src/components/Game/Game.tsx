import React, { useEffect, useState } from "react";
import Battlefield from "../Battlefield/Battlefield";
import "../Game/Game.css";

type Props = {};

function Game({}: Props) {
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState("boh");
  const [timer, setTimer] = useState<number>(0);
  const [numOfBombs, setNumOfBombs] = useState(10);
  const [matchNumber, setMatchNumber] = useState(1);

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

  useEffect(() => {
    if (gameStatus === "perso") alert("Hai perso");
    if (gameStatus === "vinto") alert("Hai vinto!");
  }, [gameStatus]);
  // const toggleTimer = () => {
  //   setIsGameRunning(!isGameStarted);
  // };

  const checkMatchStatus = (
    isRunning: boolean,
    result: "boh" | "vinto" | "perso",
    remainingBombs: number
  ) => {
    setIsGameRunning(isRunning);
    setGameStatus(result);
  };

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
