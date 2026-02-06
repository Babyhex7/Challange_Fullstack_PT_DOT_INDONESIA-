// Auth Store - state management login/logout/profile pakai Zustand
import { create } from 'zustand';
import { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  // Login - simpan token & ambil profil
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.access_token);
      set({ token: data.access_token });

      // Setelah login, langsung ambil profil
      const user = await authService.getProfile();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Register - daftar user baru
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      await authService.register({ name, email, password });
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout - hapus token & reset state
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Ambil profil user yg sedang login
  fetchProfile: async () => {
    try {
      const user = await authService.getProfile();
      set({ user });
    } catch {
      // Token expired/invalid, auto logout
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  // Inisialisasi auth waktu app pertama load
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      set({ user, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
