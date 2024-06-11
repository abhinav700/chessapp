import React, { useState } from "react";
import Button from "../Components/Button";
import useSocket from "../hooks/useSocket";
import { INIT_GAME } from "../messages";
import useHandleMessage from "../hooks/useHandleMessage";
import ChessBoard from "../Components/ChessBoard";

const Game = () => {
  const socket = useSocket();
  const [movesList, setMovesList] = useState<any>([])

  const { chess, board, setBoard, playerColor } = useHandleMessage(socket, movesList, setMovesList);
  const [started, setStarted] = useState(false);
  const onClickPlay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setStarted((started) => true);
    const emitMessage = JSON.stringify({
      type: INIT_GAME,
    });
    socket?.send(emitMessage);
  };

  if (!socket) return <div>Connecting</div>;
  return (
    <div className="justify-center w-[100vw] - flex">
      <div className="mt-8  mx-[50px] max-w-screen-xl w-[100vw] flex flex-row justify-center items-center grid grid-cols-6 gap-4">
        <div className="col-span-4 w-full  bg--500">
          <ChessBoard
            chess={chess}
            board={board!}
            socket={socket}
            setBoard={setBoard}
            myColor={playerColor}
            movesList = {movesList}
            setMovesList = {setMovesList}
          />
        </div>
        <div className=" ">
          {!started ? <Button
            style="p-5 text-3xl rounded-lg text-white font-bold bg-green-600"
            onClick={onClickPlay}
          >
            Start Game
          </Button> : null}
        </div>
      </div>
    </div>
  );
};

export default Game;
