import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from './Layout.jsx';
import Content from './Components/Content.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Nutrition from './Components/Nutrition.jsx';
import NotFound from './Components/NotFound.jsx';
import Settings from './Components/Settings.jsx';
import { AuthProvider } from './Components/AuthContext.jsx';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Content /> },
      { path: 'workout', element: <div>Workout Page</div> },
      { path: 'nutrition', element: <Nutrition/> },
      { path: 'progress', element: <div>Progress Page</div> },
      { path: 'setting', element: <Settings/> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ]
  }
])


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
