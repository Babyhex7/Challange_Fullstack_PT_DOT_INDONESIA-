// Sidebar - navigasi utama admin panel (modern rounded UI)
import { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderTree, Package, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Menu navigasi
const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/categories", label: "Categories", icon: FolderTree },
  { path: "/products", label: "Products", icon: Package },
];

function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white h-screen flex flex-col fixed left-0 top-0 rounded-tr-3xl rounded-br-3xl">
      {/* Logo */}
      <div className="px-7 py-7">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Admin Panel</h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Product Management
            </p>
          </div>
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-4 mt-2 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 mt-auto">
        {/* User card */}
        <div className="bg-white/5 rounded-2xl p-4 mb-3 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || "admin@mail.com"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

// Optimasi: prevent unnecessary re-renders saat navigasi
export default memo(Sidebar);
