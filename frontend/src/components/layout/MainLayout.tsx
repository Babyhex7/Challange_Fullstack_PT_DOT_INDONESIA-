// MainLayout - layout utama: sidebar + header + content
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Area konten utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Konten halaman (dari child route) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
