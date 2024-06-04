import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { MAKE_MOVE } from "../messages";
import moveSelfAudio from "../assets/sounds/move-self.mp3";
import { playSound } from "../utils/playSound";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom } from "../state/atoms/Chessboard";

type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: any;
  setBoard: any;
  myColor: string | null;
};

console.log(moveSelfAudio);

const ChessBoard = ({ chess, board, setBoard, socket, myColor }: ChessBoardProps) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom);
  useEffect(() => {
    setIsFlipped(isFlipped => myColor === "black");
  }, [myColor])
  const onClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    squareRepresentation: Square | null
  ) => {
    if (!from) {
      setFrom((from) => squareRepresentation);
    } else {
      let move;
      if(isPromoting(squareRepresentation!, from, chess)){
        move =  {from, to: squareRepresentation,promotion:"q" }
        chess.move(move);
      }
      else{
        move = {from, to:squareRepresentation};
        chess.move(move);
      }
      setBoard(chess.board());
      playSound(moveSelfAudio);
      const mess = JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move
        },
      });
      console.log(mess);
      socket.send(mess);
      setFrom(null);
    }
  };

  const isPromoting = (to: Square, from: Square, chess: Chess) => {
    if (!from)
      return false;
    const piece = chess.get(from);
    if (piece.type != 'p')
      return false;
    if (to[1] != '1' && to[1] != '8')
      return false;

    return true;

  }
  const displayPiece = (
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    {
      const piece = `${square?.color}${square?.type}`;
      return (
        <>
          {square ? (
            <img
              className="lg:w-14 w-11 my-auto"
              src={`/images/${piece}.png`}
            />
          ) : (
            ""
          )}
        </>
      );
    }
  };
  return (
    <>
      
    <div className="text-white">
      <h1>{myColor}</h1>
    z
      
      {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
        i = isFlipped ? i + 1 : 8 - i
        return (
          <div key={i} className="flex 	">
            {(isFlipped ? row.slice().reverse() : row).map((square, j) => {
              j = isFlipped ? 8 - j : j + 1
              const squareRepresentation = (String.fromCharCode(97 + j - 1) +
                "" +
                (i)) as Square;
              console.log(squareRepresentation)
              return (
                <div
                  key={j}
                  className={`text-black ${(i + j) % 2 == 0 ? "bg-green-800" : "bg-white"} flex w-16 h-16`}
                  onClick={(e) => onClickHandler(e, squareRepresentation)}
                >


                  {((!isFlipped && j == 1) || (isFlipped && j == 8)) ? (
                    <p className="relative  w-[1px] "> {i} </p>
                  ) : null}

                  {displayPiece(square)}
                  {((!isFlipped && i == 1) || (isFlipped && i == 8)) ? (
                    <p className="relative mt-[45px] w-[2px] right-2">
                      {
                        String.fromCharCode(97 + j - 1)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
    </>

  );
};

export default ChessBoard;
