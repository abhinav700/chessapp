type Move = {
  from: string;
  to: string;
  promotion?:string;
};

type Message = {
  type: string;
  payload?: {
    move?: Move;
    winner?: string;
  };
};
