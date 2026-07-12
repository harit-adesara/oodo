import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import { page, card } from "../styles.js";

const SHORTCUTS_BY_ROLE = {
  admin: [
    { to: "/admin/users", label: "Manage employees" },
    { to: "/admin/departments", label: "Manage departments" },
    { to: "/admin/assets", label: "Manage assets" },
  ],
  "asset manager": [
    { to: "/manager/assets", label: "Manage assets" },
    { to: "/manager/allocations", label: "Review allocation requests" },
    { to: "/manager/maintenance", label: "Review maintenance requests" },
  ],
  "department head": [
    { to: "/department/assets", label: "View department assets" },
    { to: "/department/allocations", label: "View allocation requests" },
  ],
  employee: [
    { to: "/employee/assets", label: "Browse department assets" },
    { to: "/employee/allocations", label: "My allocation requests" },
    { to: "/employee/maintenance", label: "My maintenance requests" },
  ],
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const shortcuts = SHORTCUTS_BY_ROLE[user?.role] || [];

  return (
    <div className={page}>
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-[#6b6b7a] text-sm mt-1.5 capitalize">
        {user?.role} dashboard
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {shortcuts.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className={`${card} hover:border-violet-500/40 transition-colors flex items-center justify-between group`}
          >
            <span className="text-sm font-medium text-white">{s.label}</span>
            <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
