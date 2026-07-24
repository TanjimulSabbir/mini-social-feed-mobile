export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
}

export interface GenericErrorResponse {
  statusCode: number | string;
  message: string;
  errorName: string;
  errorInfo: Record<string, unknown>;
}