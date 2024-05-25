import React from "react";

type ButtonPropTypes = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?:React.ReactNode,
  style:string
};
const Button = ({ onClick, children,style }: ButtonPropTypes) => {
  return (
    <>
      <button className={style} onClick={onClick}>
{children}
      </button>
    </>
  );
};

export default Button;
