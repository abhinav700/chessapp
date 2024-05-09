import React from "react";

type ButtonPropTypes = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?:React.ReactNode
};
const Button = ({ onClick, children }: ButtonPropTypes) => {
  return (
    <>
      <button className="px-8 py-2 font-bold bg-green-700 rounded text-white hover:bg-green-600 cursor-pointer col-span-2" onClick={onClick}>
{children}
      </button>
    </>
  );
};

export default Button;
