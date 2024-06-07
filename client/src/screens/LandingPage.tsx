import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";

const LandingPage = () => {
  const navigate = useNavigate();
  const onPlayOnlineClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate('/game')
  };
  return (
    <div className="flex justify-center items-center h-full">
      <div className="max-w-[1200px] mt-2 gap-4 grid grid-cols-2 md:grid-cols-2">
        <div className=" col-span-1 flex justify-center items-center">
          {" "}
          <img
            src={"/images/chessboard.jpeg"}
            className="w-[500px] md:w-[700px]"
          />{" "}
        </div>
        <div className=" col-span-1 flex flex-col items-center justify-center md:h-[350px]">
          <h1 className="text-6xl text-[#afbdb1] text-center px-4 py-2 font-bold mb-8">
            Play Chess online on the #1 website
          </h1>{" "}
          <Button style = {"px-8 py-2 font-bold bg-green-700 rounded text-white hover:bg-green-600 cursor-pointer col-span-2"} onClick={onPlayOnlineClick}>
            Play Online
          </Button>
        
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
