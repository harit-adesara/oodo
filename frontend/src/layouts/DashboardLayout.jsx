import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import { logoutRequest } from "../api.js";

const NAV_BY_ROLE = {
  admin: [
    { to: "/", label: "Overview", end: true },
    { to: "/admin/users", label: "Employees" },
    { to: "/admin/departments", label: "Departments" },
    { to: "/admin/assets", label: "Assets" },
  ],
  "asset manager": [
    { to: "/", label: "Overview", end: true },
    { to: "/manager/assets", label: "Assets" },
    { to: "/manager/allocations", label: "Allocation requests" },
    { to: "/manager/maintenance", label: "Maintenance requests" },
  ],
  "department head": [
    { to: "/", label: "Overview", end: true },
    { to: "/department/assets", label: "Department assets" },
    { to: "/department/allocations", label: "Allocation requests" },
  ],
  employee: [
    { to: "/", label: "Overview", end: true },
    { to: "/employee/assets", label: "Department assets" },
    { to: "/employee/allocations", label: "My allocations" },
    { to: "/employee/maintenance", label: "My maintenance" },
  ],
};

const DashboardLayout = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutRequest();
    } catch (err) {
      // Even if the request fails (expired token, network hiccup) we still
      // want to clear the client-side session and send the user to login.
    } finally {
      setUser(null);
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans flex">
      <aside className="w-64 shrink-0 border-r border-[#1e1e2a] bg-[#0d0d12] flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2L19 7V15L11 20L3 15V7L11 2Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="11" cy="11" r="3" fill="white" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">
            Asset Manager
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-600/15 text-violet-300"
                    : "text-[#8b8b9b] hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-[#1e1e2a]">
          <div className="px-2 mb-3">
            <p className="text-white text-sm font-medium truncate">
              {user?.name}
            </p>
            <p className="text-[#6b6b7a] text-xs capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
