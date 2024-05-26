import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { MAKE_MOVE } from "../messages";
import moveSelfAudio  from "../assets/sounds/move-self.mp3"
import { playSound } from "../utils/playSound";

type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: any;
  setBoard: any;
};


console.log(moveSelfAudio)
const ChessBoard = ({ chess, board, setBoard, socket }: ChessBoardProps) => {
  
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  
   
  
  const onClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    squareRepresentation: Square | null
  ) => {
    if (!from) {
      setFrom((from) => squareRepresentation);
      console.log("Entering if statement : ", { from, to });
    } else {
      setTo((to) => squareRepresentation);
      chess.move({ from: from, to: squareRepresentation });
      setBoard(chess.board());
      playSound(moveSelfAudio)
      const mess = JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move: {
            from: from,
            to: squareRepresentation,
          },
        },
      });
      console.log(mess);
      socket.send(mess);
      setFrom(null);
    }
  };
  const displayCharacter = (square: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null) => {
    {
      const piece = `${square?.color}${square?.type}`
      return square ? <img className="w-24" src={`/images/${piece}.png`} /> : "";
    }
  };
  return (
    <div className="text-white">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  key={j}
                  className={`w-24 h-24 ${
                    (i + j) % 2 == 0 ? "bg-green-800" : "bg-white text-black"
                  } flex items-center justify-center`}
                  onClick={(e) => onClickHandler(e, squareRepresentation)}
                >
                  {displayCharacter(square)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
