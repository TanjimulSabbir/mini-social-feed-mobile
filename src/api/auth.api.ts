import { apiClient } from './client';
import {  AuthTokens, LoginPayload, SignupPayload } from '../types/auth.types';
import { ApiResponse } from '@/types/common.types';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', payload);
    return data.data;
  },

  async signup(payload: SignupPayload): Promise<void> {
    await apiClient.post<ApiResponse<unknown>>('/auth/signup', payload);
  },
};