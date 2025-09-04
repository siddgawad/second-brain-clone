import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Da
import ShareView from "./pages/ShareView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "share/:hash", element: <ShareView /> }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
