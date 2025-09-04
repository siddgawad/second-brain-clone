import React from "react";
import Dashboard from "./pages/dashboard";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/Signin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
