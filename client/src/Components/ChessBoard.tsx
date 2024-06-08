import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { MAKE_MOVE } from "../messages";
import moveSelfAudio from "../assets/sounds/move-self.mp3";
import { playSound } from "../utils/playSound";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom } from "../state/atoms/Chessboard";
import illegalMoveSound from "../assets/sounds/illegal-move.mp3"
import usePawnPromotion from "../hooks/usePawnPromotion";
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


const ChessBoard = ({ chess, board, setBoard, socket, myColor }: ChessBoardProps) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom);
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [to, setTo] = useState<Square | null>(null)
  const { promotionOptionsImages, isPromoting } = usePawnPromotion({ myColor, from, to, updateBoardAfterMove, setShowPromotionModal, chess })
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  useEffect(() => {
    setLegalMoves(legalMoves => from != null ? chess.moves({ square: from }) : []);
  }, [from])


  const isThisLegalSquare = (square: Square) => {
    if (legalMoves.length == 0)
      return false;
    let ans = false;
    legalMoves.map((it) => {
      if (it.includes(square))
        ans = true;
    })
    if (ans)
      console.log(square);

    return ans;
  }

  useEffect(() => {
    setIsFlipped(isFlipped => myColor === "black");
  }, [myColor])

  const isMyTurn = () => {
    let movesCount = chess.history().length;
    if (myColor == 'white')
      return movesCount % 2 == 0;
    else if (myColor == 'black')
      return movesCount % 2 == 1;
  }

  const isLegalMove = (move: { from: Square; to: Square, promotion?: string }) => {
    return chess
      .moves({ square: move.from, verbose: true })
      .map((it: any) => it.to)
      .includes(move.to);
  }

  function updateBoardAfterMove(move: { from: Square; to: Square, promotion?: string }) {
    if (isLegalMove(move)) {
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
    }
    else
      playSound(illegalMoveSound)
    setFrom(from => null);
    setTo(to => null)
  }

  const makeMoveHandler = (

    squareRepresentation: Square | null, square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    if (!from) {
      setFrom((from) => squareRepresentation);
    }
    else {
      if(from == squareRepresentation && square ){
        setFrom(from => null)
        return;
      }

      if (square != null && myColor && square.color == myColor[0]) {
        setFrom(from => squareRepresentation);
        return;
      }

      else if (square != null && myColor === null) {
        setFrom(from => squareRepresentation);
        return;
      }

      let move;
      setTo(to => squareRepresentation)
      if (!isPromoting(squareRepresentation!, from, chess)) {
        move = { from: from!, to: squareRepresentation! };
        console.log(move)
        updateBoardAfterMove(move);

      }
    }
  };



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
              className="lg:w-14 w-11 my-auto "
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
        showPromotionModal && <div className="flex flex-col items-center w-[240px] h-[200px] bg-slate-500 relative rounded-lg top-[155px] lg:top-[160px] left-[125px] lg:left-[135px]">
          <h1 className="text-xl"> Pawn Promotion</h1>
          <div className="flex flex-wrap w-[140px] justify-center items-center">
            {promotionOptionsImages}
          </div>
        </div>
      }

      <div className={`text-white ${showPromotionModal ? 'mt-[-200px]' : ""}`}>
        {myColor && <h1>{isMyTurn() ? "Your Turn" : "Opponent's Turn"}</h1>}
        {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
          i = isFlipped ? i + 1 : 8 - i
          return (
            <div key={i} className="flex ">
              {(isFlipped ? row.slice().reverse() : row).map((square, j) => {
                j = isFlipped ? 8 - j : j + 1
                const squareRepresentation = (String.fromCharCode(97 + j - 1) +
                  "" +
                  (i)) as Square;
                // console.log(squareRepresentation)
                return (
                  <div
                    key={j}
                    className={`text-black relative flex justify-center items-center ${isThisLegalSquare(squareRepresentation) ? ((i + j) % 2 == 0 ? "bg-slate-600" : "bg-slate-500") : ((i + j) % 2 == 0 ? "bg-green-800" : "bg-white")} flex w-16 h-16`}
                    onClick={(e) => makeMoveHandler(squareRepresentation, square)}
                  >


                    {((!isFlipped && j == 1) || (isFlipped && j == 8)) ? (
                      <p className="absolute left-[3px] top-[1px]"> {i} </p>
                    ) : null}

                    {displayPiece(square)}
                    {((!isFlipped && i == 1) || (isFlipped && i == 8)) ? (
                      <p className="absolute top-[42px]  right-[3px]">
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
