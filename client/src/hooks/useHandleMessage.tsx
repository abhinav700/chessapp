import { useEffect, useState } from "react";
import { GAME_OVER, INIT_GAME, MAKE_MOVE } from "../messages";
import { Chess } from "chess.js";

const useHandleMessage = (socket: WebSocket | null) => {
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [board, setBoard] = useState(chess?.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      console.log("Event: ", event);
      const message = JSON.parse(event.data);
      console.log("MESSAGE: ", message);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          console.log("initialized game");
          break;

        case MAKE_MOVE:
          const move = message.payload.move;
          console.log("Use handlemesssage ", move)
          try {
            chess?.move(move);
            setBoard(chess?.board());
            console.log("Move made");
          } catch (error) {
            console.log(error);
          }
          console.log("Made a move");
          break;

        case GAME_OVER:
          console.log("Game is over");
          break;
        default:
          break;
      }
    };
  }, [socket]);
  return {chess, board,  setBoard};
};
export default useHandleMessage;
