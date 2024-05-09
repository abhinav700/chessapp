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
          {/* Center both horizontally and vertically */}
          <img
            src={"/chessboard.jpeg"}
            className="w-[500px] md:w-[700px]"
          />{" "}
          {/* Set image height */}
        </div>
        <div className=" col-span-1 flex flex-col items-center justify-center md:h-[350px]">
          <h1 className="text-6xl text-[#afbdb1] text-center px-4 py-2 font-bold mb-8">
            Play Chess online on the #1 website
          </h1>{" "}
          {/* Center text, adjust padding, add margin */}
          <Button onClick={onPlayOnlineClick}>
            Play Online
          </Button>
          {/* <button
            onClick={onPlayOnlineClick}
            className="bg-black p-3 text-white rounded-md shadow-md hover:shadow-lg hover:bg-[#1a1919]"
          >
            Play online
          </button>{" "} */}
          {/* Add shadow and hover effect */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
