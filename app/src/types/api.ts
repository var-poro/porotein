export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

export interface ApiResponse<T = void> {
  data: T;
  message?: string;
} 