// Service Auth - panggil API login, register, profile
import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

export const authService = {
  // Login dan dapat token
  login: async (data: LoginRequest) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  // Register user baru
  register: async (data: RegisterRequest) => {
    const res = await api.post<ApiResponse<User>>('/auth/register', data);
    return res.data.data;
  },

  // Ambil profil user yang login
  getProfile: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/profile');
    return res.data.data;
  },
};
