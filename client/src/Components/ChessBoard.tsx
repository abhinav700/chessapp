import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
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
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [to, setTo] = useState<Square | null>(null)
  const [promotingTo, setPromotingTo] = useState<null | string>(null)
  const promotionOptions = ['q', 'r', 'b', 'n']
  const promotionOptionsImages = promotionOptions.map((type) => {
    const color = myColor === "black" ? "b" : 'w';
    const piece = `${color}${type}`;
    return (
      <img
        className="lg:w-14 w-11 my-3 mx-1 cursor-pointer hover:opacity-70"
        src={`/images/${piece}.png`}
        onClick={(e)=>{setPromotingTo(promotingTo =>type)}}
      />
    )
  })
  useEffect(() => {
    setIsFlipped(isFlipped => myColor === "black");
  }, [myColor])

  useEffect(() => {
    if (promotingTo) {
      const move = { from: from!, to: to!, promotion: promotingTo! };
      updateBoardAfterMove(move)
      setShowPromotionModal(showPromotionModal => false);
    }
  }, [promotingTo])


  const updateBoardAfterMove = (move: { from: Square; to: Square, promotion?: string }) => {
    chess.move(move);
    const mess = JSON.stringify({
      type: MAKE_MOVE,
      payload: {
        move
      },
    });
    setBoard(chess.board());
    playSound(moveSelfAudio);
    socket.send(mess);
    setFrom(null);
  }
  const makeMoveHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    squareRepresentation: Square | null
  ) => {
    if (!from) {
      setFrom((from) => squareRepresentation);
    } else {
      let move;
      setTo(to => squareRepresentation)
      if (!isPromoting(squareRepresentation!, from, chess)) {
        move = { from: from!, to: squareRepresentation! };
        updateBoardAfterMove(move);

      }
 
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
    setShowPromotionModal(showPromotionModal => true);
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
{
  showPromotionModal&&<div className="flex flex-col items-center w-[240px] h-[200px] bg-slate-500 relative rounded-lg top-[155px] lg:top-[160px] left-[125px] lg:left-[135px]">
        <h1 className="text-xl"> Pawn Promotion</h1>
        <div className="flex flex-wrap w-[140px] justify-center items-center">
          {promotionOptionsImages}
        </div>
      </div>
}
      
      <div className={`text-white ${showPromotionModal ? 'mt-[-200px]' : ""}`}>
        <h1>{myColor}</h1>
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
                    onClick={(e) => makeMoveHandler(e, squareRepresentation)}
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
