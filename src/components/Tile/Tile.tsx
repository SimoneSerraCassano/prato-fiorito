import "./Tile.css";
import { Cell } from "../../types";

const Tile = ({
  x,
  y,
  isRevealed,
  isMine,
  nearbyBombs,
  isFlagged,
  onClick,
}: Cell) => {
  const getColor = () => {
    switch (nearbyBombs) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "red";
      case 4:
        return "dark blue";
      case 5:
        return "brown";
      case 6:
        return "Cyan";
      case 7:
        return "Black";
      case 8:
        return "Grey";
    }
  };

  const flaggedStyle = { display: isFlagged ? "block" : "none" };
  const revealedStyle = {
    display: isRevealed ? "block" : "none",
    color: getColor(),
  };

  const revealedContent = isMine ? "💣" : nearbyBombs > 0 ? nearbyBombs : null;

  return (
    <div
      className={"Tile " + (isRevealed ? "clicked" : "light-on-top")}
      onClick={(e) => onClick(x, y, e)}
      onContextMenu={(e) => onClick(x, y, e)}
    >
      {/* Se ho flaggato */}
      <div style={flaggedStyle}>🚩</div>

      {/* Se ho cliccato */}
      <div style={revealedStyle}>{revealedContent}</div>
    </div>
  );
};

export default Tile;
