import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";

// Sits inside <ProtectedRoute />, so by the time this renders `loading` is
// already false and `user` is already set - ProtectedRoute handles both
// of those cases itself. This component only needs to check the role.
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
