type Move = {
  from: string;
  to: string;
};

type Message = {
  type: string;
  payload?: {
    move?: Move;
    winner?: string;
  };
};
