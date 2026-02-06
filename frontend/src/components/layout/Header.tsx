// Header - tampilkan judul halaman & info user (modern rounded UI)
import { useAuthStore } from "../../store/authStore";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
      {/* Judul halaman */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors relative">
          <Bell size={18} className="text-gray-400" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-100" />

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-semibold text-gray-800">
              {user?.name || "Admin"}
            </p>
            <p className="text-gray-400 text-xs">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
