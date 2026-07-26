import axios from "axios";
import { API_BASE_URL } from "@/constants/config";
import { AuthTokens } from "@/types/auth.types";
import { storageService } from "@/services/storage.services";
import { ApiResponse } from "@/types/common.types";
import { useAuthStore } from "@/store/auth.store";
import { tokenService } from "@/services/token.service";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const refreshClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
let pendingQueue: QueueEntry[] = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            },
            reject,
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
          { skipAuthRefresh: true },
        );

        await storageService.saveTokens(data.data);
        flushQueue(null, data.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await storageService.clearTokens();
        flushQueue(refreshError, null);

        useAuthStore.getState().logout?.();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
