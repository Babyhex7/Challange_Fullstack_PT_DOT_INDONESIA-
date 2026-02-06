// Header - tampilkan judul halaman & info user
import { useAuthStore } from '../../store/authStore';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string; // Judul halaman
}

export default function Header({ title }: HeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Judul halaman */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      {/* Info user yg login */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
          <User size={18} className="text-blue-600" />
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-700">{user?.name || 'Admin'}</p>
          <p className="text-gray-400 text-xs">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}
