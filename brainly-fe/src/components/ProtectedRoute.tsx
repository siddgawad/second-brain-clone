import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { authed } = useAuth();
  return authed ? <Outlet /> : <Navigate to="/signin" replace />;
}
