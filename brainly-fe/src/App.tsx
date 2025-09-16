import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";
import ShareView from "./pages/ShareView";
import RequireAuth from "./components/RequireAuth";
import { Navigate } from "react-router-dom";

function RedirectIfAuthed({ children }: { children: JSX.Element }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return token ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
   {/* Protected app routes */}
   <Route path="/" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />

      {/* Auth pages should be unreachable when already signed in */}
      <Route path="/signin" element={<RedirectIfAuthed><SignIn /></RedirectIfAuthed>} />
      <Route path="/signup" element={<RedirectIfAuthed><SignUp /></RedirectIfAuthed>} />

      {/* If /share is meant to be public, leave it unguarded.
         If not, wrap with <RequireAuth> too. */}
      <Route path="/share" element={<ShareView />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* simple placeholders */}
      <Route path="/tweets" element={<Dashboard />} />
      <Route path="/videos" element={<Dashboard />} />
      <Route path="/documents" element={<Dashboard />} />
      <Route path="/links" element={<Dashboard />} />
      <Route path="/tags" element={<Dashboard />} />
    </Routes>
  );
}
