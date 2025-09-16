// brainly-fe/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/SignUp';
import Dashboard from './pages/dashboard';
import RequireAuth from './components/RequireAuth';
import './index.css';

function RedirectIfAuthed({ children }: { children: JSX.Element }) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? <Navigate to="/" replace /> : children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/signin',
    element: (
      <RedirectIfAuthed>
        <Signin />
      </RedirectIfAuthed>
    ),
  },
  {
    path: '/signup',
    element: (
      <RedirectIfAuthed>
        <Signup />
      </RedirectIfAuthed>
    ),
  },
  // Keep or remove if you don't have a backend route yet:
  // { path: '/share/:slug', element: <ShareView /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
