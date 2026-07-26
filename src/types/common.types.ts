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
  success: false;
  statusCode: number | string;
  message: string;
  name: string;
  errorInfo: Record<string, unknown>;
}
