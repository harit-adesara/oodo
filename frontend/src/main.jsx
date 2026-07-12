import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./context/Auth.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import PublicRoute from "./routes/PublicRoutes.jsx";

import ForgetPassword from "./pages/ForgetPassword.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResendEmail from "./pages/ResendEmail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicRoute />}>
        <Route path="/verify/:verificationToken" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>,
);
