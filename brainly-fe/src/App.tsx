import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import ShareView from "./pages/ShareView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/share" element={<ShareView />} />
      {/* simple placeholders */}
      <Route path="/tweets" element={<Dashboard />} />
      <Route path="/videos" element={<Dashboard />} />
      <Route path="/documents" element={<Dashboard />} />
      <Route path="/links" element={<Dashboard />} />
      <Route path="/tags" element={<Dashboard />} />
    </Routes>
  );
}
