import { useEffect, useState } from "react";
import Battlefield from "../Battlefield/Battlefield";
import "../Game/Game.css";
import { GameStatus } from "../../types";

function Game({}) {
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [matchNumber, setMatchNumber] = useState(1);
  const [emoji, setEmoji] = useState("😊");

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
  const checkMatchStatus = (isRunning: boolean, result: GameStatus) => {
    setIsGameRunning(isRunning);
    if (result === GameStatus.perso) {
      setEmoji("🤯");
      setTimeout(function () {
        alert("Hai perso");
      }, 200);
    }
    if (result === GameStatus.vinto) {
      setEmoji("😎");
      setTimeout(function () {
        alert("Hai vinto!");
      }, 200);
    }
  };

  // Reset del match (il matchNumber è o'cess però al momento non saprei in che altro modo passare a un nuovo match)
  const resetMatch = () => {
    setEmoji("😊");
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
          {emoji}
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
