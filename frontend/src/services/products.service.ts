// Service Products - panggil API CRUD products
import api from "./api";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product.types";
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
} from "../types/api.types";

export const productsService = {
  // Ambil semua products (pagination + search + filter category)
  getAll: async (params?: QueryParams) => {
    const res = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      "/products",
      { params },
    );
    return res.data.data;
  },

  // Ambil 1 product by ID
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },

  // Buat product baru
  create: async (data: CreateProductRequest) => {
    const res = await api.post<ApiResponse<Product>>("/products", data);
    return res.data.data;
  },

  // Update product
  update: async (id: number, data: UpdateProductRequest) => {
    const res = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return res.data.data;
  },

  // Hapus product
  delete: async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
