// App - routing utama aplikasi
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  // Inisialisasi auth saat app pertama kali load
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      {/* Notifikasi toast */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* Halaman login (publik) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Halaman admin (butuh login) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        {/* Route gak ditemukan, redirect ke dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
