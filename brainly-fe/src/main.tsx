import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import ShareView from "./pages/ShareView";

const router = createBrowserRouter([
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { element: <ProtectedRoute />, children: [{ path: "/", element: <Dashboard /> }] },
  { path: "/share/:slug", element: <ShareView /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
