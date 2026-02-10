// MainLayout - layout utama: sidebar + content (modern rounded UI)
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100/70">
      {/* Sidebar kiri (fixed) */}
      <Sidebar />

      {/* Area konten utama - kasih margin kiri sebesar width sidebar */}
      <div className="flex-1 flex flex-col ml-72">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
