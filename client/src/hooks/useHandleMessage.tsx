import { useEffect, useState } from "react";
import { GAME_OVER, INIT_GAME, MAKE_MOVE } from "../messages";
import { Chess } from "chess.js";
import moveSelfAudio  from "../assets/sounds/move-self.mp3"
import { playSound } from "../utils/playSound";

const useHandleMessage = (socket: WebSocket | null) => {
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [board, setBoard] = useState(chess?.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          break;

        case MAKE_MOVE:
          const move = message.payload.move;
          try {
            chess?.move(move);
            setBoard(chess?.board());
          playSound(moveSelfAudio)

          } catch (error) {
            console.log(error);
          }
          break;

        case GAME_OVER:
          break;
        default:
          break;
      }
    };
  }, [socket]);
  return {chess, board,  setBoard};
};
export default useHandleMessage;