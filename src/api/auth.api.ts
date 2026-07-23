import { apiClient } from './client';
import { ApiResponse, AuthTokens, LoginPayload, SignupPayload } from '../types/auth.types';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', payload);
    return data.data;
  },

  async signup(payload: SignupPayload): Promise<void> {
    await apiClient.post<ApiResponse<unknown>>('/auth/signup', payload);
  },
};