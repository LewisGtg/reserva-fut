export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    status: number;
    message: string;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (status: number, message: string): ApiResponse => ({
  success: false,
  error: {
    status,
    message,
  },
});

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
});
