import { useEffect, useState } from "react";
require("dotenv").config();

const WS_SERVER_URL = process.env.REACT_APP_WS_SERVER_URL
  ? process.env.REACT_APP_WS_SERVER_URL
  : "ws://localhost:8080";

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(WS_SERVER_URL);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("disconnected");
      setSocket(null);
    };
    ws.onmessage = (data) => {
      const message = JSON.parse(JSON.stringify(data));
    };
    return () => {
      setSocket(null);
    };
  }, []);
  return socket;
};

export default useSocket;
