import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TodoList from "./pages/TodoList";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import Landing from "./pages/Landing.jsx";
import FourOhFour from "./pages/FourOhFour.jsx";
const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />{" "}
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Landing />,
    errorElement: <FourOhFour />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },

  {
    path: "/todo/:projectId",
    element: (
      <ProtectedRoute>
        <TodoList />
      </ProtectedRoute>
    ),
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
