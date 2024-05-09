import { useEffect } from "react";
import { GAME_OVER, INIT_GAME, MAKE_MOVE } from "../messages";

const useHandleMessage = (socket: WebSocket | null) => {
  useEffect(() => {
    if (!socket) return;
    
    socket.onmessage = (event) => {
      console.log("Event: ", event);
      const message = JSON.parse(event.data);
      console.log("MESSAGE: ", message);
    
      switch (message.type) {
        case INIT_GAME:
          console.log("initialized game");
          break;
        case MAKE_MOVE:
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
};
export default useHandleMessage;