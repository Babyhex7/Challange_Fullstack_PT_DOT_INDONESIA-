// Tipe data untuk product
export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
}

export interface UpdateProductRequest {
  categoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
