// Tipe data untuk category
export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}
