// Tipe data response API standar
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Tipe data pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Query params untuk list
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}
