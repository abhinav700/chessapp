import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import { MAKE_MOVE } from "../messages";
import moveSelfAudio from "../assets/sounds/move-self.mp3";
import { playSound } from "../utils/playSound";
import { useRecoilState } from "recoil";
import { isBoardFlippedAtom } from "../state/atoms/Chessboard";
import illegalMoveSound from "../assets/sounds/illegal-move.mp3";
import usePawnPromotion from "../hooks/usePawnPromotion";
type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  chess: Chess;
  setBoard: any;
  myColor: string | null;
  movesList: any;
  setMovesList: any;
};

const ChessBoard = ({
  chess,
  board,
  setBoard,
  socket,
  myColor,
  movesList,
  setMovesList,
}: ChessBoardProps) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [isFlipped, setIsFlipped] = useRecoilState(isBoardFlippedAtom);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [to, setTo] = useState<Square | null>(null);
  const { promotionOptionsImages, isPromoting } = usePawnPromotion({
    myColor,
    from,
    to,
    updateBoardAfterMove,
    setShowPromotionModal,
    chess,
  });
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const isKingSideCastlingLegal = () => {
    // check for castling only if its our turn and we have selected our king
    if (
      !(
        (chess.turn() == "w" && myColor == "white" && from == "e1") ||
        (chess.turn() == "b" && myColor == "black" && from == "e8")
      )
    )
      return false;

    if (chess.getCastlingRights(myColor![0] as any).k == false) return false;
    if (chess.inCheck()) return false;

    // If squares b/w rook and king are under attack by opponent
    const squaresBetween = myColor == "white" ? ["f1", "g1"] : ["f8", "g8"]; // squares between king and rook
    const opponentSide = myColor == "white" ? "b" : "w";

    let ans: boolean = true;
    squaresBetween.map((it) => {
      if (chess.isAttacked(it as any, opponentSide)) ans = false;
    });

    // if squares b/w rook and king are occupied by a piece
    const indexesToCheck =
      myColor == "white"
        ? [
            [7, 5],
            [7, 6],
          ]
        : [
            [0, 5],
            [0, 6],
          ];
    indexesToCheck.map((it) => {
      if (board[it[0]][it[1]]) ans = false;
    });

    return ans;
  };

  const isQueenSideCastlingLegal = () => {
    // check for castling only if its our turn and we have selected our king
    if (
      !(
        (chess.turn() == "w" && myColor == "white" && from == "e1") ||
        (chess.turn() == "b" && myColor == "black" && from == "e8")
      )
    )
      return false;

    if (chess.getCastlingRights(myColor![0] as any).q == false) return false;
    if (chess.inCheck()) return false;

    // If squares b/w rook and king are under attack by opponent
    const squaresBetween =
      myColor == "white" ? ["b1", "c1", "d1"] : ["b8", "c8", "d8"]; // squares between king and rook
    const opponentSide = myColor == "white" ? "b" : "w";

    let ans: boolean = true;
    squaresBetween.map((it) => {
      if (chess.isAttacked(it as any, opponentSide)) ans = false;
    });

    // if squares b/w rook and king are occupied by a piece
    const indexesToCheck =
      myColor == "white"
        ? [
            [7, 2],
            [7, 3],
          ]
        : [
            [0, 2],
            [0, 3],
          ];
    indexesToCheck.map((it) => {
      if (board[it[0]][it[1]]) ans = false;
    });

    return ans;
  };

  useEffect(() => {
    let arr: string[] = [];
    if (from != null) {
      arr = chess.moves({ square: from });

      if (isKingSideCastlingLegal()) {
        const squaresBetween = myColor == "white" ? ["f1", "g1"] : ["f8", "g8"]; // squares between king and rook
        squaresBetween.map((it) => {
          arr.push(it);
        });
      }

      if (isQueenSideCastlingLegal()) {
        // squares between king and rook
        const squaresBetween = myColor == "white" ? ["c1", "d1"] : ["c8", "d8"] 
        squaresBetween.map((it) => {
          arr.push(it);
        });
      }
    }
    setLegalMoves((legalMoves) => arr);
  }, [from]);

  const isThisLegalSquare = (square: Square) => {
    if (legalMoves.length == 0) return false;
    let ans = false;

    legalMoves.map((it) => {
      if (it.includes(square)) ans = true;
    });

    return ans;
  };

  useEffect(() => {
    setIsFlipped((isFlipped) => myColor === "black");
  }, [myColor]);

  const isMyTurn = () => {
    let movesCount = chess.history().length;
    if (myColor == "white") return movesCount % 2 == 0;
    else if (myColor == "black") return movesCount % 2 == 1;
  };

  const isLegalMove = (move: {
    from: Square;
    to: Square;
    promotion?: string;
  }) => {
    return chess
      .moves({ square: move.from, verbose: true })
      .map((it: any) => it.to)
      .includes(move.to);
  };

  function updateBoardAfterMove(move: {
    from: Square;
    to: Square;
    promotion?: string;
  }) {
    if (isLegalMove(move)) {
      chess.move(move);
      const mess = JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move,
        },
      });

      setBoard(chess.board());
      playSound(moveSelfAudio);
      setMovesList((movesList: any) => [...movesList, move]);
      socket.send(mess);
    } else playSound(illegalMoveSound);
    setFrom((from) => null);
    setTo((to) => null);
  }

  const makeMoveHandler = (
    squareRepresentation: Square | null,
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null
  ) => {
    if (!from) {
      setFrom((from) => squareRepresentation);
    } else {
      setShowPromotionModal(false)
      if (from == squareRepresentation && square) {
        setFrom((from) => null);
        return;
      }

      if (square != null && myColor && square.color == myColor[0]) {
        setFrom((from) => squareRepresentation);
        return;
      } else if (square != null && myColor === null) {
        setFrom((from) => squareRepresentation);
        return;
      }

      let move;
      setTo((to) => squareRepresentation);
      if (!isPromoting(squareRepresentation!, from, chess)) {
        setShowPromotionModal(false)
        move = { from: from!, to: squareRepresentation! };
        console.log(move);
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
              className="lg:w-14 w-10 my-auto "
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
      {/*Displaying promotion modal when pawn reaches last row */}
      {showPromotionModal && (
        <div className="flex flex-col z-10 items-center w-[240px] h-[200px] bg-slate-500 relative rounded-lg top-[155px] lg:top-[160px] left-[125px] lg:left-[135px]">
          <h1 className="text-xl"> Pawn Promotion</h1>
          <div className="flex flex-wrap w-[140px] justify-center items-center">
            {promotionOptionsImages}
          </div>
        </div>
      )}

      {/* Displaying the chessboard */}
      <div className="flex flex-row">
        <div
          className={`text-white ${showPromotionModal ? "mt-[-200px]" : ""}`}
        >
          {myColor && <h1>{isMyTurn() ? "Your Turn" : "Opponent's Turn"}</h1>}
          {(isFlipped ? board.slice().reverse() : board).map((row, i) => {
            i = isFlipped ? i + 1 : 8 - i;
            return (
              <div key={i} className="flex ">
                {(isFlipped ? row.slice().reverse() : row).map((square, j) => {
                  j = isFlipped ? 8 - j : j + 1;
                  const squareRepresentation = (String.fromCharCode(
                    97 + j - 1
                  ) +
                    "" +
                    i) as Square;
                  // console.log(squareRepresentation)
                  return (
                    <div
                      key={j}
                      className={`text-black relative flex justify-center items-center ${
                        isThisLegalSquare(squareRepresentation)
                          ? (i + j) % 2 == 0
                            ? "bg-slate-600"
                            : "bg-slate-500"
                          : (i + j) % 2 == 0
                          ? "bg-green-800"
                          : "bg-white"
                      } flex w-12 lg:w-16 h-14 lg:h-16`}
                      onClick={(e) =>
                        makeMoveHandler(squareRepresentation, square)
                      }
                    >
                      {(!isFlipped && j == 1) || (isFlipped && j == 8) ? (
                        <p className="absolute lg:left-[3px] left-[1px] top-[-1px] lg:top-[1px]">
                          {" "}
                          {i}{" "}
                        </p>
                      ) : null}

                      {displayPiece(square)}
                      {(!isFlipped && i == 1) || (isFlipped && i == 8) ? (
                        <p className="absolute lg:top-[42px] top-[38px]  right-[3px]">
                          {String.fromCharCode(97 + j - 1)}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Displaying list of moves made */}
        {myColor && (
          <div className="bg-slate-500 w-[200px] h-[450px]  mx-8 rounded-lg" style = {{position:"relative",bottom: showPromotionModal ? "200px":0}}>
            <table className="rounded-lg  h-[450px] ">
              <thead>
                <tr className="w-[200px] flex justify-between">
                  <td className="text-lg w-[100px] border-solid border-white border-[2px]">
                    From{" "}
                  </td>
                  <td className="text-lg w-[100px] border-solid border-white border-[2px]">
                    To{" "}
                  </td>
                </tr>
              </thead>
              <tbody className="h-[420px] overflow-x-hidden overflow-y-auto block">
                {movesList.map((it: any) => {
                  return (
                    <tr className="w-[200px] flex justify-between">
                      <td className="text-lg w-[100px] border-solid border-white border-[2px]">
                        {it.from}{" "}
                      </td>
                      <td className="text-lg w-[100px] border-solid border-white border-[2px]">
                        {it.to}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ChessBoard;
