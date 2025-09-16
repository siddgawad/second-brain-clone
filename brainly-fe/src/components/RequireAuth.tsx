// brainly-fe/src/components/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const loc = useLocation();
  if (!token) return <Navigate to="/signin" replace state={{ from: loc }} />;
  return children;
}
