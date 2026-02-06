// ProtectedRoute - cek apakah user sudah login, kalo belum redirect ke /login
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = useAuthStore((s) => s.token);

  // Kalo gak ada token, redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
