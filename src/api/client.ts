import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { storageService } from '../services/storage.service';
import { ApiResponse, AuthTokens } from '../types/auth.types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Plain instance for the refresh call itself — must NOT go through the
// interceptor below, or a failed refresh would trigger infinite recursion.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue this request until the in-flight refresh finishes
        return new Promise((resolve) => {
          pendingQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await storageService.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        // ASSUMPTION: refresh-token endpoint returns the same wrapped shape
        // as login: { success, statusCode, message, data: { accessToken, refreshToken } }
        // Confirm against your actual backend response and adjust if needed.
        const { data } = await refreshClient.post<ApiResponse<AuthTokens>>(
          '/auth/refresh-token',
          { refreshToken }
        );

        await storageService.saveTokens(data.data);
        pendingQueue.forEach((cb) => cb(data.data.accessToken));
        pendingQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await storageService.clearTokens();
        pendingQueue = [];
        // TODO: trigger navigation to Login screen / logout in auth.store here
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);