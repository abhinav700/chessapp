import React from "react";
import Chessboard from "../Components/Chessboard";
import Button from "../Components/Button";
import useSocket from "../hooks/useSocket";
import { INIT_GAME } from "../messages";
import useHandleMessage from "../hooks/useHandleMessage";

const Game = () => {
  const socket = useSocket();
  useHandleMessage(socket);
  const onClickPlay = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
     const emitMessage = JSON.stringify({
      type:INIT_GAME
     })  
     socket?.send(emitMessage);
  }

  if(!socket)
      return <div>Connecting</div>
  return (

    <div className="justify-center w-full flex">
      <div className="mt-8  mx-[50px] max-w-screen-xl w-full flex flex-row grid grid-cols-6 gap-4">
        <div className="col-span-4 w-full bg-red-500">
          <Chessboard />
        </div>
        <div>
            <Button onClick={onClickPlay}>Start Game</Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
