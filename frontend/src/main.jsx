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
import RoleRoute from "./routes/RoleRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import Login from "./pages/Login.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import AdminUsers from "./pages/admin/Users.jsx";
import AdminDepartments from "./pages/admin/Departments.jsx";
import AdminAssets from "./pages/admin/Assets.jsx";

import ManagerAssets from "./pages/manager/Assets.jsx";
import ManagerAllocations from "./pages/manager/Allocations.jsx";
import ManagerMaintenance from "./pages/manager/Maintenance.jsx";

import DeptAssets from "./pages/department/Assets.jsx";
import DeptAllocations from "./pages/department/Allocations.jsx";

import EmployeeAssets from "./pages/employee/Assets.jsx";
import EmployeeAllocations from "./pages/employee/Allocations.jsx";
import EmployeeMaintenance from "./pages/employee/Maintenance.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes - redirect to "/" if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      </Route>

      {/* Everything below requires a logged-in session */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/assets" element={<AdminAssets />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["asset manager"]} />}>
            <Route path="/manager/assets" element={<ManagerAssets />} />
            <Route
              path="/manager/allocations"
              element={<ManagerAllocations />}
            />
            <Route
              path="/manager/maintenance"
              element={<ManagerMaintenance />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["department head"]} />}>
            <Route path="/department/assets" element={<DeptAssets />} />
            <Route
              path="/department/allocations"
              element={<DeptAllocations />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={["employee"]} />}>
            <Route path="/employee/assets" element={<EmployeeAssets />} />
            <Route
              path="/employee/allocations"
              element={<EmployeeAllocations />}
            />
            <Route
              path="/employee/maintenance"
              element={<EmployeeMaintenance />}
            />
          </Route>
        </Route>
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
