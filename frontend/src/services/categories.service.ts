// Service Categories - panggil API CRUD categories
import api from './api';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category.types';
import { ApiResponse, PaginatedResponse, QueryParams } from '../types/api.types';

export const categoriesService = {
  // Ambil semua categories (pagination + search)
  getAll: async (params?: QueryParams) => {
    const res = await api.get<ApiResponse<PaginatedResponse<Category>>>('/categories', { params });
    return res.data.data;
  },

  // Ambil 1 category by ID
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return res.data.data;
  },

  // Buat category baru
  create: async (data: CreateCategoryRequest) => {
    const res = await api.post<ApiResponse<Category>>('/categories', data);
    return res.data.data;
  },

  // Update category
  update: async (id: number, data: UpdateCategoryRequest) => {
    const res = await api.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data.data;
  },

  // Hapus category
  delete: async (id: number) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};
