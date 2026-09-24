export type ApiError = {
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  totalItems?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}
