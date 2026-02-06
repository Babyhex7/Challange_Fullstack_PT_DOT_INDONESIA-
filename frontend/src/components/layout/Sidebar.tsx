// Sidebar - navigasi utama admin panel
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderTree, Package, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

// Menu navigasi
const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/categories", label: "Categories", icon: FolderTree },
  { path: "/products", label: "Products", icon: Package },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo / Judul */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-1">Product Management</p>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Tombol Logout di bawah */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
