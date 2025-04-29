/**
 * Interfejs bazowy dla wszystkich odpowiedzi API
 */
export interface ApiResponse {
  status: 'success' | 'error';
}

/**
 * Interfejs dla udanych odpowiedzi API
 */
export interface SuccessResponse<T> extends ApiResponse {
  status: 'success';
  data?: T;
  message?: string;
}

/**
 * Interfejs dla błędnych odpowiedzi API
 */
export interface ErrorResponse extends ApiResponse {
  status: 'error';
  message: string;
  error?: string;
}

/**
 * Typ unii dla wszystkich możliwych odpowiedzi API
 */
export type ApiResponseType<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Interfejs dla odpowiedzi paginowanych
 */
export interface PaginatedResponse<T> extends SuccessResponse<T[]> {
  total: number;
  limit: number;
  offset: number;
}
