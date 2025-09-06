import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/SignUp';
import Dashboard from './pages/dashboard';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/signin', element: <Signin /> },
  { path: '/signup', element: <Signup /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
