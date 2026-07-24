import { create } from "axios";
import { API_BASE_URL } from "@/constants/config";
import { AuthTokens } from "@/types/auth.types";
import { storageService } from "@/services/storage.services";
import { ApiResponse } from "@/types/common.types";

export const apiClient = create({
  baseURL: API_BASE_URL,
});

const refreshClient = create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: ((token: string) => void)[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
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
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await refreshClient.post<ApiResponse<AuthTokens>>(
          "/auth/refresh-token",
          { refreshToken },
        );

        await storageService.saveTokens(data.data);
        pendingQueue.forEach((cb) => cb(data.data.accessToken));
        pendingQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await storageService.clearTokens();
        pendingQueue = [];

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
