import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import Game from "./screens/Game";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<LandingPage/>,
    },
  {
    path:"/game",
    element:<Game/>
  }
  ]);
  return (
    <div className="App bg-[#242b25] h-screen">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
