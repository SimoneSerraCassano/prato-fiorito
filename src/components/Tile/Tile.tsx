import "./Tile.css";
import { Cell } from "../../types";

const Tile = ({
  isMine,
  neighbours,
  isRevealed,
  isEmpty,
  isFlagged,
  x,
  y,
  onClick,
}: Cell) => {
  const getColor = () => {
    switch (neighbours) {
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

  return (
    <div
      className={"Tile " + (isRevealed ? "clicked" : "light-on-top")}
      onClick={(e) => onClick(x, y, e)}
      onContextMenu={(e) => onClick(x, y, e)}
    >
      {/* Se ho flaggato */}
      <div style={{ display: isFlagged ? "block" : "none" }}>🚩</div>

      {/* Se ho cliccato */}
      <div
        style={{ display: isRevealed ? "block" : "none", color: getColor() }}
      >
        {isMine ? "💣" : neighbours > 0 ? neighbours : null}
      </div>
    </div>
  );
};

export default Tile;
